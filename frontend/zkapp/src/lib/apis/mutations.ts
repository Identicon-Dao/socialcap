import { apiClient, AppStatus } from "$lib/globals";
import { monitorMINATransaction } from "./monitors";

export { 
  updateProfile, 
  updateCommunity, 
  joinCommunity,
  changeMemberRole,
  attachPlan,
  updatePlan,
  addClaim,
  updateClaim,
  changeClaimState,
  submitClaim,
  submitTask,
  submitTasksBatch,
  requestOTP, 
  login,
  signUp,
  enableVoting,
  reassignElectors,
  closeVoting,
  reopenVoting,
  startTally,
  closeTally,
  issueCredentials
}


async function requestOTP(data: any): Promise<any> {
  //  "email": "mazito.v2+04@gmail.com"
  let rs = await apiClient.mutate("request_otp", data);
  if (rs.error) return rs;
  return rs.data;
}

async function login(data: any): Promise<any> {
  // "session_key": "61756fe1995448a5a58b37fc5ce0eba6",
  // "otp": "333577"
  let rs = await apiClient.mutate("login", data);
  if (rs.error) return rs;
  return rs.data;
}

async function signUp(data: any): Promise<any> {
  // "email": "",
  // "fullName": ""
  let rs = await apiClient.mutate("sign_up", data);
  if (rs.error) return rs;
  return rs.data;
}

async function updateProfile(data: any): Promise<any> {
  AppStatus.push("Updating profile ...");  

  let rs = await apiClient.mutate("update_profile", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.profile;
}


async function updateCommunity(data: any): Promise<any> {
  AppStatus.push("Updating community ...");  

  let rs = await apiClient.mutate("update_community", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Community updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.community;
}


async function joinCommunity(data: any): Promise<any> {
  AppStatus.push("Adding as member to a community ...");  
  const { communityUid, personUid } = data;

  const rs = await apiClient.mutate("join_community", {
    communityUid: communityUid,
    personUid: personUid
  });
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Member added !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.member;
}

async function changeMemberRole(data: {
  personUid: string,
  communityUid: string,
  role: number
}): Promise<any> {
  let rs = await apiClient.mutate("update_member_role", data);
  if (rs.error) 
    return rs;
  return rs.data.claim;
}


/**
 * Attachs a new plan to a given community
 */
async function attachPlan(data: any): Promise<any> {
  AppStatus.push("Adding a Master plan to this community ...");  

  let rs = await apiClient.mutate("add_plan", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.plan;
}

async function updatePlan(data: any): Promise<any> {
  AppStatus.push("Updating the master plan ...");  

  let rs = await apiClient.mutate("update_plan", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.plan;
}


/**
 * Claim mutations: addClaim, updateClaim, submitClaim
 */
async function addClaim(data: any): Promise<any> {
  AppStatus.push("Creating the Claim #"+data.uid);  

  let rs = await apiClient.mutate("add_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim created !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}

async function updateClaim(data: any): Promise<any> {
  AppStatus.push("Updating the Claim #"+data.uid);  

  let rs = await apiClient.mutate("update_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}

async function changeClaimState(data: {
  uid: string,
  state: number
}): Promise<any> {
  let rs = await apiClient.mutate("update_claim_state", data);
  if (rs.error) 
    return rs;
  return rs.data.claim;
}


/** This really starts the voting process */
async function submitClaim(data: any): Promise<any> {
  AppStatus.push("Submitting the Claim #"+data.uid);  

  let rs = await apiClient.mutate("submit_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim submitted. The voting process will start soon ...");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}

/* here we send the vote uand update Nullifier */
async function submitTask(data: any): Promise<any> {
  AppStatus.push("Submitting the Vote for #"+data.claimUid);  

  let rs = await apiClient.mutate("submit_task", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Task submitted ...");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.task;
}

async function submitTasksBatch(params: {
  senderAccountId: string,
  signedData: any,
  extras?: { addToQueue: boolean }
}): Promise<any> {
  const rs = await apiClient.mutate("submit_tasks_batch", params);
  if (rs.error) 
    return rs;
  return rs.data;
};

async function enableVoting(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("enable_voting", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function reassignElectors(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("reassign_electors", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function closeVoting(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("close_voting", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function reopenVoting(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("reopen_voting", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function startTally(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("start_tally", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function closeTally(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("close_tally", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}

async function issueCredentials(planUid : string) : Promise<any> {
  const rs = await apiClient.mutate("issue_credentials", {planUid});
  if (rs.error) 
    return rs;
  return rs.data;
}