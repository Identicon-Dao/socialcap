<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: "Admin: "+data.name}
]}/>

<DetailPageContent>
  <Section class="section-lg pb-4">
    <div class="d-flex justify-content-start align-items-center">
      <img 
        src={data.image} crossorigin
        alt="Community logo"
        width="22.5%" 
        style="min-width:160px;min-height:160px;max-width:160px;" 
        class="img-thumbnail rounded-4 me-2 mt-2" 
        />
      <div class="w-100 ms-4 text-start">
        <span class="text-secondary fs-sm">ADMINISTERING  THIS COMMUNITY ...</span>
        <br>
        <h1 class="text-black m-0 p-0 w-100 d-flex align-items-center justify-content-between">
          {data.name}
          <span class="fs-5">
            <Badge size="sm">
              {data.state}
            </Badge>
          </span>
        </h1>
        <div class="mt-2">
          <p class="fs-sm mt-1">
            <b>{data.countMembers}</b> members
            | <b>{data.countClaims}</b> claims
            | <span class="fs-4"> 🎉 </span>
            &nbsp; <b>{data.countCredentials}</b> credentials issued !
          </p>
          <p>{@html data.description}</p>    
        </div>

        <div class="d-flex justify-content-start">
          <p class="">
            <span class="fs-xs">Start Date</span>
            <br/><b class="fs-sm">{prettyDate(data.createdUTC)}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Approved Date</span>
            <br/><b class="fs-sm">{prettyDate(data.approvedUTC)}</b>
          </p>
          <p class="px-0">
            <span class="fs-xs">Updated</span>
            <br/><b class="fs-sm">{prettyDate(data.updatedUTC)}</b>
          </p>
        </div>
      </div>
    </div>
    <hr/>
  </Section>
  
  <Section class="section-fluid">
    <TabContent class="" on:tab={(e) => (tab = e.detail)}>
      <span style="width:1rem;">&nbsp;</span>

      <TabPane tabId="name" tab="General" class="text-start p-4">
        <FormGroup>
          <Label>Name</Label>
          <Input type="text"
            bind:value={data.name} required
            feedback="Name is required. Should have less than 128 characters."
            invalid={!data.name.trim() || data.name.length > 128 }/>
        </FormGroup>
        <FormGroup>
          <Label>Brief description</Label>
          <Input type="textarea" bind:value={data.description} required
            feedback="Description is required. Should have less than 128 characters."
            invalid={!data.description.trim() || data.description.length > 128 }/>
        </FormGroup>

        <FormGroup>
          <Label>Image</Label>
          <Input type="text" bind:value={data.image} />
        </FormGroup>
      </TabPane>

      <TabPane tabId="plans" tab="Master Plans" class="p-4">
        {#each data.plans as plan}
          <MasterPlanItem plan={plan} />
        {/each}
        <MasterPlanAddButton 
          community={data}  
          bind:plans={data.plans}/>
      </TabPane>

      <TabPane tabId="promotions" tab="Members" class="p-4" active>
        {#each data.members as p}
          <MemberItem 
            p={p} 
            communityUid={data.uid}
            admin={data.adminUid}
            xadmins={data.xadmins}/>
        {/each}
      </TabPane>

      <TabPane tabId="validators" tab="Validators" class="p-4">
        {#each data.validators as p}
          <MemberItem 
            p={p} 
            admin={data.adminUid}
            xadmins={data.xadmins}/>
        {/each}
      </TabPane>

      <TabPane tabId="admins" tab="Admins" class="p-4">
        <!-- {#each (data.xadmins || []) as xadmin}
          <p>{xadmin}</p>
        {/each} -->
        {#if user.uid == data.adminUid}
          <div class="mx-5">
            <Input 
              type="textarea"
              rows={3}
              class="w-100"
              bind:value={data.xadminss}
             />
          </div>
        {:else}
          <p class="fs-md p-3 px-5 text-start">
            Only the Community owner can add or remove administrators.
          </p>
        {/if}
      </TabPane>

      <TabPane tabId="claims" tab="Claims" class="py-4 px-2">
        <ClaimsList communityUid={data.uid} claims={data.claims} />
      </TabPane>
      <TabPane tabId="voting" tab="Voting" class="py-4 px-2">
        <Voting communityUid={data.uid}
            state={data.state}
            votingStatus={data.votingStatus}
            judges={data.validators}
            adminUid={data.adminUid}
            xadmins={data.xadmins}
            plans={data.plans}
            members={data.members} />
      </TabPane>
    </TabContent>

    <div class="text-center mt-4 mb-5">
      <Button color="primary" class="rounded-2 p-3" loading=true
        on:click={handleSubmit}>
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
  import { Button, Badge, Spinner} from "sveltestrap";
  import { TabContent, TabPane } from 'sveltestrap';  
  import { FormGroup, Label, Input } from "sveltestrap";
  import Section from "@components/Section.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import MemberItem from "./MemberItem.svelte";
  import MasterPlanItem from "@components/lists/MasterPlanItem.svelte";
  import MasterPlanAddButton from "@components/buttons/MasterPlanAddButton.svelte";
  import ClaimsList from "./ClaimsList.svelte";
  import Voting from "./Voting.svelte"
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { prettyDate } from "@utilities/datetime";
  import { AppStatus } from "@utilities/app-status";
  import { updateCommunity, attachPlan } from "@apis/mutations";

  export let data;

  let user = getCurrentUser();
  let openDlg = false;
  let loading = false;
  let tab;

  let stateColors = {
    "APPLIED": "warning",
    "APPROVED": "success",
    "DENIED": "danger"
  }

  onMount(async () => {
    user = await getCurrentUser();
  })

  const toggle = () => {
    openDlg = !openDlg;
  };

  function changeValidatorState(p) {
    //alert("clicked p "+p.uid)
    toggle();
  }

  function dataIsOk(data) {
    return (data.name.trim() && data.description.trim() && data.description.length <=128 && data.name.length <=128);
  }

  async function handleSubmit() {
    if (!dataIsOk(data)) {
      AppStatus.error("All fields are required !")
      return;
    }
    loading = true;
    const updated = await updateCommunity(data);
    if (updated) 
      history.back();
    loading = false;
  }
</script>