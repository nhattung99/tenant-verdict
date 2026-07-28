# GenLayer Studio Manual Deployment Notes

Follow these steps to deploy the 3 Python contracts on **GenLayer Studio (`https://studio.genlayer.com`)** on **studionet**:

## Contract Files
- `contracts/reputation.py`
- `contracts/treasury.py`
- `contracts/dispute_court.py`

## Deployment Sequence
1. Deploy `reputation.py` ➔ Note address `ADDR_REP`
2. Deploy `treasury.py` ➔ Note address `ADDR_TREASURY`
3. Deploy `dispute_court.py` ➔ Note address `ADDR_COURT`

## Initializer Calls
- On `ADDR_COURT`:
  - Call `set_treasury_address(ADDR_TREASURY)`
  - Call `set_reputation_address(ADDR_REP)`
- On `ADDR_TREASURY`:
  - Call `set_court_address(ADDR_COURT)`
- On `ADDR_REP`:
  - Call `set_court_address(ADDR_COURT)`

After deployment, copy `ADDR_COURT`, `ADDR_TREASURY`, and `ADDR_REP` and send them back to complete the frontend environment configuration & Vercel deployment!
