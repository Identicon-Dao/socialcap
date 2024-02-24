<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: 'Register your community'}
  ]} />

<DetailPageContent>
  <Section class="section-sm pb-5 bg-white p-4 border-sc rounded-2 w-50">
        <!-- <Alert color="nolight mb-4"> -->
      <div class="mt-4  py-4">
        <!-- <h4 class="alert-heading text-capitalize">
            Caution
          </h4> -->
        <p class="fs-1 lh-1 fw-bold">I am one of the administrator of the following community</p>
        <p class="fs-sm lh-lg mt-2 fs-2">
          We <a href="#todo" class="text-danger">will check this before approving</a>
          the community registration.
        </p>
      </div>
      <!-- </Alert>   -->

     

      <Form>
        <FormGroup class="mt-4">
          <Label class="fs-5 text-secondary ps-1 mb-1 w-100 d-flex">Community name</Label>
          <Input bind:value={data.name} invalid={!data.name.trim()} type="text" class="form-control" placeholder=""
            feedback="Provide a name for this community." />
        </FormGroup>

        <FormGroup class="mt-2">
          <Input bind:value={data.description} type="textarea" class="form-control" id="exampleFormControlTextarea1"
            rows="3" placeholder="Describe its goals, membership rules, etc here ..." invalid={!data.description.trim()}
            feedback="Provide a description for this community." />
        </FormGroup>

        <FormGroup class="mt-5">
          <Input bind:checked={data.accepted} class="checkbox gap-2 d-flex" type="checkbox" id="check-grp-2"
            label="I agree with the Terms and Conditions" />
          {#if !data.accepted}
            <p class="py-1 ">
              <!--Before submiting this, please note that in order to avoid spurious registrations we will latter require you to <b>deposit two (2) MINA tokens</b> to complete the registration. 
                Please note that to complete the registration you will need to <b>deposit two (2) MINAs</b>.
              -->
            </p>

              <p>Please accept the <a href="/terms-and-conditions">Terms and 
                Conditions</a> for registering communities.</p>
          {/if}
        </FormGroup>

        
          <div class="button-group d-flex align-content-center justify-content-center">
            {#if dataIsOk(data)}
            <Button color="primary" size="md"
            class="px-3 py-2 rounded-3 bg-primary text-white border-0"
            on:click={registerIt}
            disabled={!dataIsOk(data) || registering}>
            Register
          </Button>
          &nbsp;
          {:else}
          <Alert color="warning" >
        
          <p class="mb-0">Please complete the required information below.</p>
        </Alert>
          {/if}
        </div>
      

      </Form>
  </Section>
</DetailPageContent>

<script>
  import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
    Alert
  } from 'sveltestrap';
  import { onMount } from "svelte";
  import EmptyFirstTime from "$lib/components/cards/EmptyFirstTime.svelte";
  import EmptyCredentials from "$lib/components/cards/EmptyCredentials.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import Section from '@components/Section.svelte';
  import DetailPageContent from '@components/DetailPageContent.svelte';
  import DetailPageHeader from '@components/DetailPageHeader.svelte';
  import { AppStatus } from '@utilities/app-status';
  import { updateCommunity } from '@apis/mutations';
	
  let user = null;
  let registering = false;
  let data = {
    name: "",
    description: "",
    accepted: false
  }

  onMount(async () => {
    user = await getCurrentUser();
  })

	function cancelIt() { history.back() };

  function dataIsOk(data) {
    return (data.name.trim() && data.description.trim() && data.accepted);
  }

  async function registerIt() {
    if (!dataIsOk(data)) {
      AppStatus.error("All fields are required !")
      return;
    }
    data.new = true; // indicate it is a new community !
    data.adminUid = user.uid;
    data.state = "INITIAL";
    registering = true;
    const updated = await updateCommunity(data);
    if (updated) 
    {
      registering = false;
      history.back();
    }
  }
</script>