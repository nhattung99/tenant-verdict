// GenLayer Network and Contract Configuration

export const CONTRACT_ADDRESSES = {
  DISPUTE_COURT: import.meta.env.VITE_DISPUTE_COURT_ADDRESS || '',
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS || '',
  REPUTATION: import.meta.env.VITE_REPUTATION_ADDRESS || '',
};

export const STUDIONET_CONFIG = {
  chainId: '0xF1EF', // 61999 in decimal
  chainIdDecimal: 61999,
  chainName: 'GenLayer Studio Net',
  rpcUrl: 'https://studio.genlayer.com/api',
  blockExplorerUrl: 'https://studio.genlayer.com/explorer',
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
