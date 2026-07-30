# v0.2.16
# { "Depends": "py-genlayer:v0.2.16" }
from genlayer import *

class Contract(gl.Contract):
    scores: TreeMap[str, u256]
    dispute_counts: TreeMap[str, u256]
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

        u_key = str(user)
        c = self.dispute_counts.get(u_key, u256(0)) + u256(1)
        self.dispute_counts[u_key] = c

        if is_winner:
            cur = self.scores.get(u_key, u256(100))
            if cur + u256(5) <= u256(100):
                self.scores[u_key] = cur + u256(5)
            else:
                self.scores[u_key] = u256(100)
        else:
            cur = self.scores.get(u_key, u256(100))
            if cur >= u256(10):
                self.scores[u_key] = cur - u256(10)
            else:
                self.scores[u_key] = u256(0)

    @gl.public.view
    def get_score(self, user: Address) -> u256:
        return self.scores.get(str(user), u256(100))

    @gl.public.view
    def get_dispute_count(self, user: Address) -> u256:
        return self.dispute_counts.get(str(user), u256(0))
