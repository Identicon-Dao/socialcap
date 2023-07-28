<div>
  <div class="row">
    <div class="col-6">
      <StdFormField 
        label="Id" 
        type="text" 
        invalid={!field.sid.trim()} 
        feedback="We need an ID for this field"
        bind:value={field.sid} 
        />
    </div>
    <div class="col-6">
      <StdFormField 
        label="Type" 
        type="select" 
        options={[
          { value: "text", text: "Simple text input"},
          { value: "file", text: "File selector"},
          { value: "note", text: "Text note input"},
          { value: "remark", text: "Readonly remarks"},
        ]}
        bind:value={field.type} 
        />
    </div>
  </div>

  <StdFormField 
    label="Label" 
    type="text" 
    invalid={!field.label.trim()} 
    feedback="We need a Label for this field"
    bind:value={field.label} 
    />

  <StdFormField 
    label="Description or content" 
    type="textarea" 
    invalid={!field.description.trim()} 
    feedback="We need a description for this field"
    bind:value={field.description} 
    />

  {#if field.type !== "remark"}
  <div class="row text-start">
    <div class="col-6">
      <StdFormField 
        label="Required" 
        type="select" 
        options={[{value:true,text:"Yes"}, {value:false,text:"No"}]} 
        bind:value={field.required} 
        />
    </div>
    <div class="col-6">
      {#if field.type === "text" || field.type === "note"}
        <StdFormField 
          label="Max text size" 
          type="number" 
          invalid={!field.extras.max < 0} 
          feedback="Which is the max allowed text size"
          bind:value={field.extras.max} 
          />
      {/if}
      {#if field.type === "file"}
        <StdFormField 
          label="Allowed file types" 
          type="text" 
          feedback="Allowed file types as a set of comma separated values, ex: 'svg,png,gif'"
          bind:value={field.extras.allowed} 
          />
      {/if}
    </div>
  </div>
  {/if}
</div>

<script>
  import { } from "sveltestrap";
  import StdFormField from "./StdFormField.svelte";

  export { className as class };
  let className;

  export let field = {
    sid: '',
    required: false, // a required field
    label: "",
    description: "",
    type: "", // text | note | file | remark // field type
    extras: { 
      max: 0, //max number of chars in this field 
      allowed: null // allowed File types
    }
  };

</script>