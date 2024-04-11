<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: `Your profile`}
]}/>

<DetailPageContent>
  <!-- <Sidenote>
    <hr/>
    <p>::: USER CAN CLAIM A CREDENTIAL OF SOME COMMUNITY WHERE HE/SHE IS A MEMBER :::</p>
    <p>This is a form where he will claim a new credential, and this form is controlled by the MasterPlan.</p>
    <p>We only arrive here if the user already is a member of at least one community.</p>
  </Sidenote> -->

  <div class="w-75 m-auto">

    
    <Section class="section-sm border-sc rounded-4 border bg-white border-gray">
      <div class="d-flex align-items-center justify-content-between">
        <div class="w-25 me-4 pe-2 position-relative">
          <Button color="" class="p-0 m-0 rounded-2" >
            <img src={data.image} class="img-thumbnail  border-0 rounded-4" alt="Profile" height="120px" crossorigin/>
          </Button>
        </div>
        
        <div class="w-100">
          <div class="d-flex">
            
            <h3 class="text-black d-flex justify-content-between align-items-center">
              {data.fullName}
              <span class="fs-6 mx-4">
                <Badge color="success">{data.state}</Badge>
              </span>
            </h3>
          </div>
          
          <p class="fs-sm text-secondary lh-lg text-start">
            {@html data.description}
          </p>
          
          <div class="d-flex justify-content-start align-content-start">
            <p class="text-start">
              <span class="fs-xs">Joined</span>
              <br/><b class="fs-sm">{data.createdUTC}</b>
            </p>
            <p class="px-4 text-start">
              <span class="fs-xs">Approved</span>
              <br/><b class="fs-sm">{data.approvedUTC}</b>
            </p>
            <p class="px-4 text-start">
              <span class="fs-xs ">Updated</span>
              <br/><b class="fs-sm">{data.updatedUTC}</b>
            </p>
          </div>
        </div>
      </div>
    </Section>
    
    <Section class="section-sm w-75 bg-white p-4 border-sc mt-4">
      <h1>Edit your profile</h1>

      <Form class='d-flex flex-column gap-2'>
        <FormGroup class="mt-3">
          <Label for="alias" class="fs-4 text-secondary d-flex ps-1 mb-1">Full name or alias</Label>
          <Input 
          bind:value={data.fullName} 
          type="input" name="alias" id="alias" 
          class="rounded-1 p-3 mb-1"/>
          <FormText color="muted ps-1 d-flex">
            Name or alias you would like to show in your profile. 
            &nbsp;{@html required(true)}
          </FormText>
        </FormGroup>
        
        <FormGroup class="mt-3">
          <Label for="email" class=" d-flex fs-4 text-secondary ps-1 mb-1">Your email</Label>
          <Input 
          bind:value={data.email} 
          type="input" name="email" id="email" 
          class="rounded-1 p-3 mb-1"/>
          <FormText color="muted ps-1 d-flex">
            We need it to contact you. We will never share it with others. &nbsp;{@html required(true)} 
          </FormText>
        </FormGroup>
        
        <FormGroup class="mt-3">
          <Label for="description" class="d-flex fs-4 text-secondary ps-1 mb-1">Briefing</Label>
          <Input 
          bind:value={data.description} 
          type="input" name="description" id="description" 
          class="rounded-1 p-3 mb-1"/>
        <FormText color="muted ps-1 d-flex">
          A brief description about you that may be of interest to others.
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="image" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your photo or avatar</Label>
        <Input 
          bind:value={data.image} 
          type="input" name="image" id="image" 
          invalid={data.image?.trim().length > 127} 
          feedback="Image url too long (max is 128 chars)."
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
        </FormText>
      </FormGroup>

        <FormGroup class="mt-3">
          <Label for="accountId" class="d-flex fs-4 text-secondary ps-1 mb-1">Your MINA account</Label>
          <Input 
          bind:value={data.accountId} 
          type="input" name="accountId" id="accountId" 
          class="rounded-1 p-3 mb-1"/>
          <FormText color="muted ps-1 d-flex text-start">
            This is the MINA account you will use to pay for some services and sign transactions. We will never share it with others. Is optional. 
          </FormText>
        </FormGroup>
        
        <FormGroup class="mt-3">
          <Label for="telegram" class="d-flex fs-4 text-secondary ps-1 mb-1">Your Telegram</Label>
          <Input 
          bind:value={data.telegram} 
          type="input" name="telegram" id="telegram" 
          class="rounded-1 p-3 mb-1"/>
          <FormText color="muted ps-1 d-flex">
            We may use it to contact you. We will never share it with others. Is optional. 
          </FormText>
        </FormGroup>
        
        <FormGroup class="mt-3">
          <Label for="phone" class="d-flex fs-4 text-secondary ps-1 mb-1">Your phone</Label>
          <Input 
          bind:value={data.phone} 
          type="input" name="phone" id="phone" 
          class="rounded-1 p-3 mb-1"/>
          <FormText color="muted ps-1 d-flex">
            If available we may use it to secure your account. We will never share it with others. Is optional. 
          </FormText>
        </FormGroup>

        <div class="py-4 text-start">
          <Label for="token" class="d-flex fs-4 text-bold ps-1 mb-1">
            <a on:click={() => hiddenToken = !hiddenToken}        
              class="me-2 text-decoration-none" 
              href={'#'}>
              {hiddenToken ? '> Show API token' : '< Hide API token' }
            </a>
          </Label>
          {#if !hiddenToken}
            <p class="text-break border rounded-1 p-2">
              {getAPIConfig().authorization.replace('Bearer ','')}
            </p>
          {/if}
        </div>

        <Button
          size="md"
          class="px-3 py-4 rounded-3 bg-primary text-white border-0"
          on:click={() => saveProfile()}
          >
           {#if loading }
             Saving...
          {:else}
              Save changes
          {/if}
        </Button>
      </Form>
    </Section>        
      
    <!-- <Filler n=40/> -->
  </div>
</DetailPageContent>
    
<script>
  import { onMount } from "svelte";
  import { Breadcrumb, BreadcrumbItem, Icon, Badge, Form, FormGroup, FormText, Label, Input, Button } from 'sveltestrap';
  import Filler from "$lib/components/Filler.svelte";
  import Sidenote from "@components/Sidenote.svelte";
  import Section from "@components/Section.svelte";
  import BackButton from "@components/BackButton.svelte";
  import SubmitButton from "@components/SubmitButton.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { updateProfile } from "@apis/mutations";
  import { getAPIConfig } from "$lib/globals";
	import { validateUserToken } from "@utilities/auth";

  export let data; // this is the data for this MasterPlan and empty Claim

  let 
    user = getCurrentUser(), 
    firstTime = false,
    hiddenToken = true;

  onMount(() => {
    user = getCurrentUser();
    firstTime = false; //isFirstTimeUser(user); 
  })

  const required = (t) => 
    `<span class="text-warning fw-bold">${t ? `Required` : ``}</span>.`;

  let loading = false;
  async function saveProfile() {
    loading = true;
    let updated = await updateProfile(data);
    loading = false;
    if (updated)
      history.back();
  }
</script>