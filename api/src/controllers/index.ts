import { noActions } from "./no-actions.js";
import { requestOtp, login } from "./sessions-controller.js";
import { signUp, updateProfile, getProfile } from "./persons-controller.js";
import { updateCommunity, getCommunity, getMyCommunities, getAllCommunities } from "./communities-controller.js";
import { joinCommunity, promoteMember } from "./members-controller.js";
import { getAdminedCommunity } from "./communities-controller.js"
import { getPlan, addPlan, updatePlan } from "./plans-controller.js";
import { getClaim, getMyClaimables, getMyClaims, addClaim, updateClaim, submitClaim } from "./claims-controller.js";
import { queryEmptySet } from "./empty-set.js"

export { 
  queryHandlers,
  mutationHandlers,
};

const mutationHandlers = {
  'no_actions': { fn: noActions, authorize: false },
  'request_otp': { fn: requestOtp, authorize: false },
  'login': { fn: login, authorize: false },
  'sign_up': { fn: signUp, authorize: false },
  'update_profile': { fn: updateProfile, authorize: true },
  'update_community': { fn: updateCommunity, authorize: true },
  //'update_admined_community': { fn: updateAdminedCommunity, authorize: true },
  'join_community': { fn: joinCommunity, authorize: true },
  'promote_member': { fn: promoteMember, authorize: true },
  'update_plan': { fn: updatePlan, authorize: true },
  'add_plan': { fn: addPlan, authorize: true },
  'add_claim': { fn: addClaim, authorize: true },
  'update_claim': { fn: updateClaim, authorize: true },
  'submit_claim': { fn: submitClaim, authorize: true }
}

const queryHandlers = {
  'get_empty_set': { fn: queryEmptySet, authorize: false },
  'get_profile': { fn: getProfile, authorize: true },
  'get_community': { fn: getCommunity, authorize: true },
  'get_my_communities': { fn: getMyCommunities, authorize: true },
  'get_all_communities': { fn: getAllCommunities, authorize: true },
  'get_admined_community':  {  fn: getAdminedCommunity, authorize: true },
  'get_plan':  {  fn: getPlan, authorize: true },
  // 'get_my_credentials': {  fn: getClaimables, authorize: true },
  'get_my_claims': {  fn: getMyClaims, authorize: true },
  'get_my_claimables': {  fn: getMyClaimables, authorize: true },
  'get_claim': {  fn: getClaim, authorize: true },
};
