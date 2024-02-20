<div class="text-start fs-md p-0 m-0">

  {#if field.type === "text" || field.type === "note"}
    <Markdown 
      md={(field.value || "").replaceAll('\n', '  \n')} 
      {plugins} 
      />
  {/if}

  {#if field.type === "radio"}
    {field.value || ""}
  {/if}

  {#if field.type === "checks"}
    {#each (field.value || []) as check}
      <p class="lh-sm fs-md">
        <span>{check}</span>
      </p>
    {/each}
  {/if}

  {#if field.type === "links"}
    {#each (field.value || []) as link}
      <p class="lh-sm fs-md text-break word-wrap">
        <a href={link}>{link}
        </a>
      </p>
    {/each}
  {/if}

  {#if field.type === "files"}
    {#each (field.value || []) as link}
      <p class="lh-sm fs-md text-break word-wrap">
        <a 
          href={link} 
          target="_blank">
          {link}
        </a>
      </p>
    {/each}
  {/if}

  {#if field.type === "images"}
    {#each (field.value || []) as link, index}
      <p class="lh-base">
        <img 
          alt={"image-"+index} 
          src={link} crossorigin 
          class="img-fluid"
        />
      </p>
    {/each}
  {/if}
</div>

<script>
  import Markdown from 'svelte-exmarkdown';
  import { gfmPlugin } from 'svelte-exmarkdown/gfm';
  
  export let field = {}

  const plugins = [gfmPlugin()];
</script>