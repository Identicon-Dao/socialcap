<!--
  This button makes a remote call and awaits till the call is ended.
  It changes its color, message and state while running
-->
{#if !runningBtn}
  {#each buttons as btn}
    <Button 
      type="button"
      on:click={(ev) => callRun(ev, btn)}
      disabled={runningBtn}
      color={color} 
      class="rounded-3 py-2 px-4 me-4">
      {btn.label}
    </Button>
  {/each}
{:else}
  <Alert color="warning">
    <b>{@html runningBtn?.alt || "..."}</b>
  </Alert>
{/if}

<script>
	import { tick } from "svelte";
  import { Button, Icon, Alert } from "sveltestrap";
  import { delay } from "@utilities/etc";

  export let 
    color = "secondary", 
    buttons = [];

  let runningBtn = null;

  async function callRun(ev, btn) {
    runningBtn = btn;
    await tick();
    await delay(3000);
    let rs = await btn.run(ev)
    await delay(1000);
    runningBtn = null;
    await tick();
  }
</script>
