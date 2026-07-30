# TenantVerdict ⚖️ — Decentralized AI Rental Security Deposit Arbitrator on GenLayer

> **"TenantVerdict dies without GenLayer: no one — neither landlord, tenant, nor an EVM smart contract — can inspect unstructured move-in vs move-out photos/web evidence and adjudicate a fair % deposit refund; only GenLayer's decentralized AI consensus can do so without a centralized, biased human arbitrator."**

---

## 🌟 Overview & Problem Statement

Security deposit disputes between landlords and tenants account for a massive share of small-claims litigation annually. Disagreements over **normal wear-and-tear vs tenant damage** consume far more time and legal expenses than the deposit value itself. Traditional EVM smart contracts cannot read unstructured web evidence (photos, inspection reports, tenant counter-statements), and centralized human arbitrators are expensive and prone to bias.

**TenantVerdict** solves this with an Intelligent Contract system on **GenLayer**:
1. **Landlord Registration**: Landlord creates a dispute, escrows deposit funds in `Treasury.py`, and attaches move-in web evidence URLs.
2. **Tenant Evidence**: Tenant submits move-out web evidence URLs and a written counter-statement.
3. **Decentralized AI Consensus**: The contract executes `gl.vm.run_nondet`. Validators fetch evidence directly from the web using `gl.nondet.web.render`, run non-deterministic LLM analysis, and enforce semantic consensus on the percentage refund split (`validator_fn` checks ±5% tolerance).
4. **Automated Settlement & Payout**: Escrowed funds are automatically disbursed via cross-contract calls to `Treasury.py`, while participant trust scores are updated in `Reputation.py`.

---

## 🏗️ Multi-Contract System Architecture

TenantVerdict consists of 3 interacting GenLayer Intelligent Contracts in `contracts/`:

```
                           +------------------------+
                           |  DisputeCourt.py       |
                           | (AI Consensus Court)   |
                           +-----------+------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
      +------------------------+              +------------------------+
      |      Treasury.py       |              |     Reputation.py      |
      | (GEN Escrow & Payout)  |              | (Trust Score Metrics)  |
      +------------------------+              +------------------------+
```

### 1. `DisputeCourt.py`
- Main court logic housing dispute state machine (`OPEN` ➔ `AWAITING_VERDICT` ➔ `VERDICT_ISSUED` / `AWAITING_APPEAL` ➔ `CLOSED`).
- Executes `gl.vm.run_nondet(leader_fn, validator_fn)`.
- `leader_fn`: Renders multi-source web evidence via `gl.nondet.web.render()`, prompts LLM via `gl.nondet.exec_prompt()`, and parses raw verdict JSON.
- `validator_fn`: Enforces consensus on `tenant_refund_pct` within a ±5% tolerance threshold, ignoring superficial explanation text differences.
- Edge case handling with explicit `UserError`: Web fetch 404, invalid LLM JSON, 0 deposit, double-claim prevention, and confidence score escalation (`confidence < 60`).

### 2. `Treasury.py`
- Holds deposit escrows in native GEN (`gl.message.value`).
- Releases payouts strictly when authorized by `DisputeCourt` using `gl.transfer` (avoiding `gl.eth.send_value`).

### 3. `Reputation.py`
- Tracks dispute history, win/loss stats, and trust scores (0-100%) for landlords and tenants.

---

## 📋 Deployed Contract (studionet)

- **Contract Address**: `0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6`
- **Block Explorer**: [View on GenLayer Explorer](https://genlayer-explorer.vercel.app/address/0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6)

| Contract | Network | Address | Explorer Link |
|---|---|---|---|
| `TenantVerdict` | `studionet` | `0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6` | [Explorer](https://genlayer-explorer.vercel.app/address/0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6) |


---

## 🚀 Step-by-Step GenLayer Studio Deployment Guide

### Prerequisites
- Access to **GenLayer Studio**: `https://studio.genlayer.com`
- Target Network: **studionet**

### Deployment Instructions
1. **Open GenLayer Studio** (`https://studio.genlayer.com`).
2. **Deploy `Reputation.py`**:
   - Create new file `reputation.py` in Studio.
   - Paste contents from [`contracts/reputation.py`](contracts/reputation.py).
   - In **Run & Debug** panel, click **Deploy**.
   - Copy the deployed contract address (`0xReputation...`).
3. **Deploy `Treasury.py`**:
   - Create new file `treasury.py` in Studio.
   - Paste contents from [`contracts/treasury.py`](contracts/treasury.py).
   - Click **Deploy**.
   - Copy the deployed contract address (`0xTreasury...`).
4. **Deploy `DisputeCourt.py`**:
   - Create new file `dispute_court.py` in Studio.
   - Paste contents from [`contracts/dispute_court.py`](contracts/dispute_court.py).
   - Click **Deploy**.
   - Copy the deployed contract address (`0xDisputeCourt...`).
5. **Link Contracts**:
   - In `DisputeCourt` panel, call write method `set_treasury_address("0xTreasury...")`.
   - In `DisputeCourt` panel, call write method `set_reputation_address("0xReputation...")`.
   - In `Treasury` panel, call write method `set_court_address("0xDisputeCourt...")`.
   - In `Reputation` panel, call write method `set_court_address("0xDisputeCourt...")`.

---

## 🧪 Local Testing Framework

Run `gltest` suite to verify non-deterministic AI consensus, web rendering, and edge case error assertions:

```bash
# Run contract pytest test suite
python -m pytest tests/test_dispute_court.py

# Run via gltest CLI on localnet / studionet
gltest tests/test_dispute_court.py --chain-type studionet
```

---

## 💻 Frontend Application Setup & Deployment

### Local Development Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env

# Set contract addresses in .env once deployed:
# VITE_DISPUTE_COURT_ADDRESS=0x...
# VITE_TREASURY_ADDRESS=0x...
# VITE_REPUTATION_ADDRESS=0x...

# Run local development server
npm run dev
```

### Production Build & Vercel Deployment
```bash
cd frontend
npm run build
```

To deploy on Vercel:
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variables:
   - `VITE_DISPUTE_COURT_ADDRESS`
   - `VITE_TREASURY_ADDRESS`
   - `VITE_REPUTATION_ADDRESS`
4. Deploy!

---

## 🔒 Security & Best Practices

- **Strict Validation**: All method inputs, string IDs, and percentage bounds are strictly checked with `UserError`.
- **Reentrancy Protection**: Escrow balances in `Treasury.py` are zeroed out prior to transferring payout funds.
- **No Burner Accounts / Secrets in Frontend**: Wallet interactions use standard MetaMask provider signatures on `studionet`.
