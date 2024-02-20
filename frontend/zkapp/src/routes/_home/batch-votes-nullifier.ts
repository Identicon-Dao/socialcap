import { Field, PublicKey } from "o1js";
import { UID } from "@socialcap/contracts-lib";
import { BatchVoteNullifier, BatchVoteNullifierLeaf } from "@socialcap/batch-voting";

export function buidNullifier(
  senderId: string, 
  tasks: any[]
): BatchVoteNullifier {
  const leafs = [];

  for (let j=0; j < tasks.length; j++) {
    const vote = tasks[j];
  
    // create a Nullifier leaf for each vote so we can build the nullifier
    leafs.push({ value: BatchVoteNullifierLeaf.value(
      PublicKey.fromBase58(senderId),
      UID.toField(vote.claimUid),
      Field(vote.result)
    )})
  }

  return new BatchVoteNullifier().addLeafs(leafs);
}
