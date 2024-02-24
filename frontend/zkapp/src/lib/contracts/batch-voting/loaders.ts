import { fetchAccount, Mina, PublicKey } from "o1js";
import { PLAN_VOTING_CONTRACT_ID } from "../addresses"
import { CLAIM_TX_FEE } from "../fees";
// import { PlanVotingContract } from "@socialcap/batch-voting";
import { AppStatus } from "@utilities/app-status";
import { MINABerkeley, berkeleyNetwork$, deployedBatchVoting$, deployedVoting$ } from "../stores";


export async function loadPlanVotingContract() {
  console.log("loading Snarkyjs and zkApp instance ...");

  Mina.setActiveInstance(Mina.Network(MINABerkeley));

  // create an instance of the Add contract
//   await PlanVotingContract.compile();
//   console.log("contract compiled !");
// 
//   // this is the fixed Public key of this zkApp
//   const zkappPublicKey = PublicKey.fromBase58(PLAN_VOTING_CONTRACT_ID);
//   console.log("initZkapp zkappPublickKey=", PLAN_VOTING_CONTRACT_ID);
// 
//   // init the instance
//   const zkappInstance = new PlanVotingContract(zkappPublicKey);
//   console.log("zkAppInstance=", zkappInstance);
// 
//   // get the zkappAccount
//   const result = await fetchAccount({ publicKey: zkappPublicKey });
//   console.log(`Account exists ? `,   (result?.account !== undefined));
//   console.log("zkappInstancePublicKey(s) assertEqual ? ",
//     (PLAN_VOTING_CONTRACT_ID === result?.account?.publicKey?.toBase58())
//   );
//   
//   AppStatus.done("We are ready NOW !");
//   berkeleyNetwork$.set(true);
//   deployedVoting$.set(zkappInstance);
//   deployedBatchVoting$.set(zkappInstance);
  
  return true;
}
