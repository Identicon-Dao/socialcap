<Card class="border-1 border-gray rounded-4 text-black bg-white">
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
        <b class='fs-4'>{allCount}</b>
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
  joined={data.joined} 
  all={data.joinables} />

<script>
  import { Card, CardBody, Button, Badge } from "sveltestrap";
  import JoinCommunityDialog from "@components/dialogs/JoinCommunityDialog.svelte";

  export let data;

  let open = false;

  const 
    joinablesCount = data.joinables.length,
    allCount = data.allCommunities.length;

</script>
