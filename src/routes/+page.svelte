<script lang="ts">
import { readBeatmapSet } from '$lib/osu_files.ts';
import { createRenderer } from '$lib/renderer.ts';

const start = async () => {
  const { beatmaps, audios } = await readBeatmapSet("/beatmap.osz");

  for (const beatmap of beatmaps) {
    audios[0].play();
    const renderer = await createRenderer({ beatmap });
    document.getElementById("viewer_container")!.appendChild(renderer.canvas);
    const update = () => {
      renderer.update(audios[0].currentTime * 1000);
      requestAnimationFrame(update);
    };
    update();
  }
};
</script>

  <style>
    #viewer_container {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  </style>
  <div>
    <h1>osu! web replay viewer</h1>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <button onclick={start}>Start</button>
    <div id="viewer_container"></div>
  </div>
