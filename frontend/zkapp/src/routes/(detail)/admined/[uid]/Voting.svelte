  <Section class="section-lg mt-4">

    <Steps {steps} current={currentStep}/>
  </Section>
  <Section class="section-lg mt-4">
    <!-- {#if (isVotingEnabled())} -->
      <!-- {#if (votingStatus === "Active")} -->
        {#each judges as p}
        <MemberItem 
          p={p} 
          admin={adminUid}
          xadmins={xadmins}/>
      {/each}
      <!-- {/if} -->
    <!-- {/if} -->
   
  </Section>

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
    import { ALL_STATES } from "@models/states";
    import { updatePlan } from "@apis/mutations";
    import { Steps } from 'svelte-steps';
    import MemberItem from "./MemberItem.svelte";
    export let communityUid, state, startsUTC, endsUTC, votingStatus, judges, adminUid, xadmins, plans;

    let steps = [
        { text: 'Voting Start', icon: Icon, iconProps: {name: "envelope-paper  "} },
        { text: 'Confirm Judges', icon: Icon, iconProps: {name: "people"}},
        { text: 'Voting End', icon: Icon, iconProps: {name: "envelope-slash "} },
        { text: 'Votes Tallying', icon: Icon, iconProps: {name: "box-seam "} }
    ];
    let currentStep = 0;
    
    function isVotingEnabled() {
      const dateString = endsUTC;
      const date = new Date(dateString);
      // Get the current local browser time
      const localDate = new Date(); 
      console.log("dates", date, localDate)
      // Compare the two dates
      return localDate > date;
    }
  

  
  </script>