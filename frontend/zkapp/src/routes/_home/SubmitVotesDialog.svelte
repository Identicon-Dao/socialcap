<div>
  <Modal isOpen={open} {toggle} backdrop="static">
    <ModalHeader >
      Sign and submit your votes
    </ModalHeader>

    {#if (tasks || []).length === 0}
      <ModalBody>
          <div class="p-3 fs-nm d-flex align-items-center">
            <p class="fs-lg">
              <b>There are no votes to send </b>
            </p>
          </div>
      </ModalBody>
    {/if}

    {#if (tasks || []).length > 0}
      <ModalBody>
        {#if status === READY}
          {#if !$auroWallet$?.connected}
            <p class="p-1">Connecting the wallet ...</p>
          {/if}

          {#if $auroWallet$?.connected && $auroWallet$?.publicKey}
            <div class="p-3 lh-lg fs-nm">
              <p>
                AuroWallet is connected !
                <br/>
                Account &nbsp;
                <b class="bg-secondary-subtle border py-1 px-2 rounded-2">{$auroWallet$?.publicKey.slice(0,6)}...{$auroWallet$?.publicKey.slice(-6)}</b>
              </p>
              <p class="fs-lg">
                Are you ready to send your votes ?
              </p>
            </div>
          {/if}
        {/if}

        {#if status === SENDING}
          <div class="p-3 fs-nm d-flex align-items-center">
            <p class="fs-1">
              <Spinner color="black" type="border" class="m-3" />
            </p>
            <p class="fs-lg">
              Sending the votes ...
            </p>
          </div>
        {/if}

        {#if status === FAILED}
          <div class="p-3 fs-md d-flex align-items-center">
            <p class="fs-1">
              <Icon name="exclamation-diamond-fill" class="text-danger me-4"/>
            </p>
            <p class="fs-lg">
              We could not submmit the votes. Please retry again latter 
            </p>
          </div>
        {/if}

        {#if status === SENT}
          <div class="p-3 fs-md d-flex align-items-center">
            <p class="fs-1">
              <Icon name="check-circle" class="text-success me-4"/>
            </p>
            <p>
              <b>Sent all votes ! </b>
            <p>
          </div>
        {/if}
      </ModalBody>
    {/if}

    <ModalFooter class="text-center">
      {#if status === READY && (tasks || []).length > 0}
        <Button color="primary" on:click={sendThemNow}>Send them now !</Button>
      {/if}
      {#if status !== SENT}
        <Button color="secondary" on:click={cancelVoting}>Cancel</Button>
      {/if}
      {#if status === SENT}
        <Button color="primary" on:click={doneVoting}>Done !</Button>
      {/if}
    </ModalFooter>
  </Modal>
</div>

<div>
  <Modal isOpen={openNoWalletDlg} toggle={toggleNoWalletDlg}>
    <ModalHeader toggle={toggleNoWalletDlg}>
      Auro wallet is not installed
    </ModalHeader>
    <ModalBody>
      Please install the Auro wallet for signing your votes.
    </ModalBody>
    <ModalFooter class="text-center">
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>


<script>
  import { onMount, tick, createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { Button, Icon, Spinner } from 'sveltestrap';
  import { Modal, ModalBody,ModalFooter,ModalHeader } from 'sveltestrap';
  import { getCurrentUser } from "$lib/models/current-user";
  import { auroWallet$ } from "$lib/contracts/stores";
  import { buidNullifier } from "./batch-votes-nullifier";
  import { submitTasksBatch } from "@apis/mutations";

  export let 
    open, // this opens/closes teh Modal Dialog
    tasks; // this is the data for the Tasks to submit

  let user ;
  let statusMessage = "", status = 0;
  let pendingTxn;
  let dispatch = createEventDispatcher();

  const READY = 0, SENDING = 2, FAILED = 5, SENT = 3;

  // let open = false;
  const toggle = () => (open = !open);
  
  let openNoWalletDlg = false;
  const toggleNoWalletDlg = () => (openNoWalletDlg = !openNoWalletDlg);

  const signableContent = (tasks, root) => JSON.stringify({
    votes: tasks, 
    root: root
  });

  onMount(async () => {
    user = await getCurrentUser();
    // voterAccountId = user.profile.accountId;
    // console.log("MOUNTED SubmitVotesDlg")
    // await ready for payment
    // canPayNow = await isReadyForPayment();
  })

  async function sendThemNow() {
    statusMessage = "Starting signing ..."; await tick();
    status = READY;

    let wallet = get(auroWallet$);

    let nullifier = buidNullifier(
      get(auroWallet$).publicKey,
      tasks
    )

    let signedPack = await wallet.api.signMessage({ 
      message: signableContent(tasks, nullifier.root())
    });
    console.log("signedPack", 
      signedPack.publicKey, 
      signedPack.signature.field, 
      signedPack.signature.scalar);
    
    // we can now submit the Votes and continue the voting process
    status = SENDING; // sending ...
    await tick();

    let result = await submitTasksBatch({
      senderAccountId: signedPack.publicKey,
      signedPack: signedPack
    });

    if (result.error) {
      status = FAILED;
      await tick();
      return;
    }

    status = SENT; // sent ;
    await tick();
  }
  
  function cancelVoting() {
    toggle(); // close dialog
    status = READY; // get ready for next ...
  }

  function doneVoting() {
    toggle(); // close dialog
    status = READY; // get ready for next ...
    dispatch('submited_batch'); // notify the TasksList
    //setTimeout(() => window.location.reload());
  }
</script>




