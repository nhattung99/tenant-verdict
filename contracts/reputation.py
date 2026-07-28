# v0.2.16
# { "Depends": "py-genlayer:v0.2.16" }
from genlayer import *

class Contract(gl.Contract):
    total_disputes: TreeMap[str, u256]
    wins: TreeMap[str, u256]
    losses: TreeMap[str, u256]
    trust_scores: TreeMap[str, u256]
    admin: Address
    court_address: Address

    def __init__(self):
        self.admin = gl.message.sender
        self.court_address = gl.message.sender

    @gl.public.write
    def set_court_address(self, court: Address):
        if gl.message.sender != self.admin:
            raise UserError("Only admin can set court address")
        self.court_address = court

    @gl.public.write
    def record_dispute_result(self, user: Address, is_winner: bool, refund_pct: u256):
        if gl.message.sender != self.court_address and gl.message.sender != self.admin:
            raise UserError("Only authorized court can update reputation")

        user_key = str(user)
        tot = self.total_disputes.get(user_key, u256(0)) + u256(1)
        w = self.wins.get(user_key, u256(0)) + (u256(1) if is_winner else u256(0))
        l = self.losses.get(user_key, u256(0)) + (u256(0) if is_winner else u256(1))
        
        trust = (w * u256(100)) // tot

        self.total_disputes[user_key] = tot
        self.wins[user_key] = w
        self.losses[user_key] = l
        self.trust_scores[user_key] = trust

    @gl.public.view
    def get_trust_score(self, user: Address) -> u256:
        user_key = str(user)
        return self.trust_scores.get(user_key, u256(100))

    @gl.public.view
    def get_total_disputes(self, user: Address) -> u256:
        user_key = str(user)
        return self.total_disputes.get(user_key, u256(0))

    @gl.public.view
    def get_wins(self, user: Address) -> u256:
        user_key = str(user)
        return self.wins.get(user_key, u256(0))

    @gl.public.view
    def get_losses(self, user: Address) -> u256:
        user_key = str(user)
        return self.losses.get(user_key, u256(0))
