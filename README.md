# TenantVerdict ⚖️ — Decentralized AI Rental Security Deposit Arbitrator on GenLayer

> **"TenantVerdict dies without GenLayer: no one — neither landlord, tenant, nor an EVM smart contract — can inspect unstructured move-in vs move-out photos/web evidence and adjudicate a fair % deposit refund; only GenLayer's decentralized AI consensus can do so without a centralized, biased human arbitrator."**

---

## 🌟 Overview & System Architecture

Security deposit disputes between landlords and tenants account for a massive share of small-claims litigation annually. Disagreements over **normal wear-and-tear vs tenant damage** consume far more time and legal expenses than the deposit value itself. Traditional EVM smart contracts cannot read unstructured web evidence (photos, inspection reports, tenant counter-statements), and centralized human arbitrators are expensive and prone to bias.

**TenantVerdict** solves this with an Intelligent Contract system on **GenLayer**:
1. **Landlord Registration**: Landlord creates a dispute, escrows deposit funds in `TenantVerdict.py`, and attaches move-in web evidence URLs.
2. **Tenant Evidence**: Tenant submits move-out web evidence URLs and a written counter-statement.
3. **Decentralized AI Consensus**: The contract executes `gl.vm.run_nondet`. Validators fetch evidence directly from the web using `gl.nondet.web.render`, run non-deterministic LLM analysis, and enforce semantic consensus on the percentage refund split (`validator_fn` checks ±5% tolerance).
4. **Automated Settlement & Payout**: Escrowed funds are automatically disbursed via direct transfer, while participant trust scores are recorded on-chain.

---

## 🏛️ Canonical Escrow Architecture

For single-step deployment and atomic execution, **`TenantVerdict.py` (`contracts/tenant_verdict.py`) is the canonical production contract architecture** deployed on GenLayer `studionet`. It combines Escrow Vault, AI Court Arbitration, and Participant Reputation into **one complete escrow path**:

```
+-----------------------------------------------------------------------------------+
|                           TenantVerdict.py (Canonical)                            |
|                                                                                   |
|  [ Escrow Vault ]  <--->  [ AI Consensus Court ]  <--->  [ Reputation Metrics ]   |
|  - Deposit Escrow          - gl.vm.run_nondet()          - Trust Scores (0-100%)  |
|  - Payout Settlement       - Web Evidence Render         - Win/Loss Counts        |
|  - Address Binding         - Validator Tolerance Check                            |
+-----------------------------------------------------------------------------------+
```

*(Note: Multi-contract modules `dispute_court.py`, `treasury.py`, and `reputation.py` are preserved in `contracts/` for modular cross-contract reference).*

---

## 🚀 Live Application

- **Live Web App**: [https://tenant-verdict-genlayer.vercel.app](https://tenant-verdict-genlayer.vercel.app)

---

## 📋 Deployed Canonical Contract (studionet)

- **Canonical Contract Address**: `0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6`
- **Block Explorer**: [View on GenLayer Explorer](https://explorer-studio.genlayer.com/address/0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6)

| Contract | Network | Address | Explorer Link |
|---|---|---|---|
| `TenantVerdict` (Canonical) | `studionet` | `0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6` | [Explorer](https://explorer-studio.genlayer.com/address/0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6) |

---

## 🚀 GenLayer Studio Deployment Guide

### Prerequisites
- Access to **GenLayer Studio**: `https://studio.genlayer.com`
- Target Network: **studionet**

### Deployment Instructions
1. **Open GenLayer Studio** (`https://studio.genlayer.com`).
2. **Deploy `TenantVerdict.py`**:
   - Create new file `tenant_verdict.py` in Studio.
   - Copy exact contents from [`contracts/tenant_verdict.py`](contracts/tenant_verdict.py).
   - In **Run & Debug** panel, click **Deploy**.
   - Copy the deployed contract address (`0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6`).

---

## 🧪 Local Testing Framework

Run `pytest` suite to verify non-deterministic AI consensus, web rendering, and edge case error assertions:

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

# Set canonical contract address in .env:
# VITE_CONTRACT_ADDRESS=0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6

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
3. Add Environment Variable: `VITE_CONTRACT_ADDRESS=0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6`.
4. Deploy!

---

## 🔒 Security & Best Practices

- **Dynamic Contract State Reading**: The frontend waits for transaction receipt completion and dynamically reads `get_dispute` state directly from the smart contract without mock fallbacks or hardcoded verdicts.
- **Authoritative Address Binding**: `create_dispute` cryptographically binds landlord and tenant wallet addresses on-chain, ensuring payouts are released strictly to the registered dispute participants.
- **Strict Validation**: All method inputs, string IDs, and percentage bounds are strictly checked with `UserError`.
