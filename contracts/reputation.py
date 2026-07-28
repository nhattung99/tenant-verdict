# v0.2.16
# { "Depends": "py-genlayer:v0.2.16" }
from genlayer import *

@allow_storage
@dataclass
class ReputationScore:
    total_disputes: u256
    wins: u256
    losses: u256
    trust_score: u256  # 0 to 100 percentage

class Contract(gl.Contract):
    reputation_scores: TreeMap[Address, ReputationScore]
    admin: Address
    court_address: Address

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
    def record_dispute_result(self, user: Address, is_winner: bool, refund_pct: u256):
        # Called by DisputeCourt when a verdict is issued
        if gl.message.sender != self.court_address and gl.message.sender != self.admin:
            raise UserError("Only authorized court can update reputation")

        if user not in self.reputation_scores:
            current = ReputationScore(
                total_disputes=u256(0),
                wins=u256(0),
                losses=u256(0),
                trust_score=u256(100),
            )
        else:
            current = self.reputation_scores[user]

        new_total = current.total_disputes + u256(1)
        new_wins = current.wins + (u256(1) if is_winner else u256(0))
        new_losses = current.losses + (u256(0) if is_winner else u256(1))

        # Calculate trust score: starting at 100, weighted by win ratio
        win_ratio = (new_wins * u256(100)) // new_total
        new_trust = win_ratio

        updated = ReputationScore(
            total_disputes=new_total,
            wins=new_wins,
            losses=new_losses,
            trust_score=new_trust,
        )
        self.reputation_scores[user] = updated

    @gl.public.view
    def get_reputation(self, user: Address) -> dict:
        if user not in self.reputation_scores:
            return {
                "total_disputes": 0,
                "wins": 0,
                "losses": 0,
                "trust_score": 100,
            }
        score = self.reputation_scores[user]
        return {
            "total_disputes": int(score.total_disputes),
            "wins": int(score.wins),
            "losses": int(score.losses),
            "trust_score": int(score.trust_score),
        }
