<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mx-auto w-5xl text-white">
	{@render children()}
</div>

<style>
	:global(body) {
		background-color: var(--color-slate-900);
	}
</style>
