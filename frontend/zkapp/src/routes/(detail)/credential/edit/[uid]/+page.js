/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { UID } from "@utilities/uid";
import { getPlan, getCommunity, getClaim } from "@apis/queries";
import { getCurrentUser } from '@models/current-user';
import { fixEvidenceData } from './fix-evidence-data';

async function initNewClaim(params, user) {
  const planUid = params.uid;

  const plan = await getPlan(planUid);

  const community = await getCommunity(plan.communityUid);

  let oClaim = {
    uid: UID.uuid4(),
    communityUid: plan.communityUid,
    planUid: plan.uid,
    applicantUid: user.uid,
    accountId: "",
    // derived form MasterPlan name for this credential
    type: plan.name, 
    description: plan.description,
    state: 1, // DRAFT
    community: community.name,
    image: plan.image, 
    // activity times
    createdUTC: null,
    updatedUTC: null,
    votedUTC: null,
    issuedUTC: null,
    dueUTC: plan.dueUTC,
    // voting results
    requiredVotes: plan.requiredVotes, // copied from MasterPlan
    requiredPositives: plan.requiredPositives,
    positiveVotes: 0,
    negativeVotes: 0,
    ignoredVotes: 0,
    // evidence data
    evidenceData: (plan.evidence || []).map((f) => {
      f.value = "";
      return f;
    })
  };

  return { 
    claim: oClaim, 
    plan: plan,
    community: community,
    isNew: true 
  }; 
}

////////////////////////////////////////////////////////////////////////////////

