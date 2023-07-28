<Navbar color="white" light expand="md"   class="fixed-top navbar-expand-lg top-0 z-index-3 w-100 border-bottom border-1 py-2 align-items-center"
>

  <NavbarBrand class="w-auto ms-4" href="/">
    <img alt="Socialcap logo" src="/img/socialcap/socialcap-icon.svg" />
  </NavbarBrand>
  
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />

  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="w-100 justify-content-start --ms-auto --text-center pr-5 mt-1 ms-3" navbar>      

      <NavItem>
        <Breadcrumb class="fs-sm mt-3">
          {#each items as item, j}
            {#if j<items.length-1}
              <BreadcrumbItem>
                <a href={item.href} class="p-4 link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">{item.text}</a>
              </BreadcrumbItem>
            {:else}
              <BreadcrumbItem active class="fs-2 text-black">
                <b>{item.text}</b>
              </BreadcrumbItem>
            {/if}
          {/each}
        </Breadcrumb>
      </NavItem>
    </Nav>

    <Nav class="w-25 justify-content-end --ms-auto px-1" navbar>
      <NavItem class="me-4 mt-2">
        <!-- <Status /> -->
      </NavItem>

      <NavItem class="me-4">
        <CloseButton size="fs-1"/>
      </NavItem>
    </Nav>

  </Collapse>
</Navbar>

<script>
  import { onMount } from "svelte";
  import { Breadcrumb, BreadcrumbItem } from "sveltestrap";
  import { Navbar, NavbarBrand, Nav, NavItem, Collapse, NavbarToggler } from 'sveltestrap';
  import { getCurrentUser } from "$lib/models/current-user";
  import CloseButton from "./CloseButton.svelte";
  import Status from "./Status.svelte";
  
  export let items = []; // [{ href, text }]
  // the last item will allways be the active item

  let user = null;
  let isOpen = false;
  
  onMount(async () => {
    user = await getCurrentUser();
  })

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }
</script>
