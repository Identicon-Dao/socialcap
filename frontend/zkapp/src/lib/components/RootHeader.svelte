<script lang="ts">
  import { onMount } from "svelte";
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Icon,
  } from "sveltestrap";
  import { getCurrentUser } from "$lib/models/current-user";
  import { page } from "$app/stores";

  let user = null,
    isOpen = false,
    currentPage = $page.url.pathname;

  onMount(() => {
    user = getCurrentUser();
  });

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  function isActive(path) {
    if ($page.url.pathname === path)
      return "fw-bold text-warning --text-decoration-underline";
    return "";
  }
</script>

<Navbar
  color="white"
  light
  expand="md"
  class="fixed-top navbar-expand-lg top-0 z-index-3 w-100 navbar-transparent align-items-center"
>
  <NavbarBrand class="w-auto ms-4" href="/">
    <img
      width="80%"
      alt="Socialcap logo"
      src="/img/socialcap/socialcap-logo.svg"
    />
  </NavbarBrand>

  <NavbarToggler on:click={() => (isOpen = !isOpen)} />

  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav
      class="w-100 justify-content-start --ms-auto --text-center pr-5 mt-1 ms-3"
      navbar
    >
      <!-- <NavItem>
        <NavLink 
          class={isActive("/claims",$page.url.pathname)} 
          href="/credentials">
          Credentials
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink class={isActive("/communities",$page.url.pathname)} href="/communities">Communities</NavLink>
      </NavItem>

      {#if user && user.hasTasks}
        <NavItem>
          <NavLink href="/tasks">Tasks</NavLink>
        </NavItem>
      {/if}

      <NavItem>
        <NavLink href="/admins">Admin</NavLink>
      </NavItem> -->

      <!-- filler to center align correctly 
        <div style="width:12rem;">&nbsp;</div>
      -->
    </Nav>

    <Nav class="w-25 justify-content-end --ms-auto px-1" navbar>
      <NavItem class="me-4">
        <Dropdown nav inNavbar>
          <DropdownToggle
            nav
            caret
            class="d-flex align-items-center justify-content-end text-secondary"
          >
            <!-- <span class="d-inline-block fs-xs me-3 text-wrap lh-1 text-end" style="max-width:6rem;">{user.fullName}</span> -->
            <Icon name="person-circle" class="fs-2" />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem><a href="/profile">Profile</a></DropdownItem>
            <!-- <DropdownItem>Preferences</DropdownItem> -->
            <DropdownItem divider />
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>
