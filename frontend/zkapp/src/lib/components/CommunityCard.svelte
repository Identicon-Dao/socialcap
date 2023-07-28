<div class="w-100 px-4">
  <Card class="border-0 border-bottom">
    <CardBody class="ps-4">
      <div class="d-flex justify-content-start align-items-center pt-0">
        <img src={data.image} width="92px" crossorigin alt="Credential logo" />
        <div class="ms-4 mt-0">
          <a href={`/community/${uid}`} class="text-decoration-none text-dark">
            <h5>{data.name}
              <span class="fs-6 ms-1">
                <Badge color={stateColors[data.state]}>{data.state}</Badge>
              </span>
            </h5>
            <p class="fs-sm lh-base mt-1 text-left mb-0 text-secondary">
              {@html data.description}
              <br><b>{data.countMembers}</b> members
              | <span class="fs-5"> 🎉 </span>
              &nbsp; <b>{data.countCredentials}</b> credentials issued !
            </p>
          </a>    
          <p class="mt-2">
            {#if !joined}
              <p>
                <Button 
                  on:click={toggleJoin}
                  color="primary" size="sm" class="rounded-5 px-3 py-1">
                  Join it !
                </Button>
              </p>
            {/if}
            {#if joined}
              <p>
                <Button 
                  on:click={toggleBecome}
                  outline color="primary" size="sm" class="rounded-5 px-3 py-1">
                  Become a validator
                </Button>
                &nbsp;
                {#if user.uid === data.adminUid}
                <a href={`/admined/${data.uid}`} class="text-dark text-decoration-none">
                  <Button outline color="dark" size="sm" class="rounded-5 px-3 py-1">
                    Admin it ...
                  </Button>
                </a>
                {/if}
              </p>
            {/if}
          </p>
        </div>  
      </CardBody>
  </Card>
</div>

<Modal body 
  header="Join" 
  isOpen={openJoinDlg} toggle={toggleJoin}>
  Join this community
</Modal>

<Modal body 
  header="Become a validator"   
  isOpen={openBecomeDlg} toggle={toggleBecome}>
  Become a validator
</Modal>

<script>
    import { Badge, Modal, Button, Card, CardBody, CardHeader } from "sveltestrap";
    import FullviewButton from "./FullviewButton.svelte";

    export let uid = 0, data, joined = false, user;

    let openJoinDlg = false;
    const toggleJoin = () => (openJoinDlg = !openJoinDlg);

    let openBecomeDlg = false;
    const toggleBecome = () => (openBecomeDlg = !openBecomeDlg);

    const stateColors = {
      'DRAFT': 'warning',
      'APPROVED': 'success',
      'PAUSED': 'secondary',
      'REJECTED': 'danger'
    } 
</script>
