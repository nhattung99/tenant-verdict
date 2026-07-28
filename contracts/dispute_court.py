# v0.2.16
# { "Depends": "py-genlayer:v0.2.16" }
import json
from dataclasses import dataclass
from genlayer import *

@allow_storage
@dataclass
class Dispute:
    landlord: Address
    tenant: Address
    deposit_amount: bigint
    movein_evidence_urls: DynArray[str]
    moveout_evidence_urls: DynArray[str]
    tenant_statement: str
    status: str  # "OPEN" | "AWAITING_VERDICT" | "AWAITING_APPEAL" | "VERDICT_ISSUED" | "CLOSED"
    tenant_refund_pct: u256  # 0-100
    verdict_reason: str
    confidence: u256  # 0-100
    appeal_count: u256

def _parse_verdict_json(raw_text: str) -> dict:
    """Helper function to strip markdown fences and parse LLM JSON verdict."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if len(lines) >= 2 and lines[0].startswith("```"):
            lines = lines[1:]
        if len(lines) >= 1 and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    
    try:
        data = json.loads(cleaned)
    except Exception as e:
        raise UserError(f"Invalid JSON returned by AI arbitrator: {str(e)}")

    if "tenant_refund_pct" not in data or "confidence" not in data or "reason" not in data:
        raise UserError("Missing required keys in AI verdict response JSON")

    pct = int(data["tenant_refund_pct"])
    conf = int(data["confidence"])

    if pct < 0 or pct > 100:
        raise UserError(f"tenant_refund_pct out of bounds (0-100): {pct}")
    if conf < 0 or conf > 100:
        raise UserError(f"confidence out of bounds (0-100): {conf}")

    return {
        "tenant_refund_pct": pct,
        "confidence": conf,
        "reason": str(data["reason"]),
    }

class Contract(gl.Contract):
    disputes: TreeMap[str, Dispute]
    dispute_counter: bigint
    treasury_address: Address
    reputation_address: Address
    admin: Address

    def __init__(self):
        self.dispute_counter = bigint(0)
        self.admin = gl.message.sender
        self.treasury_address = gl.message.sender
        self.reputation_address = gl.message.sender

    @gl.public.write
    def set_treasury_address(self, treasury: Address):
        if gl.message.sender != self.admin:
            raise UserError("Only admin can set court address")
        self.treasury_address = treasury

    @gl.public.write
    def set_reputation_address(self, reputation: Address):
        if gl.message.sender != self.admin:
            raise UserError("Only admin can set reputation address")
        self.reputation_address = reputation

    @gl.public.write
    def create_dispute(self, tenant: Address, movein_urls: DynArray[str]) -> str:
        deposit_val = gl.message.value
        if deposit_val <= bigint(0):
            raise UserError("Deposit amount must be greater than 0")
        
        if len(movein_urls) == 0:
            raise UserError("Move-in evidence URLs list cannot be empty")

        self.dispute_counter += bigint(1)
        dispute_id = str(self.dispute_counter)

        new_dispute = Dispute(
            landlord=gl.message.sender,
            tenant=tenant,
            deposit_amount=deposit_val,
            movein_evidence_urls=movein_urls,
            moveout_evidence_urls=DynArray[str](),
            tenant_statement="",
            status="OPEN",
            tenant_refund_pct=u256(0),
            verdict_reason="",
            confidence=u256(0),
            appeal_count=u256(0),
        )

        self.disputes[dispute_id] = new_dispute
        return dispute_id

    @gl.public.write
    def submit_tenant_evidence(self, dispute_id: str, moveout_urls: DynArray[str], statement: str):
        if dispute_id not in self.disputes:
            raise UserError("Dispute ID does not exist")

        dispute = self.disputes[dispute_id]
        if dispute.status != "OPEN":
            raise UserError(f"Cannot submit evidence when dispute status is {dispute.status}")

        if gl.message.sender != dispute.tenant and gl.message.sender != dispute.landlord:
            raise UserError("Only involved tenant or landlord can submit evidence")

        if len(moveout_urls) == 0:
            raise UserError("Move-out evidence URLs list cannot be empty")

        dispute.moveout_evidence_urls = moveout_urls
        dispute.tenant_statement = statement
        dispute.status = "AWAITING_VERDICT"
        self.disputes[dispute_id] = dispute

    @gl.public.write
    def request_verdict(self, dispute_id: str):
        if dispute_id not in self.disputes:
            raise UserError("Dispute ID does not exist")

        dispute = self.disputes[dispute_id]

        if dispute.status in ["VERDICT_ISSUED", "CLOSED"]:
            raise UserError(f"Verdict already issued or dispute closed for ID {dispute_id}")

        if dispute.status == "OPEN":
            raise UserError("Tenant move-out evidence must be submitted before requesting verdict")

        movein_urls = dispute.movein_evidence_urls
        moveout_urls = dispute.moveout_evidence_urls
        statement = dispute.tenant_statement
        deposit = dispute.deposit_amount

        def leader_fn() -> dict:
            movein_contents = []
            for u in movein_urls:
                try:
                    res = gl.nondet.web.render(u)
                    movein_contents.append(str(res))
                except Exception as e:
                    raise UserError(f"Failed to render move-in evidence URL '{u}': {str(e)}")

            moveout_contents = []
            for u in moveout_urls:
                try:
                    res = gl.nondet.web.render(u)
                    moveout_contents.append(str(res))
                except Exception as e:
                    raise UserError(f"Failed to render move-out evidence URL '{u}': {str(e)}")

            prompt = f"""You are an impartial AI security deposit dispute arbitrator on GenLayer.
