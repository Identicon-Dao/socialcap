import type { MasterPlan } from "./master-plan";

export { Claim }; 

export type { IClaim };

type IClaim = {
  uid               : string,
  communityUid      : string,
  applicantUid      : string,
  planUid           : string,
  state             : number,
  accountId         : string,
  alias             : string,
  createdUTC        : string,
  updatedUTC        : string,
  votedUTC          : string,
  issuedUTC         : string,
  dueUTC            : string,
  requiredVotes     : number,
  requiredPositives : number,
  positiveVotes     : number,
  negativeVotes     : number,
  ignoredVotes      : number,
  evidenceData      : any[]
};


type ClaimState =  
  "STARTED" | "SUBMITED" | "ASSIGNED" | "VOTING" | 
  "CANCELED" | "APPROVED" | "REJECTED";

class Claim {
  /// from basic DB Claim Entity ///
  // ids and references 
  uid: string; 
  planUid: string;
  communityUid: string; 
  applicantUid: string; 
  accountId: string;
  alias: string; // applicant full name or alias he would like to use
  state: ClaimState;

  // activity times
  createdUTC: string;
  updatedUTC: string;
  votedUTC: string;
  issuedUTC: string;
  dueUTC: string;

  // voting results
  requiredVotes: number;
  currentVotes: number;
  positiveVotes: number;
  negativeVotes: number;
  ignoredVotes: number;

  // evidence data and file links
  encryption: string;
  evidence: any[];
  hash: string; // evidence data hash?

  /// this is EXTRA data not present in the base Entity ///
  type: string; // copied from MasterPlan name
  description: string; // copied from MasterPlan description
  image: string; // copied from MasterPlan
  community: string; // copied from Community name

  constructor(params?: {
    plan: MasterPlan,
    applicantUid: string,
  }) {
    this.uid = "claim1234";//randomUUID().replace(/-/g,'');
    this.planUid = params?.plan?.uid || "";
    this.communityUid = params?.plan?.communityUid || "";
    this.applicantUid = params?.applicantUid || "";
    this.state = "STARTED";
    this.type = params?.plan?.name || "";
    this.description = params?.plan?.description || "";

    // create slots for evidence data in the Claim object
    this.evidence = (params?.plan?.evidence || []).map((f) => {
      return { sid: f.sid, value: "", type: f.type };
    })
  }

  static fromJSON(json: string): Claim {
    const t: Claim = Object.assign(
      (new Claim()) as object, 
      JSON.parse(json)
    );
    return t;
  }

  static mockup(): Claim {
    return Claim.fromJSON(JSON.stringify(aClaimMockup));
  }
}


const aClaimMockup = {
  uid: "claim1234",
  communityUid: "comm1234",
  planUid: "plan1234",
  applicantUid: "user1234",
  accountId: "",

  type: "Core Team Member", // derived form MasterPlan name for this credential
  description: "Rewarding outstanding developers in our community",
  state: "VOTING", 
  community: "True Grass Eating DAO",
  image: "https://nftstorage.link/ipfs/bafybeignqpmsfdpvtko7zbojxns5ifjaki7vm7x5geb4jsq5xstnjy7uai/image", 

  // activity times
  createdUTC: "1 May 2023",
  updatedUTC: "7 May 2023",
  votedUTC: "",
  issuedUTC: "",
  dueUTC: "12 May 2023",
  
  // voting results
  requiredVotes: 4, // copied from MasterPlan
  currentVotes: 1,
  positiveVotes: 1,
  negativeVotes: 0,
  ignoredVotes: 0,

  // evidence data
  evidence: [{
      sid: 'tgid',
      label: "Your telegram account",
      type: "text",
      value: "@marucoPenguin"
    }, { 
      sid: 'more',  
      label: "Additional evidence for your claim",
      type: "note",
      value: "longnote + longnote + longnote",
    }, {
      sid: 'docfile',
      label: "Attach this file please ...",
      type: "file",
      value: "/files/0234...feA00.svg"
    }
  ],
  hash: "A62F345678...A0BC4"
}
