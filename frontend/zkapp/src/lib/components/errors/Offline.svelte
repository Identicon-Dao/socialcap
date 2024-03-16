<script>
	import { page } from '$app/stores';
	import BackButton from '@components/BackButton.svelte';
	const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
	export let message = "";
  	export let status = "";
</script>

<section class="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<div class="text-center">
					<h2 class="d-flex justify-content-center align-items-center gap-2 mb-4">
					
						<i class="bi bi-wifi-off text-danger display-4" />
						
					</h2>

					<h3 class="h2 mb-2">It looks like you're offline</h3>
					{#if message}
						<p class="error">{message}</p>
					{:else}
						<p class="error">Encountered a {status} error.</p>
					{/if}
					<p>Reload the page once you've found the internet.</p>
		
				</div>
			</div>
		</div>
	</div>
</section>

