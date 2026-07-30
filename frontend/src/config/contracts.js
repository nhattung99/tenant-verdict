// GenLayer Network and Contract Configuration

const mainAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

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
  blockExplorerUrl: 'https://genlayer-explorer.vercel.app',
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
