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
						<span class="display-1 fw-bold">{status.toString().charAt(0)}</span>
						<i class="bi bi-exclamation-circle-fill text-danger display-4" />
						<span class="display-1 fw-bold bsb-flip-h">{status.toString().charAt(2)}</span>
					</h2>
					<h3 class="h2 mb-2">Something went wrong when we tried to render this page.</h3>
					{#if message}
						<p class="error">{message}</p>
					{:else}
						<p class="error">Encountered a {status} error.</p>
					{/if}
					<p>
						If the error persists, please drop by the
						<a href="https://discord.gg/f2ywH6Bsu2"> Discord </a>
						and let us know, or raise an issue on
						<a href="https://github.com/Identicon-Dao/socialcap/issues">GitHub</a>. Thanks!
					</p>
					<BackButton label="Back to Home" route="/" />
				</div>
			</div>
		</div>
	</div>
</section>

