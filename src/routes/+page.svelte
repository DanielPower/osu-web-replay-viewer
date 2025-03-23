<script lang="ts">
	import AudioControls from '$lib/components/AudioControls.svelte';
	import { readBeatmapSet, readScore } from '$lib/osu_files';
	import { createRenderer } from '$lib/renderer';
	import type { Beatmap } from 'osu-classes';
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement | null = null;
	let beatmap: Beatmap | null = null;

	onMount(async () => {
		const { beatmaps, audios } = await readBeatmapSet('/beatmap.osz');
		const score = await readScore('/replay.osr');
		audio = audios[0];
		beatmap = beatmaps[1];
		const renderer = await createRenderer({ beatmap, score });
		document.getElementById('viewer_container')!.appendChild(renderer.canvas);
		const update = () => {
			if (!audio.paused) {
				renderer.update(audios[0].currentTime * 1000);
			}
			requestAnimationFrame(update);
		};
		update();
	});
</script>

<div class="flex flex-col items-center">
	<h1 class="text-4xl font-bold">
		{#if beatmap}
			<p>{beatmap.metadata.title} - {beatmap.metadata.artist}</p>
			<p>{beatmap.metadata.version}</p>
		{/if}
	</h1>
	<div class="w-[640px]">
		<div id="viewer_container"></div>
		{#if audio}
			<AudioControls {audio} />
		{/if}
	</div>
</div>

<style>
	#viewer_container {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
</style>
