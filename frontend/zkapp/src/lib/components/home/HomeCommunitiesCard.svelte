{#if !myCommunities || !joinables}
  <span>Loading...</span>
{:else}
<Card class="border-1 border-gray rounded-4 text-black bg-white p-3">
  <div class="position-absolute mb-4 me-2 bottom-0 end-0 opacity-85">
    <img class="svg" alt="" width="90%" src={'/img/svg/JoinCard.svg'} />
  </div>
  <div class="p-3 position-relative">
    <CardBody  class="d-flex flex-column align-items-start justify-items-between gap-4"
    >
      <div>
      <h1 class="fs-1">Join</h1>
      <p class="fs-4 color-white">
      <Badge class="bg-black me-2">
        <b class='fs-4'>{joinables.length}</b>
      </Badge>
      awesome communities
      </p>
    </div>
    <Button
    size="md"
    class="px-3 py-2 rounded-3 bg-primary text-white border-0"
    on:click={() => (open = true)}
  >
    Join a community
  </Button>
    </CardBody>
  </div>
</Card>

<JoinCommunityDialog 
  bind:open={open}
  joined={myCommunities} 
  all={joinables} />
{/if}
<script>
  import { Card, CardBody, Button, Badge } from "sveltestrap";
  import JoinCommunityDialog from "@components/dialogs/JoinCommunityDialog.svelte";
  import { getAllCommunities, getMyCommunities } from "@apis/queries";
  import { onMount } from "svelte";
  export let data;
  const user = data.user;

  
  let open = false;
  let myCommunities = null;
  let joinables = null;

  onMount(async () => {
    myCommunities = await getMyCommunities({user});
    joinables = await getAllCommunities({user, notJoined: true});
  })

</script>
