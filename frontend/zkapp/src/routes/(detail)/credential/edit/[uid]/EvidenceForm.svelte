<div class="text-break word-wrap">
  <!-- <p class="py-2 hl-base">
    Please provide below the required evidence to sustain your claim. This 
    evidence will be deleted as soon as the claim has been approved, so no 
    personal or private data will be stored and kept.
  </p> -->
  <!-- <Form> -->
    <!-- <FormGroup class="mt-3">
      <Label for="alias" class="fw-bold fs-6 text-secondary ps-1 mb-1">Name or alias</Label>
      <Input 
        bind:value={data.claim.alias} 
        type="input" name="alias" id="alias" 
        class="rounded-1 p-2 mb-1"/>
      <FormText color="muted ps-1">
        Name or alias you would like to show in the final credential. 
        &nbsp;{@html required(true)}
      </FormText>
    </FormGroup> -->

    {#each evidenceForm as field, index}
      <EvidenceField 
        field={field} 
        index={index} 
        bind:data={data} />
    {/each}
</div>        

<script>
  import EvidenceField from "./EvidenceField.svelte";
  import { onMount } from "svelte";
  import { FormGroup, FormText, Label, Input } from 'sveltestrap';
  import MultiChecksField from "./MultiChecksField.svelte";
  import Tags from "svelte-tags-input";
  import Markdown from 'svelte-exmarkdown';
  import { gfmPlugin } from 'svelte-exmarkdown/gfm';
  import { isValid, hasMessage } from './validations';
	
  export let 
    evidenceForm,
    data; // this is the data for this MasterPlan and empty Claim


    /** 
  const plugins = [gfmPlugin()];     
  
  onMount(() => {
    // nothing yet ...
  })

   * Resize textareas 
   
   function initialTextareaSize(value) {
     let lines = (value || "").split("\n");
     // console.log("initialTextareaSize", lines, lines.length);
     return (lines.length || 1) ; 
    }
    
    function resizeTextarea(inner) {
      inner.style.height = 'auto';
      inner.style.height = 4 + inner.scrollHeight + 'px';
      // console.log("resizeTextarea height=", inner, inner.style.height);
    };
    **/
</script>