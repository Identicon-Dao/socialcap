<div>
  {#each evidence as field, index}
    {#if index === selected}
      <div class="border border-3 border-warning rounded-2 mb-2 p-4">
        <div class="text-end">
          <Button color="light" on:click={() => {selected = null;}}> 
            <Icon name="x" />
          </Button>
        </div>
        <MasterPlanEvidenceField bind:field={evidence[index]} />
        <div class="d-flex justify-content-between">
          <Button outline color="secondary" on:click={() => {removeField(index);}}> 
            <Icon name="trash-fill" /> &nbsp; Remove it 
          </Button>
          <Button outline color="secondary" on:click={() => {selected = null;}}> 
            <Icon name="check-lg" />
          </Button>
        </div>
      </div>
    {:else}
      <div 
        class="border border-secondary rounded-2 mx-2 mb-2 px-3 d-flex justify-content-between align-items-center">
        <div class="lh-lg px-2 pt-3 text-start">
          <b>{field.label}</b> ({field.sid}: {field.type})
          <p class="fs-sm lh-base text-secondary">{@html field.description}</p>
        </div>
        <div class="fs-4">
          <Button color="light" on:click={() => {selected = index;}}> 
            <Icon name="chevron-expand" />
          </Button>
        </div>
      </div>
    {/if}
  {/each}

  <div class="ps-2">
    <Button 
      on:click={addField}
      outline size="md" class="px-3 py-2" color="secondary">
      <b>+</b> Add an evidence field
    </Button>
  </div>
</div>

<script>
  import { Button, Icon } from "sveltestrap"
  import MasterPlanEvidenceField from "@components/MasterPlanEvidenceField.svelte";

  export let evidence = [];

  let selected = null;

  const EmptyField = {
    sid: '',
    required: false, // a required field
    label: "",
    description: "",
    type: "text", // text | note | file | remark // field type
    extras: { 
      max: 0, //max number of chars in this field 
      allowed: null // allowed File types
    }
  };

  function addField() {
    evidence = []
      .concat(evidence)
      .concat([JSON.parse(JSON.stringify(EmptyField))]);
  }

  function removeField(index) {
    evidence.splice(index, 1)
    evidence = []
      .concat(evidence);
  }

</script>
