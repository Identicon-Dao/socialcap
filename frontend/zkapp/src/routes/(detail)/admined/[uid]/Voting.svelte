<div class="d-flex align-items-left p-3">
  <MasterPlanSelector 
  bind:value={selectedPlanUid} label="Master Plan" options={plans.map(p => ({ value: p.uid, text: p.name}))} placeholder="Select a Master Plan" />
</div>
{#if (selectedPlanUid)}
  <Section class="section-lg mt-4">
    <Steps {steps} current={currentStep} clickable={false}/>
  </Section>
  <Section class="section-lg mt-4">
     {#if (currentStep === 0)} 
        <Button 
        on:click={() => startVoting()}
        color="primary" size="" class="me-4">
        Start Voting
      </Button>
     {/if}
     {#if (currentStep === 1)} 
      
      {#if (isMinValidatorsReached())}
        {#each judges as p}
        <MemberItem 
          p={p} 
          admin={adminUid}
          xadmins={xadmins}/>
        {/each}
        <Button 
          on:click={() => createValidatorTasks()}
          color="primary" size="" class="me-4">
          Create Validators Tasks 
        </Button>
      {:else}
        <Alert color="warning">     
          Minimum Judges required to start voting are not reached. Please assign judges. 
        </Alert>
        {#each members as p}
        <MemberItem 
          p={p} 
          communityUid={communityUid}
          admin={adminUid}
          xadmins={xadmins}/>
        {/each}
        <Button 
          disabled={!isMinValidatorsReached()}
          on:click={() => createValidatorTasks()}
          color="primary" size="" class="me-4">
          Assign Judges
      </Button> 
      {/if}
     {/if}

     {#if (currentStep === 2)}
      <Alert color="info">     
        Voting in progress
      </Alert>
      <Button 
          on:click={() => stopVoting()}
          color="primary" size="" class="me-4">
          Stop Voting
      </Button> 
     {/if}

     {#if (currentStep === 3)}
     <Button 
        on:click={() => startTallying()}
        color="primary" size="" class="me-4">
        Start Tallying
    </Button> 
     {/if}
   
  </Section>
  {/if}

  <script>
    import { onMount } from "svelte";
    import { Icon } from "sveltestrap";
    import { FormGroup, Label, Input, FormText, Button, Alert } from "sveltestrap";
    import Section from "@components/Section.svelte";
    import DetailPageContent from "@components/DetailPageContent.svelte";
    import DetailPageHeader from "@components/DetailPageHeader.svelte";
    // import MemberItem from "../../[uid]/MemberItem.svelte";
    import StdFormField from "@components/forms/StdFormField.svelte";
    import { AppStatus } from "@utilities/app-status";
    import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
    import { ALL_STATES, NONE, VOTING, FINISHED,  DONE, CLAIMED } from "@models/states";
    import { Steps } from 'svelte-steps';
    import MemberItem from "./MemberItem.svelte";
    import MasterPlanSelector from "@components/MasterPlanSelector.svelte";
    import { enableVoting, reassignElectors, closeVoting, reopenVoting, startTally, closeTally, issueCredentials } from "@apis/mutations";

    export let communityUid, startsUTC, endsUTC, judges, adminUid, xadmins, plans, members;
    let selectedPlanUid = undefined;
    let steps = [
        { text: 'Voting Start', icon: Icon, iconProps: {name: "envelope-plus-fill"} },
        { text: 'Confirm Judges', icon: Icon, iconProps: {name: "people-fill"}},
        { text: 'Voting', icon: Icon, iconProps: {name: "envelope-paper-fill"}},
        { text: 'Voting End', icon: Icon, iconProps: {name: "envelope-slash-fill"} },
        { text: 'Votes Tallying', icon: Icon, iconProps: {name: "box-seam-fill"} },
        { text: 'Issue Credentials', icon: Icon, iconProps: {name: "box-seam-fill"} }
    ];
    // let currentStep = getCurrentStep();
    $: currentStep = getCurrentStep(selectedPlanUid);
    $: state = getPlanState(selectedPlanUid)

    async function startVoting() {
      console.log("starting vote")
      let uPlan = await enableVoting(selectedPlanUid);
      console.log("started")
      currentStep = 1;
    }

    async function createValidatorTasks() {
      let uPlan = await reassignElectors(selectedPlanUid)
    }
    
    function isVotingEnabled() {
      return state === VOTING;
    }

    function isVotingFinished() {
      return state === DONE
    }
    
    function isMinValidatorsReached() {
      // Todo implement
      return false;
    }

    function getCurrentStep(selectedPlanUid) {
      if (!selectedPlanUid)
        return 0;
      let state = plans.filter(p => p.uid == selectedPlanUid)[0].state;
      console.log("state", state);

      if (state === CLAIMED)
        return 0; // voting start
      if (currentStep === 1) {
        if (isMinValidatorsReached()) 
          return 2; // Voting 
        return 1;
      }
      if (isVotingFinished())
        return 3; 
    }

    function getPlanState(selectedPlanUid) {
      console.log("plans",plans)
      return selectedPlanUid ? plans.filter(p => p.uid === selectedPlanUid).state : NONE
    }
  
  </script>