const FAKED = {
  "data": {
      "uid": "b0d5a609393048dca154d0ddee06635c",
      "communityUid": "70ed0f69af174c399b1958c01dc191c0",
      "applicantUid": "8add368f594d4dbe92f022cec4801657",
      "planUid": "8451c5020bc84d1cb9ea7808e17cd55d",
      "state": 1,
      "accountId": "",
      "alias": null,
      "createdUTC": "2024-02-26T12:12:45.019Z",
      "updatedUTC": "2024-02-26T12:12:45.019Z",
      "votedUTC": null,
      "issuedUTC": null,
      "dueUTC": null,
      "requiredVotes": 0,
      "requiredPositives": 0,
      "positiveVotes": 0,
      "negativeVotes": 0,
      "ignoredVotes": 0,
      "evidenceData": [
          {
              "sid": "",
              "required": false,
              "label": "",
              "description": "**🚨Instructions**: This form is for participants who already have a Mina Navigators badge. Please fill out the entire form by **March 2nd, 2024**. \n\n🎉February grants will be announced on **Friday, March 15, 2024**. \n\n❓If you have any questions, please reach out via Discord. \n\nIf you are not a Mina Navigator, you are not eligible for a grant in February, and this form will not be considered. \n\n👉 Check out [**Mina Navigators: Program Information Page**](https://minafoundation.notion.site/Mina-Navigators-Program-Information-e8d0490aa0e04c28b061887a8cc22f9a)\n",
              "type": "remark",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": null
              },
              "id": "ffdb7a42fa68458eaa692db5b7afb608",
              "value": ""
          },
          {
              "sid": "",
              "required": true,
              "label": "Preferred name",
              "description": "",
              "type": "text",
              "extras": {
                  "max": 200,
                  "allowed": null,
                  "options": null
              },
              "id": "f49751fe2f70442a971899a550d1ac38",
              "value": "t4top"
          },
          {
              "sid": "",
              "required": true,
              "label": "Email Address",
              "description": "What is your email? We will use this for grant onboarding.",
              "type": "text",
              "extras": {
                  "max": 200,
                  "allowed": null,
                  "options": null
              },
              "id": "fe3c471ed60d4c27af5501a59c3477d4",
              "value": "f4free2014@yahoo.co.jp"
          },
          {
              "sid": "",
              "required": true,
              "label": "Your GitHub Profile",
              "description": "Add a link to your GitHub profile.",
              "type": "text",
              "extras": {
                  "max": 300,
                  "allowed": null,
                  "options": null
              },
              "id": "dba3a5d9deea499dab519947220f3644",
              "value": "https://github.com/t4top"
          },
          {
              "sid": "",
              "required": true,
              "label": "Your Discord Handle",
              "description": "Full discord handle, for example, \"pepe2#0001\"",
              "type": "text",
              "extras": {
                  "max": 200,
                  "allowed": null,
                  "options": null
              },
              "id": "cb1418bc3f5f4d96959e85d0eb3a5311",
              "value": "t4top"
          },
          {
              "sid": "",
              "required": true,
              "label": "Your Teammates",
              "description": "Your teammate's full names, separated by commas, please. Input \"NA\" if not applicable.",
              "type": "text",
              "extras": {
                  "max": 2000,
                  "allowed": null,
                  "options": null
              },
              "id": "c41440dbbfbb4701b972e304eb01d41e",
              "value": "NA"
          },
          {
              "sid": "",
              "required": true,
              "label": "Your Project Name",
              "description": "List the projects that you contributed to during February. ",
              "type": "text",
              "extras": {
                  "max": 1999,
                  "allowed": null,
                  "options": null
              },
              "id": "ed5bf1393a3549e3bf6b4b7ef20e7ec5",
              "value": "Mina Wallet Adapter"
          },
          {
              "sid": "",
              "required": true,
              "label": "Did you have 10+ days of meaningful commits during February?",
              "description": "",
              "type": "radio",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": "Yes,No"
              },
              "id": "b93ddf0f889a40c5bf32b34b0afd32ee",
              "value": ""
          },
          {
              "sid": "",
              "required": false,
              "label": "",
              "description": "🚨 For our definition of meaningful commits, please refer to [this document](https://minafoundation.notion.site/Commit-Parameters-9ddd4a6e580846dbba47672a6c40a46b).",
              "type": "remark",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": null
              },
              "id": "bb462ac6193f4e3b86dad0bbeb9279ae",
              "value": ""
          },
          {
              "sid": "",
              "required": true,
              "label": "Project GitHub Repositories",
              "description": "",
              "type": "note",
              "extras": {
                  "max": 2000,
                  "allowed": null,
                  "options": null
              },
              "id": "ea633c6ea7ec44309ad00777af94d7d0",
              "value": "https://github.com/mina-wallet-adapter/wallet-adapter, https://github.com/mina-wallet-adapter/mina-ledger-js, https://github.com/t4top/mina-learn-to-earn",
              "inner": {}
          },
          {
              "sid": "",
              "required": false,
              "label": "",
              "description": "List **ALL** repositories that you personally contributed to during February. Please include a space and comma in between each URL.",
              "type": "remark",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": null
              },
              "id": "2bd69e212069446fa1b9655212271a6b",
              "value": ""
          },
          {
              "sid": "",
              "required": true,
              "label": "Did you deliver your milestones during February?",
              "description": "",
              "type": "radio",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": "Yes,No,Partially Delivered"
              },
              "id": "a793176e392d41d7b9321cf38035d194",
              "value": ""
          },
          {
              "sid": "",
              "required": false,
              "label": "",
              "description": "🚨 If you have completed some of your proposed milestones to be completed in February but not others, select the **\"Partially Delivered\"** option and write down the milestones you have completed in \"Milestones delivered in February\" and the milestones you have not completed in \"Milestones couldn't be delivered in February\" questions with details.",
              "type": "remark",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": null
              },
              "id": "e43e7ae81c7f43d3bca9f5317f090f21",
              "value": ""
          },
          {
              "sid": "",
              "required": true,
              "label": "Milestones delivered in February",
              "description": "List the milestones that you \"personally\" delivered in February. If you work as part of a team, please be explicit about your individual contributions and milestones delivered. ",
              "type": "note",
              "extras": {
                  "max": 20000,
                  "allowed": null,
                  "options": null
              },
              "id": "e24032864d0f4074a36bbd688fc36878",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": true,
              "label": "Milestones testing",
              "description": "",
              "type": "note",
              "extras": {
                  "max": 20000,
                  "allowed": null,
                  "options": null
              },
              "id": "20172a556da943d1a5b85d9516da42b5",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": false,
              "label": "",
              "description": "👉Where possible, can you please provide instructions on how completed milestones can be tested? Write N/A if not applicable. \n\n👇Ex;\n- Bug fixes, optimizations, research - N/A \n- New components, flows, tests - Provide instructions",
              "type": "remark",
              "extras": {
                  "max": 0,
                  "allowed": null,
                  "options": null
              },
              "id": "1422a5004bc54b1a8dbd571c3d2b397f",
              "value": ""
          },
          {
              "sid": "",
              "required": true,
              "label": "Milestones couldn't delivered in February",
              "description": "List the milestones you \"personally\" didn't deliver in February, but you proposed delivering for February. If you work as part of a team, please be explicit about your individual contributions and milestones delivered. \n\nIf you delivered all of your milestones, write N/A.\n",
              "type": "note",
              "extras": {
                  "max": 20000,
                  "allowed": null,
                  "options": null
              },
              "id": "a8def4e3d06345b6829046650dda0c4e",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": true,
              "label": "Do you have any specific issues you'd like to report about o1js? ",
              "description": "If you don’t have anything to add here, write N/A.",
              "type": "note",
              "extras": {
                  "max": 2000,
                  "allowed": null,
                  "options": null
              },
              "id": "b55d946f905049f9bcb13302c0890ee2",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": true,
              "label": "Are there any major blockers/barriers/problems in your development that prevent you from delivering your milestones or creating challenges for you?",
              "description": "If you don’t have anything to add here, write N/A. And, you can always reach out to us on Discord. ",
              "type": "note",
              "extras": {
                  "max": 19990,
                  "allowed": null,
                  "options": null
              },
              "id": "02ab873931bf4f7f87ab4cfd36191f41",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": true,
              "label": "March Milestones (proposed)",
              "description": "Please list the milestones that you would like to achieve during March. If you are working as part of a team, please be explicit about your planned individual milestones and how they differ from your teammates. A team of community reviewers will check your completed milestones against what you have proposed here.",
              "type": "note",
              "extras": {
                  "max": 20000,
                  "allowed": null,
                  "options": null
              },
              "id": "4d73c9035707429ab664ef8112787ea2",
              "value": "",
              "inner": {}
          },
          {
              "sid": "",
              "required": true,
              "label": "Project URL or Hosted page",
              "description": "Please share your projects’ hosted page (vercel, github pages, etc…). If you do not have a hosted page, please write N/A. ",
              "type": "note",
              "extras": {
                  "max": 20000,
                  "allowed": null,
                  "options": null
              },
              "id": "a9293b8dbedf4e5f95934cc73433b9c6",
              "value": "https://mina-wallet-adapter.github.io/wallet-adapter/",
              "inner": {}
          }
      ]
  },
  "error": null
};

////////////////////////////////////////////////////////////////////////////////

async function loadClaim(params, user) {
  const claimUid = params.uid;

  let claim = await getClaim(claimUid);

  claim = FAKED.data;

  const plan = await getPlan(claim.planUid);

  const org = await getCommunity(claim.communityUid);

  claim.community = org.name;
  claim.type = plan.name;
  claim.description = plan.description;
  claim.image = plan.image; 
  claim.evidenceData = fixEvidenceData(plan.evidence, claim.evidenceData);

  return { 
    claim: claim, 
    plan: plan,
    community: org,
    isNew: false 
  }; 
}


/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  if (params.slug !== "") {
      let user = await getCurrentUser();
      const isNew = url.searchParams.get('isnew', null);

      return ((isNew !== null)
        ? await initNewClaim(params, user) 
        : await loadClaim(params, user)
      )  
    }
    throw error(404, 'Not found');
}
