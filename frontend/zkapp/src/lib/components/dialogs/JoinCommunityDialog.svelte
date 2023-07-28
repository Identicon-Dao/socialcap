
<Modal body scrollable
  header={all?.length ? "Select the community" : "Congrats !"}
  isOpen={open} 
  toggle={toggle}>
  {#if all && all.length === 0}
    <p class="">
      You have already joined all existent communities
    </p>
  {/if}  
  {#each all as joinable}
    <div class="mb-4 px-4">
      <CanJoinNow data={joinable} />
    </div>
  {/each}
</Modal>

<script>
  import { Modal } from "sveltestrap";
  import CanJoinNow from "@components/cards/CanJoinNow.svelte";

  export let open = false, all = [];

  const toggle = () => (open = !open);
</script>