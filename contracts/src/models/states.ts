/**
 * Possible states and their descriptions
 * 
 * Usage:
 * 
 *  // test valid state
 *  if (CLAIM_STATES.includes(state) {
 *    // is a valid state
 *  })
 */
export {
  ALL_STATES,
  COMMUNITY_STATES,
  CLAIM_STATES,
  PERSON_STATES,
  ELECTOR_STATES,
  PLAN_STATES,
  TASK_STATES
}

const ALL_STATES = {
  0: "NONE",
  1: "DRAFT",   
  2: "CANCELED",   
  3: "REVISION",    
  4: "CLAIMED",   
  6: "VOTING",
  7: "ASSIGNED",
  8: "ACTIVE",
  9: "WAITING",
  10: "DONE",
  11: "IGNORED", // will not do this 
  19: "REJECTED",   
  20: "APPROVED"
}

const COMMUNITY_STATES = [1,2,3,19,20]; // DRAFT,CANCELED,REVISION,REJECTED.APPROVED

const CLAIM_STATES = [1,2,4,6,19,20]; // DRAFT,CANCELED,CLAIMED,VOTING,REJECTED,APPROVED

const PERSON_STATES = [1,2,19,20]; // DRAFT,CANCELED,REJECTED,APPROVED

const ELECTOR_STATES = [0,2,7,8,11]; // NONE,CANCELED,ASSIGNED,DONE,IGNORED

const PLAN_STATES = [1,2,9,8,10]; // DRAFT,CANCELED,WAITING,ACTIVE,DONE

const TASK_STATES = [2,7,10,11]; // CANCELED,ASSIGNED,DONE,IGNORED
