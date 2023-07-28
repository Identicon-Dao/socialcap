<div class="row fs-sm mx-0 mb-2 ps-4 pt-2 pb-3 border-bottom border-1">
  <span class="col-1">
    &nbsp;
  </span>
  <div class="col lh-base">
    <Button outline class="px-3 py-2 rounded-2" color="dark" size="sm" on:click={addMasterPlan}>
      <b>+</b> Add a new Claim Master Plan ...
    </Button>
  </div>
</div>

<script>
  import { Badge, Button } from "sveltestrap";
  import { MasterPlan } from "@models/master-plan";
  import { attachPlan } from "@apis/mutations";

  export let plans, community; 

  async function addMasterPlan() {
    const addedPlan = await attachPlan({
      communityUid: community.uid,
      name: "Plan #"+(plans.length+1),
      description: "",
      image: community.image,
      state: 1, // DRAFT
      //  reasonable default values
      evidence: "[]",
      fee: 5, // the fee in MINA required for this credential
      rewardsShare: 60, // percentaje of the fee that will go to validator rewards
      communityShare: 30, // percentaje of fee that will go to the community
      protocolShare: 10, // percentaje of fee that will go to the Protocol (Socialcap)
      total: 1,
      expiration: 0, // days since issued when an issued credential wil expire (or 0 for no expiration)
      revocable: true,
      // strategy 
      strategy: JSON.stringify({
        title: "",
        variant: "RandomAnonyomusValidators",
        selection: "ValidatorsSet",
        minValidators: 3,
        minVotes: 3,
        minPositives: 2,
        minAuditors: 1,
        auditFrequency: 10 // 1 every 10 claims 
      }), 
    });

    plans = (plans || []).concat([addedPlan]);
  }
</script>
