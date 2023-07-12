import { fetchAccount, isReady, Mina, PrivateKey, PublicKey } from "snarkyjs";
// import { Add } from "@mazito/zkapp-contracts-add";
import { writable, get } from "svelte/store";

export const berkeleyMinaStore = writable();
export const deployedZkAppStore = writable();

// Update this to use the address (public key) for your zkApp account.
// To try it out, you can try this address for an example "Add" smart contract that we've deployed to
// Berkeley Testnet B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA .
const BERKELEY_ZKAPP_ADDRESS =
  "B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA";

export async function loadSnarky() {
  console.log("loading Snarkyjs and zkApp instance ...");
  await isReady;

  const Berkeley = Mina.Network(
    "https://proxy.berkeley.minaexplorer.com/graphql"
  );
  Mina.setActiveInstance(Berkeley);

  // create an instance of the Add contract
  // await Add.compile();
  console.log("contract Add compiled");

  // this is the fixed Public key of this zkApp
  const zkappPublicKeyBase58 = BERKELEY_ZKAPP_ADDRESS;
  const zkappPublicKey = PublicKey.fromBase58(zkappPublicKeyBase58);
  console.log("initZkapp zkappPublickKey=", zkappPublicKeyBase58);

  // init the instance
  const zkappInstance = new Add(zkappPublicKey);
  console.log("zkAppInstance=", zkappInstance);

  //await Add.compile()
  console.log("Add.compile DONE");

  // get the zkappAccount
  const result = await fetchAccount({
    publicKey: zkappPublicKey,
  });
  console.log(
    `initZkapp fetchAccount(${zkappPublicKeyBase58}) result=`,
    result
  );
  console.log(
    "zkappInstancePublicKey(s) assertEqual=",
    zkappPublicKeyBase58 === result.account?.publicKey.toBase58()
  );

  berkeleyMinaStore.set(true);
  deployedZkAppStore.set(zkappInstance);
}

export async function getWalletAccount(): Promise<
  [boolean, PublicKey | null, boolean]
> {
  // check if we have a MINA wallet
  console.log("getWalletAccount");
  const mina = window!.mina;
  if (mina == null) {
    // it ends here !
    return [false, null, false];
  }
  console.log("getWalletAccount hasWallet=", true);

  // if we are here => we already have a MINA wallet
  // now get the current selected account in Auro wallet
  const publicKeyBase58 = (await mina.requestAccounts())[0];
  const publicKey = PublicKey.fromBase58(publicKeyBase58);
  console.log("getWalletAccount using key", publicKey.toBase58(), publicKey);

  // now check if the account exists in the selected net
  console.log("getWalletAccount checking if account exists...");
  const res = await fetchAccount({
    publicKey: publicKey,
  });

  const accountExists = res.error == null;
  console.log("getWalletAccount accountExists=", accountExists);

  return [true, publicKey, accountExists];
}

export async function updateAdd() {
  try {
    const txFee = 0.1; // 100_000_000;

    const zkappPublicKey = PublicKey.fromBase58(BERKELEY_ZKAPP_ADDRESS);

    const zkAppInstance = new Add(zkappPublicKey);

    const tx = await Mina.transaction(() => {
      zkAppInstance.update();
    });

    await tx.prove();

    // loged user will pay with Wallet
    const { hash } = await window!.mina.sendTransaction({
      transaction: tx.toJSON(),
      feePayer: {
        fee: txFee,
        memo: "zk",
      },
    });

    // if you want to inspect the transaction, you can print it out:
    console.log(tx.toPretty());

    console.log("Sent!", hash);
    return hash;
  } catch (err: any) {
    // You may want to show the error message in your UI to the user if the transaction fails.
    console.log("updateAdd Error=", err.message);
  }
}
