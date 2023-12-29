<FormGroup class="mt-4">

  {#if field.label}
    <Label for="exampleText" class="fw-bold fs-nm text-secondary ps-1 mb-1 d-flex justify-content-between">
      <span>
        {field.label}
        <span class="fs-md text-danger">
          {field.required ? "*" : ""}
        </span>
      </span>

      {#if field.type === "note"}
        <span class="fs-nm text-danger me-4">
          <a 
            on:click={() => previewOn = !previewOn}        
            class="text-decoration-none" 
            href={'#'}>
            {!previewOn ? 'Preview' : 'Edit' }
          </a>
        </span>
      {/if}  
    </Label>
  {/if}

  {#if field.type === "text"}
    <Input 
      type="text" 
      id={field.sid} 
      name={field.sid} 
      bind:value={data[index].value}
      class="rounded-1 py-2 px-2 mb-1 fs-md"
      invalid={!isValid(field, data[index].value)}
      feedback={hasMessage(field, data[index].value)}
    />
  {/if}

  {#if field.type === "note" && !previewOn}
    <Input 
      type="textarea" 
      id={field.sid} 
      name={field.sid} 
      bind:value={data[index].value}
      class="rounded-1 px-2 py-2 mb-1 fs-md"
      rows={initialTextareaSize(data[index].value)}
      bind:inner={field.inner} 
      on:input={() => resizeTextarea(field.inner)}
      invalid={!isValid(field, data[index].value)}
      feedback={hasMessage(field, data[index].value)}
      />
  {/if}

  {#if field.type === "note" && previewOn}
    <div class="fs-md p-2 border border-dark rounded-1">
      <Markdown md={data[index].value} {plugins} />              
    </div>
  {/if}

  {#if field.type === "radio"}
    <FormGroup class="ms-4">
      {#each field.extras.options.split(',') as option, i}
        <Input
          id={`rd-${option}-${i}`}
          type="radio"
          value={option}
          label={option}
          bind:group={data[index].value}
          class="px-2 py-1 mt-1"
        />
      {/each}  
    </FormGroup> 
    {#if (!isValid(field, data[index].value))}
      <span class="text-danger mt-0 p-0 fs-sm">
        {hasMessage(field, data[index].value)}
      </span><br>
    {/if}
  {/if}

  {#if field.type === "checks"}
    <FormGroup class="ms-4">
      <MultiChecksField 
        field={field}
        bind:value={data[index].value}
        class="px-2 py-1 mt-1"
      />
    </FormGroup> 
    {#if (!isValid(field, data[index].value))}
      <span class="text-danger mt-0 p-0 fs-sm">
        {hasMessage(field, data[index].value)}
      </span><br>
    {/if}
  {/if}

  {#if field.type === "links"}
     <Tags 
      addKeys={[13,9]}
      id={field.sid} 
      name={field.sid} 
      allowPaste={true}
      bind:tags={data[index].value}
      class="rounded-1 px-2 py-1 mb-1  text-break word-wrap"
    />
    {#if (!isValid(field, data[index].value))}
      <span class="text-danger mt-0 p-0 fs-sm">
        {hasMessage(field, data[index].value)}
      </span><br>
    {/if}
  {/if}

  {#if field.type === "files"}
    <Tags 
      addKeys={[13,9]}
      id={field.sid} 
      name={field.sid} 
      allowPaste={true}
      bind:tags={data[index].value}
      class="rounded-1 px-2 py-1 mb-1"
    />
    {#if (!isValid(field, data[index].value))}
      <span class="text-danger mt-0 p-0 fs-sm">
        {hasMessage(field, data[index].value)}
      </span><br>
    {/if}
  {/if}

  {#if field.type === "images"}
    <Tags 
      addKeys={[13,9]}
      id={field.sid} 
      name={field.sid} 
      allowPaste={true}
      bind:tags={data[index].value}
      class="rounded-1 px-2 mb-1"
    />
    {#if (!isValid(field, data[index].value))}
      <span class="text-danger mt-0 p-0 fs-sm">
        {hasMessage(field, data[index].value)}
      </span><br>
    {/if}
  {/if}
  
  {#if field.description && field.type !== 'remark'}
    <FormText color="muted ps-1 fs-sm">
      {@html field.description}              
    </FormText>
  {/if}

  {#if field.type === 'remark'}
    <p color="ps-1 fs-nm mt-0 p-0 ln-base">
      <Markdown md={field.description} {plugins} />              
    </p>
  {/if}

</FormGroup>

<script>
  import { onMount } from "svelte";
  import { FormGroup, FormText, Label, Input } from 'sveltestrap';
  import MultiChecksField from "./MultiChecksField.svelte";
  import Tags from "svelte-tags-input";
  import Markdown from 'svelte-exmarkdown';
  import { gfmPlugin } from 'svelte-exmarkdown/gfm';
  import { isValid, hasMessage } from './validations';
	
  export let 
    field, 
    index, 
    data;

  const plugins = [gfmPlugin()];  
  let previewOn = false;   
  
  onMount(() => {
    // nothing yet ...
  })

  /** Resize textareas **/

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
</script>