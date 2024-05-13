<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: `/admined/${data.communityUid}`, text: data.communityUid},
  { href: '', text: `Master Plan #${data.name || data.uid}`}
]}/>

<DetailPageContent>
  <Section class="section-lg p-4 d-flex align-items-center justify-content-start border-0 shadow">
    <img 
      src={data.image} crossorigin
      alt="Credential badge" 
      width="22.5%" 
      style="min-width:96px;min-height:96px;max-width:96px;" 
      class="img-thumbnail rounded-4 me-2 mt-2"
      />       
    <div class="w-100 text-start ms-4">
      <span class="text-secondary fs-sm">MASTER PLAN ...</span>
      <br>
      <h1>{data.name}</h1>
      <p class="fs-nm m-0 p-0">{data.description}</p>
      {ALL_STATES[data.state]}
    </div>
  </Section>

  <Section class="section-lg mt-4">
    <TabContent vertical pills>
      <TabPane tabId="name" tab="Description" active  class="p-3 mt-0">
        <Section class="section-fluid ms-4">
          <StdFormField 
            label="Name" 
            type="text" 
            invalid={!data.name.trim().length || data.name.trim().length > 126} 
            feedback="We need a name for this Credentials. Must be shorter than 128 chars."
            bind:value={data.name} 
            />
          <StdFormField 
            label="Brief description" 
            type="textarea" 
            invalid={!data.description.trim().length || data.description.trim().length > 126}
            feedback="We need a description for this Credentials. Must be shorter than 128 chars."
            bind:value={data.description} 
            />
          <StdFormField 
            label="Image" 
            type="text" 
            help="The credential image that will be used for minting as an NFT"
            bind:value={data.image} 
            />
          <StdFormField 
            label="State" 
            type="select" 
            options={[
              { value: 1, text: "DRAFT"},
              { value: 8, text: "ACTIVE"},
              { value: 9, text: "PAUSED"},
              { value: 10, text: "INACTIVE"},
            ]}
            class="w-50"
            bind:value={data.state} 
            />
        </Section>
      </TabPane>

      <TabPane tabId="options" tab="Options" class="p-3 mt-0">
        <Section class="section-fluid ms-4">
          <div class="row">
            <div class="col-4">
              <StdFormField 
                label="Days for expiration" 
                type="number" 
                invalid={data.expiration < 0} 
                feedback="Must be >= 0"
                help="Days since issued when it must expire (or 0 for no expiration)"
                class=""
                bind:value={data.expiration} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Is revocable ?" 
                type="select" 
                help="Can this credential be revoked ?"
                class=""
                bind:value={data.revocable}
                options={[{value:true,text:"Yes"}, {value:false,text:"No"}]} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Total to be issued" 
                type="number" 
                invalid={data.total <= 0} 
                feedback="Must be > 0"
                help="Max number of this credentials which can be claimed"
                class=""
                bind:value={data.total} 
              />
              </div>
          </div>              
          <div class="row">
            <div class="col-4">
              <StdFormField 
                label={"Starts on "+startsUTC} 
                type="date" 
                help="Date when claiming of this credential can start"
                class=""
                invalid={!data.startsUTC}
                feedback={"Must provide an initial date"}
                bind:value={data.startsUTC} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
                label={"Ends on "+endsUTC} 
                type="date" 
                help="Date when claiming of this credential ends"
                class=""
                invalid={!data.endsUTC}
                feedback={"Must provide a final date"}
                bind:value={data.endsUTC} 
              />
            </div>
            <div class="col-4">
            </div>
          </div>              
  
          <StdFormField 
            label="NFT Metadata" 
            type="textarea" 
            help="Metadata to be used when minting, must be a JSON object"
            bind:value={data.metadata} 
            />
        </Section>  
      </TabPane>

      <TabPane tabId="fees" tab="Fees & Shares" class="p-4 mt-0">
        <Section class="section-fluid ms-4">
          <StdFormField 
            label="Fee (MINA)" 
            type="number" 
            invalid={data.fee < 0} 
            feedback="Must be >= 0"
            help="The fee in MINA required for this credential"
            class="w-50"
            bind:value={data.fee} 
            />
          <StdFormField 
            label="Payed by" 
            type="select" 
            options={[
              { value: 1, text: "The applicant"},
              { value: 2, text: "The community"},
            ]}
            help="Who will pay for this credential ?"
            class="w-50"
            bind:value={data.payedBy} 
            />
          <div class="row">
            <div class="col-4">
              <StdFormField 
              label="Community share (%)" 
              type="number" 
              invalid={data.communityShare < 0 || data.communityShare > 90} 
              feedback="Must be >= 0"
              help="Percentaje of fee that will go to the community"
              class=""
              bind:value={data.communityShare} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
              label="Rewards (%)" 
              type="number" 
              help="Percentage of fee that will go to validator rewards"
              class=""
              readonly
              value={100 - data.communityShare - data.protocolShare} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
              label="Protocol share (%)" 
              type="number" 
              help="Percentaje of fee that will go to the Protocol (Socialcap)"
              class=""
              readonly
              value={data.protocolShare} 
              />
            </div>
          </div>
        </Section>  
      </TabPane>

      <TabPane tabId="evidence" tab="Evidence" class="p-4 mt-0">
        <Section class="section-fluid ms-4 text-start">
          <h4 class="mb-1 ms-3">Evidence fields</h4>
          <p class="ms-3 lg-base text-secondary fs-sm">
            This is the set of evidence that the applicant 
            will be required to fill to sustain his/her claim.
          </p>
          <MasterPlanEvidence bind:items={data.evidence} />
        </Section>
      </TabPane>

      <TabPane tabId="auditors" tab="Strategy" class="p-4 mt-0">
        <Section class="section-fluid ms-4">
          <div class="row">
            <div class="col-5">
              <StdFormField 
                label="Variant" 
                type="select" 
                options={[
                  { value: "RandomAnonyomusValidators", text: "Random Anonyomus Validators"},
                  { value: "AllMembersAnonymousVoting", text: "All Members Anonymous Voting"},
                  { value: "NominatedValidators", text: "Nominated Validators"},
                  { value: "AllJudgesSecretVoting", text: "All Judges Secret Voting"},
                ]}
                bind:value={data.strategy.variant} 
                />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Selected from" 
                type="select" 
                options={[
                  { value: "AllValidators", text: "All validators"},
                  { value: "OnlyAuditors", text: "Only auditors"},
                  { value: "FullCommunity", text: "Full community"},
                ]}
                bind:value={data.strategy.selection} 
                />
            </div>
          </div>

          <div class="row">
            <div class="col-4">
              <StdFormField 
                label="Min validators" 
                type="number" 
                invalid={data.strategy.minValidators < 3} 
                feedback="Must be >= 3"
                help="Min number of validators needed"
                class=""
                bind:value={data.strategy.minValidators} 
                />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Min votes" 
                type="number" 
                invalid={data.strategy.minVotes < 3} 
                feedback="Must be >= 3"
                help="Min total votes needed to approve claim"
                class=""
                bind:value={data.strategy.minVotes} 
                />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Min positives" 
                type="number" 
                invalid={data.strategy.minPositives < 2} 
                feedback="Must be >= 2"
                help="Min positive votes needed to approve claim"
                class=""
                bind:value={data.strategy.minPositives} 
                />
            </div>
          </div>

          <div class="row">
            <div class="col-4">
              <StdFormField 
                label="Min auditors" 
                type="number" 
                invalid={data.strategy.minAuditors < 0} 
                feedback="Must be >= 0"
                help="Min number of auditors for self auditing"
                class="col-6"
                bind:value={data.strategy.minAuditors} 
                />
            </div>
            <div class="col-4">
              <StdFormField 
                label="Audit every" 
                type="number" 
                invalid={data.strategy.auditFrequency < 0} 
                feedback="Must be >= 0"
                help="Frequency of audits: 1 every N claims"
                class="col-6"
                bind:value={data.strategy.auditFrequency} 
                />
            </div>
          </div>  
        </Section>
      </TabPane>

      <TabPane tabId="rawdata" tab="Raw!" style="width:100%" class="p-4 mt-0">
        <Section class="section-md ms-4 text-start">
          <h4 class="mb-1 ms-3">Edit as raw data</h4>
              <textarea
                type="textare" rows={40}
                class="ms-3 lg-base text-secondary fs-sm w-100"
                style="white-space: pre-wrap;width:100%;"
                bind:value={rawDataJSON}></textarea>
        </Section>
      </TabPane>      
    </TabContent>

    {#if !dataIsOk(data)}
      <Alert color="warning">
        Please complete all required fields: Name, Description, Start and End dates.
      </Alert>
    {/if}
  </Section>

  <Section class="section-lg">
    <hr/>
    <div class="text-center my-4 ms-4">
      <Button color="primary" class="rounded-2 px-4 py-3"
        on:click={updateIt}>
         {#if loading }
           Updating...
        {:else}
            Update Data
        {/if}
      </Button>  
    </div>
  </Section>
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Alert, Button, Badge } from "sveltestrap";
  import { TabContent, TabPane } from 'sveltestrap';  
  import { FormGroup, Label, Input, FormText } from "sveltestrap";
  import Section from "@components/Section.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  // import MemberItem from "../../[uid]/MemberItem.svelte";
  import MasterPlanItem from "@components/lists/MasterPlanItem.svelte";
  import MasterPlanAddButton from "@components/buttons/MasterPlanAddButton.svelte";
  import StdFormField from "@components/forms/StdFormField.svelte";
  import MasterPlanEvidence from "@components/forms/MasterPlanEvidence.svelte"
  import { AppStatus } from "@utilities/app-status";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { ALL_STATES } from "@models/states";
  import { updatePlan } from "@apis/mutations";

  export let data;

  let user = getCurrentUser();
  let openDlg = false;
  let loading = false;
  onMount(() => {
    user = getCurrentUser();
  })

  const toggle = () => {
    openDlg = !openDlg;
  };

  $: rawDataJSON = JSON.stringify(data, null, 4);

  $: startsUTC = (data.startsUTC || "").split("T")[0];
  $: endsUTC = (data.endsUTC || "").split("T")[0];

  function changeValidatorState(p) {
    //alert("clicked p "+p.uid)
    toggle();
  }

  function dataIsOk(data) {
    return (
      data.name.trim() 
      && data.description.trim()
      && data.startsUTC
      && data.endsUTC)
  }

  async function updateIt() {
    if (!dataIsOk(data)) {
      AppStatus.error("All fields are required !")
      return;
    }

    // fix some special fields
    data.startsUTC = startsUTC ? startsUTC+"T00:01:00.000Z" : "";
    data.endsUTC = endsUTC ? endsUTC+"T23:59:00.000Z" : "";

    loading = true;
    const updated = await updatePlan(data);
    loading = false;
    if (updated) 
      history.back();
  }

  // Some style helpers
  const stlabel = "fw-bold fs-sm text-secondary ps-2 mb-1";
  const stinput = "rounded-1 fs-6 px-2 py-2"
</script>