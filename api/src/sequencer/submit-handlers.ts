/**
 * TxSubmitHandlers
 * These are the set of Transaction handlers used to submit each trnsaction 
 * type. There is one (and only one) Handler per type, and here we bind them.
 */

export { TxSubmitHandlers }

async function createClaimVotingAccount() { return }
async function sendClaimVote() { return }
async function rollupClaimVotes() { return }
async function createVotingBatchesAccount() { return }
async function receiveVotesBatch() { return }
async function commitAllBatches() { return }


const TxSubmitHandlers: any = {
  "CREATE_CLAIM_VOTING_ACCOUNT": createClaimVotingAccount,
  "SEND_CLAIM_VOTE": sendClaimVote,
  "ROLL_UP_CLAIM_VOTES": rollupClaimVotes,
  "CREATE_VOTING_BATCHES_ACCOUNT": createVotingBatchesAccount,
  "RECEIVE_VOTES_BATCH": receiveVotesBatch,
  "COMMIT_ALL_BATCHES": commitAllBatches,
}
