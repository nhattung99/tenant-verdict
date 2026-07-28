# v0.2.16
# { "Depends": "py-genlayer:v0.2.16" }
from genlayer import *

class Contract(gl.Contract):
    balances: TreeMap[str, bigint]
    court_address: Address
    admin: Address

    def __init__(self):
        super().__init__()
        self.admin = gl.message.sender
        self.court_address = gl.message.sender

    @gl.public.write
    def set_court_address(self, court: Address):
        if gl.message.sender != self.admin:
            raise UserError("Only admin can set court address")
        self.court_address = court

    @gl.public.write
    def deposit(self, dispute_id: str):
        # Native GEN attached to the transaction via gl.message.value
        amount = gl.message.value
        if amount <= bigint(0):
            raise UserError("Deposit amount must be greater than 0")
        
        if dispute_id in self.balances and self.balances[dispute_id] > bigint(0):
            raise UserError("Escrow deposit already exists for this dispute")

        self.balances[dispute_id] = amount

    @gl.public.write
    def release_payout(self, dispute_id: str, tenant: Address, landlord: Address, tenant_refund_pct: u256):
        # Must be invoked by DisputeCourt after verdict finalization
        if gl.message.sender != self.court_address and gl.message.sender != self.admin:
            raise UserError("Only authorized court contract can release payouts")

        if dispute_id not in self.balances or self.balances[dispute_id] <= bigint(0):
            raise UserError("No escrowed balance found for dispute")

        if tenant_refund_pct > u256(100):
            raise UserError("Tenant refund percentage cannot exceed 100%")

        total = self.balances[dispute_id]
        tenant_share = (total * bigint(tenant_refund_pct)) // bigint(100)
        landlord_share = total - tenant_share

        # Clear balance before transfers (reentrancy prevention)
        self.balances[dispute_id] = bigint(0)

        # Distribute payouts natively using GenLayer transfer primitives (no gl.eth.send_value)
        if tenant_share > bigint(0):
            gl.transfer(tenant, tenant_share)
        if landlord_share > bigint(0):
            gl.transfer(landlord, landlord_share)

    @gl.public.view
    def get_escrow_balance(self, dispute_id: str) -> str:
        if dispute_id not in self.balances:
            return "0"
        return str(self.balances[dispute_id])
