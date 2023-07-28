<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: `/admined/${data.communityUid}`, text: data.community},
  { href: '', text: `Master Plan #${data.name || data.uid}`}
]}/>

<DetailPageContent>
  <Section class="section-lg pb-4 d-flex align-items-center justify-content-center">
    <img src={data.image} width="80px" alt="..." crossorigin class="rounded-circle"/>
    <div class="text-start ms-4">
      <b>Master Plan</b>
      <h5>{data.name}</h5>
      <p class="fs-sm m-0 p-0">{data.description}</p>
      {ALL_STATES[data.state]}
    </div>
  </Section>
  <hr/>

  <Section class="section-lg">
    <TabContent vertical pills>
      <TabPane tabId="name" tab="Description" active>
        <Section class="section-fluid ms-4">
          <StdFormField 
            label="Name" 
            type="text" 
            invalid={!data.name.trim()} 
            feedback="We need a name for this Credentials"
            bind:value={data.name} 
            />
          <StdFormField 
            label="Brief description" 
            type="textarea" 
            no-invalid={!data.description.trim()} 
            feedback="We need a description for this Credentials"
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
              { value: "1", text: "DRAFT"},
              { value: "8", text: "ACTIVE"},
              { value: "9", text: "PAUSED"},
              { value: "10", text: "INACTIVE"},
            ]}
            class="w-25"
            bind:value={data.state} 
            />
        </Section>
      </TabPane>

      <TabPane tabId="options" tab="Options">
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
              label="Starts on" 
              type="date" 
              help="Date when claiming of this credential can start"
              class=""
              bind:value={data.startsUTC} 
              />
            </div>
            <div class="col-4">
              <StdFormField 
              label="Ends on" 
              type="date" 
              help="Date when claiming of this credential ends"
              class=""
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

      <TabPane tabId="fees" tab="Fees & Shares">
        <Section class="section-fluid ms-4">
          <StdFormField 
            label="Fee (MINA)" 
            type="number" 
            invalid={data.fee < 2} 
            feedback="Must be >= 2"
            help="The fee in MINA required for this credential"
            class="w-50"
            bind:value={data.fee} 
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
              help="Percentaje of fee that will go to validator rewards"
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

      <TabPane tabId="evidence" tab="Evidence">
        <Section class="section-fluid ms-4 text-start">
          <h4 class="mb-1 ms-3">Evidence fields</h4>
          <p class="ms-3 lg-base text-secondary fs-sm">
            This is the set of evidence that the applicant 
            will be required to fill to sustain his/her claim.
          </p>
          <MasterPlanEvidence bind:evidence={data.evidence} />
        </Section>
      </TabPane>

      <TabPane tabId="auditors" tab="Strategy">
        <Section class="section-fluid ms-4">
          <StdFormField 
            label="Variant" 
            type="select" 
            options={[
              { value: "RandomAnonyomusValidators", text: "Random Anonyomus Validators"},
              { value: "AllMembersAnonymousVoting", text: "All Members Anonymous Voting"},
              { value: "NominatedValidators", text: "Nominated Validators"},
            ]}
            bind:value={data.strategy.variant} 
            />
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
    </TabContent>
  </Section>

  <Section class="section-lg">
    <hr/>
    <div class="text-center my-4 ms-4">
      <Button color="primary" class="rounded-5 px-4 py-2"
        on:click={updateIt}>
        Update it !
      </Button>  
    </div>
  </Section>
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Button, Badge } from "sveltestrap";
  import { TabContent, TabPane } from 'sveltestrap';  
  import { FormGroup, Label, Input, FormText } from "sveltestrap";
  // import { Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import Filler from "@components/Filler.svelte";
  import Section from "@components/Section.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import MemberItem from "@components/MemberItem.svelte";
  import MasterPlanItem from "@components/MasterPlanItem.svelte";
  import MasterPlanAddButton from "@components/MasterPlanAddButton.svelte";
  import StdFormField from "@components/StdFormField.svelte";
  import MasterPlanEvidence from "@components/MasterPlanEvidence.svelte"
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { ALL_STATES } from "@socialcap/contracts";
  import { updatePlan } from "@apis/mutations";

  export let data;

  let user = getCurrentUser();
  let openDlg = false;

  onMount(() => {
    user = getCurrentUser();
  })

  const toggle = () => {
    openDlg = !openDlg;
  };

  function changeValidatorState(p) {
    //alert("clicked p "+p.uid)
    toggle();
  }

  function dataIsOk(data) {
    return (data.name.trim() && data.description.trim());
  }

  async function updateIt() {
    if (!dataIsOk(data)) {
      AppStatus.error("All fields are required !")
      return;
    }
    const updated = await updatePlan(data);
    if (updated) 
      history.back();
  }

  // Some style helpers
  const stlabel = "fw-bold fs-sm text-secondary ps-2 mb-1";
  const stinput = "rounded-1 fs-6 px-2 py-2"
</script>