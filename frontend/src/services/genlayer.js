import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESSES, STUDIONET_CONFIG } from '../config/contracts';

let clientInstance = null;

export const getGenLayerClient = (userAddress = null) => {
  if (!clientInstance || userAddress) {
    clientInstance = createClient({
      chain: studionet,
      account: userAddress || undefined,
    });
  }
  return clientInstance;
};

export const connectMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use TenantVerdict.');
  }

  // Request accounts
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];

  // Auto-switch to GenLayer studionet
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: STUDIONET_CONFIG.chainId }],
    });
  } catch (switchError) {
    // 4902 error code indicates chain has not been added to MetaMask
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: STUDIONET_CONFIG.chainId,
              chainName: STUDIONET_CONFIG.chainName,
              rpcUrls: [STUDIONET_CONFIG.rpcUrl],
              nativeCurrency: STUDIONET_CONFIG.nativeCurrency,
              blockExplorerUrls: [STUDIONET_CONFIG.blockExplorerUrl],
            },
          ],
        });
      } catch (addError) {
        console.warn('Failed to add GenLayer Studio Net to MetaMask:', addError);
      }
    }
  }

  return account;
};

export const createDisputeTx = async (userAddress, tenantAddress, moveInUrls, depositEthAmount) => {
  const client = getGenLayerClient(userAddress);
  const depositWei = BigInt(Math.floor(parseFloat(depositEthAmount) * 1e18));

  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESSES.DISPUTE_COURT,
    functionName: 'create_dispute',
    args: [tenantAddress, moveInUrls],
    value: depositWei,
  });

  return txHash;
};

export const submitEvidenceTx = async (userAddress, disputeId, moveOutUrls, statement) => {
  const client = getGenLayerClient(userAddress);

  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESSES.DISPUTE_COURT,
    functionName: 'submit_tenant_evidence',
    args: [String(disputeId), moveOutUrls, statement],
  });

  return txHash;
};

export const requestVerdictTx = async (userAddress, disputeId) => {
  const client = getGenLayerClient(userAddress);

  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESSES.DISPUTE_COURT,
    functionName: 'request_verdict',
    args: [String(disputeId)],
  });

  return txHash;
};

export const appealVerdictTx = async (userAddress, disputeId) => {
  const client = getGenLayerClient(userAddress);

  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESSES.DISPUTE_COURT,
    functionName: 'appeal_verdict',
    args: [String(disputeId)],
  });

  return txHash;
};

export const fetchDisputeData = async (disputeId) => {
  const client = getGenLayerClient();
  const dispute = await client.readContract({
    address: CONTRACT_ADDRESSES.DISPUTE_COURT,
    functionName: 'get_dispute',
    args: [String(disputeId)],
  });
  return dispute;
};

export const fetchUserReputation = async (userAddress) => {
  const client = getGenLayerClient();
  try {
    const trustScore = await client.readContract({
      address: CONTRACT_ADDRESSES.REPUTATION,
      functionName: 'get_trust_score',
      args: [userAddress],
    });
    const totalDisputes = await client.readContract({
      address: CONTRACT_ADDRESSES.REPUTATION,
      functionName: 'get_total_disputes',
      args: [userAddress],
    });
    const wins = await client.readContract({
      address: CONTRACT_ADDRESSES.REPUTATION,
      functionName: 'get_wins',
      args: [userAddress],
    });
    const losses = await client.readContract({
      address: CONTRACT_ADDRESSES.REPUTATION,
      functionName: 'get_losses',
      args: [userAddress],
    });

    return {
      trust_score: Number(trustScore),
      total_disputes: Number(totalDisputes),
      wins: Number(wins),
      losses: Number(losses),
    };
  } catch (e) {
    return { trust_score: 100, total_disputes: 0, wins: 0, losses: 0 };
  }
};

