<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { isFirstTimeUser } from "@models/current-user";
  import { ALL_STATES } from "@models/states";

  // Ui components
	import { Spinner, Icon, TabContent, TabPane, Button } from 'sveltestrap';
  import RootHeader from '@components/HubPageHeader.svelte'; 
  import HubPageContent from '@components/HubPageContent.svelte';
  import Section from '@components/Section.svelte';
  import HomeCredentialsCard from '@components/home/HomeCredentialsCard.svelte';
  import HomeCommunitiesCard from '@components/home/HomeCommunitiesCard.svelte';
  //import EmptyFirstTime from '@components/EmptyFirstTime.svelte';
  import HomeAdminsCard from '@components/home/HomeAdminsCard.svelte';
  import CredentialCard from '@components/cards/CredentialCard.svelte';
  import ClaimCard from "@components/cards/ClaimCard.svelte";
  import CommunityCard from '@components/cards/CommunityCard.svelte';
  import EmptyItemsCard from "@components/cards/EmptyItemsCard.svelte";
  import TasksList from "./_home/TasksList.svelte";
  import Device from 'svelte-device-info'
	import Mobile from "@components/errors/Mobile.svelte";
	import { getMyClaims, getMyTasks, getMyCommunities, getMyCredentials } from "@apis/queries";
  import { ASSIGNED, ACTIVE } from '@models/states';
  export let data; // this is the data for the lists

  let currentPage = $page.url.pathname;

  $: isAuthenticated = data.isAuthenticated;
  $: user = data.user;
  let assigned = null;
  let claimed = null;
  let joined = null;
  let credentials = null;
  onMount(async () => {
    console.log("+page.svelte onMount")
    console.log(ALL_STATES);
    console.log("device is mobile?", Device.isMobile)
    if (isAuthenticated && user) 
      goto(currentPage)
    else
      goto("/login");
    assigned = (await getMyTasks({user})).filter((t) => t.state=== ASSIGNED);
    claimed = await getMyClaims({user});
    joined = await getMyCommunities({user});
    credentials = await getMyCredentials({user});
  })
</script>

<RootHeader />

<HubPageContent>
  {#if Device.isMobile}
    <Mobile />
  {:else}
    <Section class="section-fluid px-0">
      <!-- {#if user && isFirstTimeUser(user)}
        <div class="mb-4">
          <EmptyFirstTime {user}/>   
        </div>
      {/if} -->

      <div class="row p-0">
          <div class="col-12 mt-3 col-md-6 mt-md-0">
            <HomeCommunitiesCard {data}/>
          </div>  
          <div class="col-12 col-md-6">
            <HomeCredentialsCard {data}/>
          </div>  
      </div>
    </Section>

    <Section class="m-0 p-0 section-fluid mt-4 pt-4 bg-container">
        <TabContent>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <TabPane tabId="creds" tab="My credentials" active>
            {#if !credentials || !credentials?.length}
              <EmptyItemsCard notice="You don't have any approved credentials" />
            {:else}
            {#each credentials as credential}
              <CredentialCard uid={credential.uid} data={credential}/>
            {/each}
            {/if}
            
          </TabPane>

          <TabPane tabId="claims" tab="My claims">
            {#if !claimed || !claimed?.length}
              <EmptyItemsCard notice="You have no pending claims" />
            {:else}
              {#each claimed as claim}
              <ClaimCard data={claim}/>
              {/each}
            {/if}
          
          </TabPane>

          <TabPane tabId="comns" tab="My communities" on:click={() => alert()}>
            {#if !joined || !joined?.length}
              <EmptyItemsCard notice="You have no joined any community" />
            {:else}
              {#each joined as org}
                <CommunityCard uid={org.uid} data={org} joined={true} user={user}/>
              {/each}
            {/if}
            <div class="p-4 m-0 px-4">
              <HomeAdminsCard />
            </div>
          </TabPane>
          
          {#if user && user.hasTasks}
            <TabPane tabId="tasks" tab="My tasks">
              {#if !assigned || !assigned.length}
                <EmptyItemsCard notice="You have no pending tasks" />
              {:else}
                <TasksList data={assigned} />
              {/if}
            </TabPane>
          {/if}

        </TabContent>      
    </Section>
    {/if}
</HubPageContent>
