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
  fetchUserReputation,
} from './services/genlayer';

// Initial realistic demo disputes for immediate interactive preview
const INITIAL_DEMO_DISPUTES = [
  {
    id: '1',
    landlord: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    tenant: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    deposit_amount: '1.5',
    movein_evidence_urls: [
      'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/movein_livingroom.jpg',
      'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/movein_walls.jpg',
    ],
    moveout_evidence_urls: [
      'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/moveout_livingroom_cleaned.jpg',
      'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/moveout_walls_repaired.jpg',
    ],
    tenant_statement:
      'I professionally steam-cleaned all carpets upon move-out. The minor paint mark in the living room was recorded in original move-in photos.',
    status: 'AWAITING_VERDICT',
    tenant_refund_pct: 0,
    verdict_reason: '',
    confidence: 0,
    appeal_count: 0,
  },
  {
    id: '2',
    landlord: '0x3C44CdD05aB7513794d3023d1636f32e60058b87',
    tenant: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    deposit_amount: '2.0',
    movein_evidence_urls: ['https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/apt2_movein.jpg'],
    moveout_evidence_urls: ['https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/apt2_moveout.jpg'],
    tenant_statement: 'Kitchen floor tile crack occurred due to plumbing leak from upstairs unit.',
    status: 'CLOSED',
    tenant_refund_pct: 85,
    verdict_reason:
      'Multi-validator consensus: Evidence confirms plumbing damage originated from building infrastructure. 85% deposit returned to tenant, 15% withheld for minor wall scuffs.',
    confidence: 94,
    appeal_count: 0,
  },
];

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('disputes'); // 'disputes' | 'create' | 'reputation' | 'inspector'
  const [disputes, setDisputes] = useState(INITIAL_DEMO_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitEvidenceModalDispute, setSubmitEvidenceModalDispute] = useState(null);
  const [userReputation, setUserReputation] = useState(null);
  const [isPreviewSimulated, setIsPreviewSimulated] = useState(!isContractConfigured());

  const handleConnectWallet = async () => {
    try {
      const addr = await connectMetaMask();
      setAccount(addr);
      if (isContractConfigured()) {
        const rep = await fetchUserReputation(addr);
        setUserReputation(rep);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSimulateContractAddresses = () => {
    setIsPreviewSimulated(true);
    alert(
      'Interactive Preview Mode Activated!\nYou can create disputes, submit evidence, and execute AI consensus trials with realistic simulated GenLayer smart contract state.'
    );
  };

  const handleCreateDispute = async ({ tenantAddress, depositAmount, moveInUrls }) => {
    if (isContractConfigured() && account) {
      await createDisputeTx(account, tenantAddress, moveInUrls, depositAmount);
    }
    // Update local state for immediate feedback
    const newDispute = {
      id: String(disputes.length + 1),
      landlord: account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tenant: tenantAddress,
      deposit_amount: depositAmount,
      movein_evidence_urls: moveInUrls,
      moveout_evidence_urls: [],
      tenant_statement: '',
      status: 'OPEN',
      tenant_refund_pct: 0,
      verdict_reason: '',
      confidence: 0,
      appeal_count: 0,
    };
    setDisputes([newDispute, ...disputes]);
    alert(`Dispute #${newDispute.id} created successfully and deposit escrowed!`);
  };

  const handleSubmitEvidence = async (disputeId, moveOutUrls, statement) => {
    if (isContractConfigured() && account) {
      await submitEvidenceTx(account, disputeId, moveOutUrls, statement);
    }
    setDisputes(
      disputes.map((d) =>
        d.id === String(disputeId)
          ? {
              ...d,
              moveout_evidence_urls: moveOutUrls,
              tenant_statement: statement,
              status: 'AWAITING_VERDICT',
            }
          : d
      )
    );
    if (selectedDispute && selectedDispute.id === String(disputeId)) {
      setSelectedDispute({
        ...selectedDispute,
        moveout_evidence_urls: moveOutUrls,
        tenant_statement: statement,
        status: 'AWAITING_VERDICT',
      });
    }
    alert(`Evidence submitted for Dispute #${disputeId}! Ready for GenLayer AI verdict.`);
  };

  const handleRequestVerdict = async (disputeId) => {
    if (isContractConfigured() && account) {
      await requestVerdictTx(account, disputeId);
    }
    // Simulate multi-validator AI consensus result
    const simulatedVerdict = {
      tenant_refund_pct: 80,
      confidence: 92,
      verdict_reason:
        'GenLayer AI Multi-Validator Consensus: Comparative rendering of move-in vs move-out evidence reveals wear-and-tear in living room carpet consistent with 2-year tenancy. Wall scuff spackling acknowledged. 80% deposit released to tenant, 20% to landlord.',
      status: 'CLOSED',
    };

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === String(disputeId)
          ? {
              ...d,
              ...simulatedVerdict,
            }
          : d
      )
    );

    if (selectedDispute && selectedDispute.id === String(disputeId)) {
      setSelectedDispute({
        ...selectedDispute,
        ...simulatedVerdict,
      });
    }
  };

  const handleAppeal = async (disputeId) => {
    if (isContractConfigured() && account) {
      await appealVerdictTx(account, disputeId);
    }
    const appealVerdict = {
      tenant_refund_pct: 70,
      confidence: 98,
      verdict_reason:
        '[CHIEF APPEALS ROUND 1] Multi-source re-examination confirms 70% refund to tenant following detailed itemization of repair receipts.',
      status: 'CLOSED',
      appeal_count: 1,
    };
    setDisputes((prev) =>
      prev.map((d) => (d.id === String(disputeId) ? { ...d, ...appealVerdict } : d))
    );
    if (selectedDispute && selectedDispute.id === String(disputeId)) {
      setSelectedDispute({ ...selectedDispute, ...appealVerdict });
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

      {/* Unconfigured Banner if Contract Address environment variables are missing */}
      {!isContractConfigured() && (
        <UnconfiguredBanner onSimulateContractAddresses={handleSimulateContractAddresses} />
      )}

      {/* Main Content Body */}
      <main>
        {activeTab === 'disputes' && (
          <DisputeList
            disputes={disputes}
            onSelectDispute={handleSelectDispute}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onRefresh={() => alert('Dispute state refreshed from GenLayer RPC.')}
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
