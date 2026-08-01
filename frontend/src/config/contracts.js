// GenLayer Network and Contract Configuration

// Canonical deployed contract address on GenLayer studionet
export const CANONICAL_CONTRACT_ADDRESS = '0xCd51507ed83C6AA140de7f85e19872Ac1AC41Be6';

const mainAddress = import.meta.env.VITE_CONTRACT_ADDRESS || CANONICAL_CONTRACT_ADDRESS;

export const CONTRACT_ADDRESSES = {
  DISPUTE_COURT: import.meta.env.VITE_DISPUTE_COURT_ADDRESS || mainAddress,
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS || mainAddress,
  REPUTATION: import.meta.env.VITE_REPUTATION_ADDRESS || mainAddress,
};

export const STUDIONET_CONFIG = {
  chainId: '0xF1EF', // 61999 in decimal
  chainIdDecimal: 61999,
  chainName: 'GenLayer Studio Net',
  rpcUrl: 'https://studio.genlayer.com/api',
  blockExplorerUrl: 'https://explorer-studio.genlayer.com',
  nativeCurrency: {
    name: 'GEN Token',
    symbol: 'GEN',
    decimals: 18,
  },
};

export const isContractConfigured = () => {
  return (
    Boolean(CONTRACT_ADDRESSES.DISPUTE_COURT) &&
    CONTRACT_ADDRESSES.DISPUTE_COURT.trim().length > 0
  );
};
