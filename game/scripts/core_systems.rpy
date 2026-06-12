default game_engine = NegotiationEngine()

init python:
    class NegotiationEngine:
        def __init__(self, persuasion_score=50, inventory=None):
            self.persuasion_score = self._clamp_score(persuasion_score)
            self.inventory = list(inventory) if inventory is not None else []

        def _clamp_score(self, value):
            return max(0, min(100, int(value)))

        def check_argument(self, evidence_id, correct_id):
            if evidence_id == correct_id:
                self.persuasion_score = self._clamp_score(self.persuasion_score + 20)
                return True

            self.persuasion_score = self._clamp_score(self.persuasion_score - 10)
            return False

        def is_negotiation_won(self):
            return self.persuasion_score >= 50
