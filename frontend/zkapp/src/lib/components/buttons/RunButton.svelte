<!--
  This button makes a remote call and awaits till the call is ended.
  It changes its color, message and state while running
-->
{#if !running}
  <Button 
    type="button"
    on:click={callRun}
    disabled={running}
    color={color} 
    class="rounded-3 py-2 px-4">
    {label}
  </Button>
{:else}
  <Alert color="warning">
    <b>{@html alt}</b>
  </Alert>
{/if}

<script>
	import { tick } from "svelte";
  import { Button, Icon, Alert } from "sveltestrap";
  import { delay } from "@utilities/etc";

  export let 
    label = "", alt = "",
    color = "secondary", 
    run = async (ev) => {};

  let running = false;

  async function callRun(ev) {
    running = true;
    await tick();
    await delay(3000);
    let rs = await run(ev)
    await delay(1000);
    running = false;
    await tick();
  }
</script>
