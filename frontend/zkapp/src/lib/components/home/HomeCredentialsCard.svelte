{#if !claimables}
  <span>Loading...</span>
{:else}
<Card class="border-1 border-gray rounded-4 text-white bg-primary p-3">
  <div class="position-absolute mb-4 me-2 bottom-0 end-0">
    <img class="svg" alt="" width="80%" src={"/img/svg/ClaimCard.svg"} />
  </div>
  <div class="p-3 position-relative">
    <CardBody
      class="d-flex flex-column align-items-start justify-items-between gap-4"
    >
      <div>
        <h1 class="fs-1">Claim</h1>
        <p class="fs-4 color-white">
          <Badge class="bg-black me-2">
            <b class="fs-4">{claimables.length}</b>
          </Badge>available credentials
        </p>
      </div>
      <!-- <a href="/credentials/canclaim" class="text-decoration-none"> -->
      <Button
        size="md"
        class="px-3 py-2 rounded-3 bg-black text-white border-0"
        on:click={() => (open = true)}
      >
        Claim it now
      </Button>
      <!-- </a> -->
    </CardBody>
  </div>
</Card>

<ClaimCredentialDialog bind:open claimables={claimables} />
{/if}

<script>
  import { Card, CardBody, Button, Badge } from "sveltestrap";
  import ClaimCredentialDialog from "@components/dialogs/ClaimCredentialDialog.svelte";
  import { onMount } from "svelte";
  import { getMyClaimables } from "@apis/queries";
  export let data;
  const user = data.user;
  let open = false;
  let claimables = null;

  onMount(async () => {
    claimables = await getMyClaimables({user});
  })
</script>