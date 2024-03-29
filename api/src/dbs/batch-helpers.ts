import { prisma, logger } from "../global.js";
import { WAITING, DONE, IGNORED, REJECTED, UID } from "@socialcap/contracts";

interface SignedData {
  publicKey: string;
  data: string; 
  signature: {
      field: string;
      scalar: string;
  };
}

interface SignedVote {
  uid: string, // the taskUid
  claimUid: string,
  assigneeUid: string,
  communityUid: string,
  planUid: string
  result: string, // "+1: Positive" "-1: Negative" "0: Abstain" 
}

interface VotesBatchMetadata {
  communityUid: string,// the community where the voting process is happening
  planUid: string, // the Master Plan Uid of the credential being voted
  assigneeUid: string, // the elector Uid who submitted this batch
}

export async function createVotesBatch(params: {
  senderAccountId: string,
  signedData: SignedData,
}): Promise<any> {

  // retrieve and parse received signed data
  let data = params.signedData.data || "[]";
  let votes = JSON.parse(data) as SignedVote[];
  if (! votes.length) 
    // we just ignore this batch, because it has no votes
    return null;

  // get the first vote for this params, since they are repaated 
  // for every vote in the batch
  let firstVote = votes[0]; 

  // insert a new batch ready to be processed by the Batches Sequencer
  let batch = await prisma.batch.create({ data: {
    uid: UID.uuid4(),
    // sequence @default(autoincrement()) // Db assigns sequence number
    type: "VOTES", // mark as a VOTES batch
    metadata: JSON.stringify({
      communityUid: firstVote.communityUid,
      planUid: firstVote.planUid,
      assigneeUid: firstVote.assigneeUid,
    }),
    signerAccountId: params.senderAccountId, // this is the Signed data received    
    signedData: params.signedData.data, // JSON string
    signatureField: params.signedData.signature.field,
    signatureScalar: params.signedData.signature.scalar,
    size: votes.length,
    commitment: "", // initially it is empty
    state: WAITING, // we wait for the sequencer to process it
    // submitedUTC @default(now()) // Db assigns the now UTC 
  }})

  return batch;
}
