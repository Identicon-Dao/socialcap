import { providers, connect, Contract } from "near-api-js";

import {
  SBT_ISSUER_ACCOUNT_ID,
  SBT_ISSUER_CONTRACT,
  SBT_ISSUER_PRIVATE_KEY,
  getAccountConfig,
  getNetworkConfig,
} from "./config";

const GAS = "200000000000000";
const DEPOSIT = "1";

const env = process.env.NEAR_ENV || "testnet";
console.log("@env", env);
const nearConfig = getNetworkConfig(env);
console.log("@nearConfig", nearConfig);
const provider = new providers.JsonRpcProvider({
  url: nearConfig.nodeUrl,
});
console.log("@provider", provider)

const getNearConfig = () => {
  return nearConfig;
};

const getSbtContract = async () =>  {
  console.log('@getSbtContract')
  const signer = SBT_ISSUER_ACCOUNT_ID;
  const privateKey = SBT_ISSUER_PRIVATE_KEY;
  const publicKey = SBT_ISSUER_CONTRACT;

  // const config = await getAccountConfig(signer, privateKey);
  const near = await connect({
    networkId: nearConfig.networkId,
    nodeUrl: nearConfig.nodeUrl,
    headers: {},
  });
  console.log("@near", near)
  const account = await near.account(signer);

  try {
    const contract = new Contract(account, SBT_ISSUER_CONTRACT, {
      viewMethods: [
        "sbt_tokens_by_owner",
        "class_minter",
        "get_ttl",
        "sbt",
        "sbts",
        "is_banned",
      ],
      changeMethods: [
        "sbt_mint",
        "sbt_renew",
        "sbt_revoke",
        "set_max_ttl",
        "enable_next_class",
        "authorize",
        "unauthorize",
        "update_metadata",
      ],
      // sender: account, // account object to initialize and sign transactions.
    });
    return contract!;
  } catch (err) {
    console.log("getContract ERR=", err);
    return null;
  }
}

export const getNearBalance = async (accountId: string) => {
  const response: any = await provider.query({
    request_type: "view_account",
    finality: "final",
    account_id: accountId,
  });

  return response ? response.amount : response.error.data;
};

async function getOwnerSbtTokens() {

  console.log("@getOwnerSbts")
  try {
    const args =  { account: "manza.testnet" };
    const contract = await getSbtContract();
    // @ts-ignore 
    return contract!["sbt_tokens_by_owner"](args);
  } catch (e) {
    console.log("ERROR getting owner SBTs", e);
    throw e;
  }
}

export {
  getOwnerSbtTokens
}