import { keyStores, KeyPair } from "near-api-js";

const SBT_ISSUER_ACCOUNT_ID = process.env.SBT_ISSUER_ACCOUNT_ID!;
const SBT_ISSUER_PRIVATE_KEY = process.env.SBT_ISSUER_PRIVATE_KEY!;
const NETWORK_TYPE = process.env.NETWORK_TYPE;
const SBT_ISSUER_CONTRACT = process.env.SBT_ISSUER_CONTRACT!;

function getNetworkConfig(env: string) {
  switch (env) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
}

async function getAccountConfig(accountId: string, privateKey: string) {
  /**
   * Returns the currently active NEAR Config, binded to a given account.
   * This enables this account for signing transactions.
   */
  const config = getNetworkConfig(NETWORK_TYPE!);
  console.log("CONFIG", config);
  console.log(`getConfig '${NETWORK_TYPE}' '${accountId}' '${privateKey}'`);

  // see: https://docs.near.org/docs/api/naj-quick-reference#key-store
  // creates keyStore from a private key string
  // you can define your key here or use an environment variable
  
  const keyStore = new keyStores.InMemoryKeyStore();

  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(privateKey);
  //const keyPair = new nearAPI.utils.key_pair.KeyPairEd25519(privateKey);

  // adds the keyPair you created to keyStore
  await keyStore.setKey(NETWORK_TYPE!, accountId, keyPair);
//   config.keyStore = keyStore;
//   console.log("keyStore", config.keyStore);
  return config;
}

export {
  getAccountConfig,
  getNetworkConfig,
  SBT_ISSUER_ACCOUNT_ID,
  SBT_ISSUER_CONTRACT,
  SBT_ISSUER_PRIVATE_KEY
}