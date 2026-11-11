// Nasyai site settings. Everything that changes at launch lives here.
export const NASYAI = {
  brand: { name: 'Nasyai', long: 'Nasyai Super Intelligence', domain: 'nasyai.top', ticker: 'NASYAI' },
  links: {
    x: 'https://x.com/nasyai_top',
    xHandle: 'nasyai_top',
    github: null,
    mcp: null,
    email: 'hello@nasyai.top',
  },
  chain: {
    id: 4663,
    name: 'Robinhood Chain',
    explorer: 'https://robinhoodchain.blockscout.com',
    rpc: ['https://robinhood-rpc.publicnode.com', 'https://rpc.mainnet.chain.robinhood.com'],
  },
  token: {
    ca: 'WAIT FOR CA',
    minHold: 10000,
    decimals: 18,
  },
  contracts: {
    registry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    usdg: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
    pool: '0x3b84741E1203C3B4bf9f590a7645BBd02ed4205f',
    treasury: '0x988268139634984BfB67853495ccF7Da3b167Fb2',
    seatVault: '0xBE67dc0a44614cA64bc9D3c4EEa6406a10e6908F',
    stockVault: '0x75c949E42690C463C5849519D34143703214Adad',
  },
  params: {
    feePer30d: 0.01,
    lenderShare: 0.5,
    backerShare: 0.25,
    treasuryShare: 0.25,
    firstLine: 5,
    bond: 5,
    maxLine: 500,
    minHoldDays: 7,
    stockLtv: 0.5,
    defaultPenalty: 0.2,
  },
}

export const hasPool = !!NASYAI.contracts.pool
export const tokenLaunched = !!NASYAI.token.ca
