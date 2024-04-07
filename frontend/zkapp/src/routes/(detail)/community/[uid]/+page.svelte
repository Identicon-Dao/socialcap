<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: data.name}
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
      <div class="d-flex justify-content-start">
          
          {#if user && user.uid === data.adminUid || data.xadmins.includes(user.uid)}
            <a class="text-dark text-decoration-none"
              href={'#'} 
              on:click={() => goto(`/admined/${data.uid}`)} 
              >
              <Button outline color="dark" size="sm" class="rounded-5 px-3 py-1">
                Admin it ...
              </Button>
            </a>
          {/if}
 
      </div>
    </div>

  </Section>
    
   
  <Section class="section-fluid">
    <TabContent class="" on:tab={(e) => (tab = e.detail)}>
      <span style="width:1rem;">&nbsp;</span>

      <TabPane tabId="promotions" tab="Members" class="p-4" active>
        {#each data.members as p}
          <MemberItem 
            p={p} />
        {/each}
      </TabPane>

      <TabPane tabId="app-claims" tab="Approved Claims" class="py-4 px-2">
        {#if !approvedClaims || !approvedClaims?.length}
        <EmptyItemsCard notice="There are no approved claims" />
        {:else}
          {#each approvedClaims as credential}
          <CredentialCard uid={credential.uid} data={credential}/>
        {/each}
        {/if}
       
      </TabPane>

      <TabPane tabId="claims" tab="My claims">
        {#if !claimed || !claimed?.length}
          <EmptyItemsCard notice="You have no pending claims" /> 
        {:else}
          {#each data.claimed as claimed}
            <ClaimCard data={claimed}/>
          {/each}
        {/if}
      
      </TabPane>
      <TabPane tabId="my-credentials" tab="My credentials" class="py-4 px-2">
        {#if !credentials || !credentials?.length}
          <EmptyItemsCard notice="You don't have any approved credential from this community" />
        {:else}
          {#each credentials as credential}
            <CredentialCard uid={credential.uid} data={credential}/>
          {/each}
        {/if}
      
      </TabPane>
    </TabContent>

  </Section>
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Button, Badge, TabContent, TabPane } from "sveltestrap";
  import Section from "@components/Section.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { prettyDate } from "@utilities/datetime";
  import MemberItem from "./MemberItem.svelte";
  import { goto } from "$app/navigation";
  import ClaimCard from "@components/cards/ClaimCard.svelte";
  import EmptyItemsCard from "@components/cards/EmptyItemsCard.svelte";
  import CredentialCard from '@components/cards/CredentialCard.svelte';
  import { getMyClaims, getMyCredentials } from '@apis/queries';
  import { APPROVED } from "@models/states";

  export let data;
  let user = {};
  let tab;

  let claimed = null; 
  let credentials = null;
  let approvedClaims = null;
  let claimables = null;


  onMount(async () => {
    user = await getCurrentUser();
    claimed = await getMyClaims(params);
    credentials = await getMyCredentials({user, communityUid: params.uid});
    approvedClaims = data.claims.filter((c) => c.state == APPROVED);
    claimables = await getClaimables(params.uid)
  })
</script>