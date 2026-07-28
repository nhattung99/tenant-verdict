import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Note for running: gltest tests/test_dispute_court.py --network localnet

def test_dispute_court_structure():
    """Verify importability and contract syntax for GenLayer Studio deployment."""
    from contracts import dispute_court, treasury, reputation
    assert hasattr(dispute_court, "Contract")
    assert hasattr(treasury, "Contract")
    assert hasattr(reputation, "Contract")

def test_json_verdict_parser():
    from contracts.dispute_court import _parse_verdict_json

    # Test clean raw JSON
    valid_raw = '{"tenant_refund_pct": 75, "confidence": 90, "reason": "Normal wear and tear on carpets"}'
    parsed = _parse_verdict_json(valid_raw)
    assert parsed["tenant_refund_pct"] == 75
    assert parsed["confidence"] == 90
    assert parsed["reason"] == "Normal wear and tear on carpets"

    # Test JSON wrapped in markdown backticks
    fenced_raw = """```json
{"tenant_refund_pct": 50, "confidence": 85, "reason": "Scratched floor"}
```"""
    parsed_fenced = _parse_verdict_json(fenced_raw)
    assert parsed_fenced["tenant_refund_pct"] == 50

    # Test malformed JSON exception
    with pytest.raises(Exception):
        _parse_verdict_json("Invalid response from LLM")

def test_dispute_lifecycle():
    from contracts.dispute_court import Contract as DisputeCourtContract
    from genlayer import Address, bigint, UserError

    court = DisputeCourtContract()
    tenant = Address("0x0000000000000000000000000000000000000002")
    movein_urls = ["https://example.com/movein1.jpg", "https://example.com/movein2.jpg"]

    # 1. Create dispute
    dispute_id = court.create_dispute(tenant, movein_urls)
    assert dispute_id == "1"

    d_info = court.get_dispute("1")
    assert d_info["status"] == "OPEN"
    assert d_info["tenant"] == str(tenant)
    assert d_info["deposit_amount"] == "1000000000000000000"

    # 2. Submit tenant evidence
    moveout_urls = ["https://example.com/moveout1.jpg"]
    court.submit_tenant_evidence("1", moveout_urls, "Landlord is withholding deposit unfairly for preexisting wall marks.")
    
    d_info = court.get_dispute("1")
    assert d_info["status"] == "AWAITING_VERDICT"
    assert len(d_info["moveout_evidence_urls"]) == 1

    # 3. Request verdict
    court.request_verdict("1")

    d_info = court.get_dispute("1")
    assert d_info["status"] == "CLOSED"
    assert d_info["tenant_refund_pct"] == 75
    assert d_info["confidence"] == 90

def test_zero_deposit_error():
    from contracts.dispute_court import Contract as DisputeCourtContract
    from genlayer import Address, gl, bigint, UserError

    court = DisputeCourtContract()
    tenant = Address("0x0000000000000000000000000000000000000002")
    gl.message.value = bigint(0)

    with pytest.raises(UserError) as exc_info:
        court.create_dispute(tenant, ["https://example.com/movein.jpg"])
    assert "Deposit amount must be greater than 0" in str(exc_info.value)
    gl.message.value = bigint(1000000000000000000)
