import "./style.css";

import { createRenderer } from "./renderer";
import { BeatmapDecoder } from "osu-parsers";

const decoder = new BeatmapDecoder();

const beatmapResponse = await fetch("/beatmap.osu");
const beatmapText = await beatmapResponse.text();
const beatmap = decoder.decodeFromString(beatmapText);
const renderer = await createRenderer({ beatmap });

const update = () => {
  renderer.update(performance.now());
  requestAnimationFrame(update);
};
update();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>osu! web replay viewer</h1>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;
document.getElementById("app")!.appendChild(renderer.canvas);
