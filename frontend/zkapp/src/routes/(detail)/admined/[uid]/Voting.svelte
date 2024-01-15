<div class="d-flex align-items-left p-3">
  <MasterPlanSelector 
  bind:value={planSelected} label="Master Plan" options={plans.map(p => ({ value: p.uid, text: p.name}))} placeholder="Select a Master Plan" />
</div>
{#if (planSelected)}
  <Section class="section-lg mt-4">
    <Steps {steps} current={currentStep}/>
  </Section>
  <Section class="section-lg mt-4">
    <!-- {#if (isVotingEnabled())} -->
  
      {#each judges as p}
      <MemberItem 
        p={p} 
        admin={adminUid}
        xadmins={xadmins}/>
      {/each}
      {#if (isMinValidatorsReached())}
      <Button 
        on:click={() => createValidatorTasks()}
        color="primary" size="" class="me-4">
        Create Validators Tasks 
      </Button>
     {/if}
   
  </Section>
  {/if}

  <script>
    import { onMount } from "svelte";
    import { Icon } from "sveltestrap";
    import { FormGroup, Label, Input, FormText, Button } from "sveltestrap";
    import Section from "@components/Section.svelte";
    import DetailPageContent from "@components/DetailPageContent.svelte";
    import DetailPageHeader from "@components/DetailPageHeader.svelte";
    // import MemberItem from "../../[uid]/MemberItem.svelte";
    import StdFormField from "@components/forms/StdFormField.svelte";
    import { AppStatus } from "@utilities/app-status";
    import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
    import { ALL_STATES, VOTING, DONE } from "@models/states";
    import { Steps } from 'svelte-steps';
    import MemberItem from "./MemberItem.svelte";
    import MasterPlanSelector from "@components/MasterPlanSelector.svelte";
    export let communityUid, state, startsUTC, endsUTC, judges, adminUid, xadmins, plans;
    console.log("state");
    let planSelected = undefined;
    let steps = [
        { text: 'Voting Start', icon: Icon, iconProps: {name: "envelope-paper"} },
        { text: 'Confirm Judges', icon: Icon, iconProps: {name: "people"}},
        { text: 'Voting End', icon: Icon, iconProps: {name: "envelope-slash "} },
        { text: 'Votes Tallying', icon: Icon, iconProps: {name: "box-seam "} }
    ];
    let currentStep = 0;
    
    function isVotingEnabled() {
      return state === VOTING;
    }

    function isVotingFinished() {
      return state === DONE
    }
    
    function isMinValidatorsReached() {
      return true;
    }

    function createValidatorTasks() {
      // TodDo implement
    }
  
  </script>