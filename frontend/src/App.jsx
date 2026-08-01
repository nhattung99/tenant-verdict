import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UnconfiguredBanner from './components/UnconfiguredBanner';
import DisputeList from './components/DisputeList';
import CreateDisputeModal from './components/CreateDisputeModal';
import SubmitEvidenceModal from './components/SubmitEvidenceModal';
import VerdictInspector from './components/VerdictInspector';
import ReputationLeaderboard from './components/ReputationLeaderboard';
import { isContractConfigured, CONTRACT_ADDRESSES } from './config/contracts';
import {
  connectMetaMask,
  createDisputeTx,
  submitEvidenceTx,
  requestVerdictTx,
  appealVerdictTx,
  fetchDisputeData,
  fetchDisputeCount,
  fetchUserReputation,
} from './services/genlayer';

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('disputes');
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitEvidenceModalDispute, setSubmitEvidenceModalDispute] = useState(null);
  const [userReputation, setUserReputation] = useState(null);
  const [isLoadingDisputes, setIsLoadingDisputes] = useState(false);

  // Fetch all disputes dynamically from the canonical smart contract
  const loadOnChainDisputes = async () => {
    if (!isContractConfigured()) return;
    setIsLoadingDisputes(true);
    try {
      const totalCount = await fetchDisputeCount();
      const loaded = [];
      for (let i = 1; i <= totalCount; i++) {
        const idStr = String(i);
        const data = await fetchDisputeData(idStr);
        if (data && data.landlord && data.landlord !== '0x0000000000000000000000000000000000000000') {
          loaded.unshift({
            id: idStr,
            ...data,
          });
        }
      }
      setDisputes(loaded);
    } catch (err) {
      console.warn('Error loading on-chain disputes:', err);
    } finally {
      setIsLoadingDisputes(false);
    }
  };

  useEffect(() => {
    if (isContractConfigured()) {
      loadOnChainDisputes();
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const addr = await connectMetaMask();
      setAccount(addr);
      if (isContractConfigured()) {
        const rep = await fetchUserReputation(addr);
        setUserReputation(rep);
        await loadOnChainDisputes();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateDispute = async ({ tenantAddress, depositAmount, moveInUrls }) => {
    if (!account) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    try {
      // 1. Submit on-chain create_dispute transaction and await receipt
      await createDisputeTx(account, tenantAddress, moveInUrls, depositAmount);

      // 2. Query total dispute count from contract to retain exact contract-created dispute ID
      const newCount = await fetchDisputeCount();
      const createdIdStr = String(newCount > 0 ? newCount : disputes.length + 1);

      // 3. Read get_dispute directly from contract
      const contractDispute = await fetchDisputeData(createdIdStr);

      const disputeObj = {
        id: createdIdStr,
        landlord: contractDispute.landlord || account,
        tenant: contractDispute.tenant || tenantAddress,
        deposit_amount: contractDispute.deposit_amount || depositAmount,
        movein_evidence_urls: contractDispute.movein_evidence_urls || moveInUrls,
        moveout_evidence_urls: contractDispute.moveout_evidence_urls || [],
        tenant_statement: contractDispute.tenant_statement || '',
        status: contractDispute.status || 'OPEN',
        tenant_refund_pct: contractDispute.tenant_refund_pct || 0,
        verdict_reason: contractDispute.verdict_reason || '',
        confidence: contractDispute.confidence || 0,
        appeal_count: contractDispute.appeal_count || 0,
      };

      setDisputes((prev) => [disputeObj, ...prev.filter((d) => d.id !== createdIdStr)]);
      alert(`Dispute #${createdIdStr} created on GenLayer! Deposit escrowed.`);
    } catch (err) {
      alert(`Transaction failed: ${err.message}`);
    }
  };

  const handleSubmitEvidence = async (disputeId, moveOutUrls, statement) => {
    if (!account) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    try {
      // 1. Send submit_tenant_evidence tx and await receipt
      await submitEvidenceTx(account, disputeId, moveOutUrls, statement);

      // 2. Read updated state directly from get_dispute contract view
      const updatedOnChain = await fetchDisputeData(disputeId);

      setDisputes((prev) =>
        prev.map((d) => (d.id === String(disputeId) ? { ...d, ...updatedOnChain } : d))
      );

      if (selectedDispute && selectedDispute.id === String(disputeId)) {
        setSelectedDispute((prev) => ({ ...prev, ...updatedOnChain }));
      }

      alert(`Move-out evidence submitted for Dispute #${disputeId}!`);
    } catch (err) {
      alert(`Evidence submission failed: ${err.message}`);
    }
  };

  const handleRequestVerdict = async (disputeId) => {
    if (!account) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    try {
      // 1. Send request_verdict tx to trigger AI arbitration consensus & wait for receipt completion
      await requestVerdictTx(account, disputeId);

      // 2. Read official verdict outcome directly from contract get_dispute view call
      const updatedOnChain = await fetchDisputeData(disputeId);

      setDisputes((prev) =>
        prev.map((d) => (d.id === String(disputeId) ? { ...d, ...updatedOnChain } : d))
      );

      if (selectedDispute && selectedDispute.id === String(disputeId)) {
        setSelectedDispute((prev) => ({ ...prev, ...updatedOnChain }));
      }
    } catch (err) {
      alert(`AI Verdict Execution Error: ${err.message}`);
    }
  };

  const handleAppeal = async (disputeId) => {
    if (!account) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    try {
      // 1. Send appeal_verdict tx and wait for transaction completion
      await appealVerdictTx(account, disputeId);

      // 2. Read official appeal outcome directly from contract get_dispute
      const updatedOnChain = await fetchDisputeData(disputeId);

      setDisputes((prev) =>
        prev.map((d) => (d.id === String(disputeId) ? { ...d, ...updatedOnChain } : d))
      );

      if (selectedDispute && selectedDispute.id === String(disputeId)) {
        setSelectedDispute((prev) => ({ ...prev, ...updatedOnChain }));
      }
    } catch (err) {
      alert(`Appeal execution error: ${err.message}`);
    }
  };

  const handleSelectDispute = (dispute) => {
    setSelectedDispute(dispute);
    setActiveTab('inspector');
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      {/* Navigation Bar */}
      <Navbar
        account={account}
        onConnectWallet={handleConnectWallet}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isContractReady={isContractConfigured()}
      />

      {!isContractConfigured() && (
        <UnconfiguredBanner onSimulateContractAddresses={() => loadOnChainDisputes()} />
      )}

      {/* Main Content Body */}
      <main>
        {activeTab === 'disputes' && (
          <DisputeList
            disputes={disputes}
            isLoading={isLoadingDisputes}
            onSelectDispute={handleSelectDispute}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onRefresh={loadOnChainDisputes}
          />
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <CreateDisputeModal
              isOpen={true}
              onClose={() => setActiveTab('disputes')}
              onSubmit={handleCreateDispute}
              account={account}
            />
          </div>
        )}

        {activeTab === 'inspector' && selectedDispute && (
          <VerdictInspector
            dispute={selectedDispute}
            onBack={() => setActiveTab('disputes')}
            onRequestVerdict={handleRequestVerdict}
            onAppeal={handleAppeal}
            onOpenSubmitEvidence={(d) => setSubmitEvidenceModalDispute(d)}
            account={account}
          />
        )}

        {activeTab === 'reputation' && (
          <ReputationLeaderboard userReputation={userReputation} userAddress={account} />
        )}
      </main>

      {/* Modals */}
      <CreateDisputeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDispute}
        account={account}
      />

      <SubmitEvidenceModal
        isOpen={Boolean(submitEvidenceModalDispute)}
        onClose={() => setSubmitEvidenceModalDispute(null)}
        dispute={submitEvidenceModalDispute}
        onSubmit={handleSubmitEvidence}
      />
    </div>
  );
}