Examine the following evidence:
Move-in Condition Evidence: {movein_contents}
Move-out Condition Evidence: {moveout_contents}
Tenant Counter-Statement: {statement}
Escrow Deposit Amount: {deposit}

Evaluate fair wear-and-tear vs damage caused by tenant negligence.
Determine:
1. "tenant_refund_pct": Integer 0 to 100 representing the percentage of deposit to be refunded to tenant.
2. "confidence": Integer 0 to 100 representing your confidence in this verdict based on clarity of evidence.
3. "reason": A detailed breakdown of your verdict reasoning.

Return ONLY a valid raw JSON object with NO markdown formatting, NO backticks:
{{"tenant_refund_pct": <0-100>, "confidence": <0-100>, "reason": "<explanation>"}}"""

            raw = gl.nondet.exec_prompt(prompt)
            return _parse_verdict_json(raw)

        def validator_fn(leader_res) -> bool:
            leader_val_dict = getattr(leader_res, 'value', leader_res)
            if not isinstance(leader_val_dict, dict) or "tenant_refund_pct" not in leader_val_dict:
                return False
            try:
                my_res = leader_fn()
            except Exception:
                return False

            leader_val = leader_val_dict["tenant_refund_pct"]
            my_val = my_res["tenant_refund_pct"]
            return abs(my_val - leader_val) <= 5

        result = gl.vm.run_nondet(leader_fn, validator_fn)

        refund_pct = u256(result["tenant_refund_pct"])
        confidence = u256(result["confidence"])
        reason = str(result["reason"])

        dispute.tenant_refund_pct = refund_pct
        dispute.confidence = confidence
        dispute.verdict_reason = reason

        if confidence < u256(60):
            dispute.status = "AWAITING_APPEAL"
            self.disputes[dispute_id] = dispute
        else:
            dispute.status = "VERDICT_ISSUED"
            self.disputes[dispute_id] = dispute
            self._finalize_dispute_payout(dispute_id)

    @gl.public.write
    def appeal_verdict(self, dispute_id: str):
        if dispute_id not in self.disputes:
            raise UserError("Dispute ID does not exist")

        dispute = self.disputes[dispute_id]
        if dispute.status not in ["AWAITING_APPEAL", "VERDICT_ISSUED"]:
            raise UserError(f"Cannot appeal dispute with status {dispute.status}")

        if dispute.appeal_count >= u256(2):
            raise UserError("Maximum appeal count (2) reached for this dispute")

        dispute.appeal_count += u256(1)

        movein_urls = dispute.movein_evidence_urls
        moveout_urls = dispute.moveout_evidence_urls
        statement = dispute.tenant_statement
        deposit = dispute.deposit_amount
        previous_reason = dispute.verdict_reason

        def leader_fn() -> dict:
            movein_contents = [gl.nondet.web.render(u) for u in movein_urls]
            moveout_contents = [gl.nondet.web.render(u) for u in moveout_urls]
            
            prompt = f"""You are the Chief Appeals AI Arbitrator on GenLayer reviewing an appealed security deposit dispute.
Move-in Evidence: {movein_contents}
Move-out Evidence: {moveout_contents}
Tenant Statement: {statement}
Escrow Amount: {deposit}
Previous Round Analysis: {previous_reason}

Conduct a rigorous re-examination.
Return ONLY raw JSON with NO markdown backticks:
{{"tenant_refund_pct": <0-100>, "confidence": <0-100>, "reason": "<appeals ruling reason>"}}"""

            raw = gl.nondet.exec_prompt(prompt)
            return _parse_verdict_json(raw)

        def validator_fn(leader_res) -> bool:
            leader_val_dict = getattr(leader_res, 'value', leader_res)
            if not isinstance(leader_val_dict, dict) or "tenant_refund_pct" not in leader_val_dict:
                return False
            try:
                my_res = leader_fn()
            except Exception:
                return False
            return abs(my_res["tenant_refund_pct"] - leader_val_dict["tenant_refund_pct"]) <= 5

        result = gl.vm.run_nondet(leader_fn, validator_fn)

        dispute.tenant_refund_pct = u256(result["tenant_refund_pct"])
        dispute.confidence = u256(result["confidence"])
        dispute.verdict_reason = f"[APPEAL ROUND {dispute.appeal_count}] " + str(result["reason"])
        dispute.status = "VERDICT_ISSUED"
        self.disputes[dispute_id] = dispute

        self._finalize_dispute_payout(dispute_id)

    def _finalize_dispute_payout(self, dispute_id: str):
        dispute = self.disputes[dispute_id]
        refund_pct = dispute.tenant_refund_pct

        treasury = gl.get_contract_at(self.treasury_address)
        treasury.release_payout(dispute_id, dispute.tenant, dispute.landlord, refund_pct)

        reputation = gl.get_contract_at(self.reputation_address)
        tenant_won = refund_pct >= u256(50)
        reputation.record_dispute_result(dispute.tenant, tenant_won, refund_pct)
        reputation.record_dispute_result(dispute.landlord, not tenant_won, u256(100) - refund_pct)

        dispute.status = "CLOSED"
        self.disputes[dispute_id] = dispute

    @gl.public.view
    def get_dispute_status(self, dispute_id: str) -> str:
        if dispute_id not in self.disputes:
            return ""
        return str(self.disputes[dispute_id].status)

    @gl.public.view
    def get_dispute_count(self) -> u256:
        return u256(self.dispute_counter)
