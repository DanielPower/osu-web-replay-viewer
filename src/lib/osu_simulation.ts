import type { Beatmap, HitObject, Replay, ReplayFrame } from 'osu-classes';
import type { StandardReplayFrame } from 'osu-standard-stable';
import { calcObjectRadius } from './osu_math';

export type SimulatedFrame = ReplayFrame & {
	result: number;
};

export const keysDown = (keys: number) => ({
  left: keys & 4,
  right: keys & 2,
  mouseLeft: keys & 1,
  mouseRight: keys & 16
});

export const isInside = (cx: number, cy: number, hx: number, hy: number, hr: number) =>
	Math.sqrt((cx - hx) ** 2 + (cy - hy) ** 2) < hr;

export const simulateReplay = (
	replay: Replay,
	beatmap: Beatmap,
	mods: number
): SimulatedFrame[] => {
	const simulatedFrames: SimulatedFrame[] = [];
  const frames = replay.frames as StandardReplayFrame[];

	for (const i = 0; i < replay.frames.length - 1; i++) {
    const [prevFrame, frame] = [replay.frames[i], replay.frames[i + 1]];
    const [prevKeys, keys] = [keysDown(prevFrame.keys), keysDown(frame.keys)];
    const clicked = 
		const { x, y, time, keys, result } = frame;
		const radius = calcObjectRadius(beatmap.difficulty.circleSize);
		const hitObject = beatmap.hitObjects.find(
			(hitObject) =>
				hitObject.startTime >= time - 50 &&
				hitObject.startTime <= time + 50 &&
				hitObject.startX &&
				isInside(x, y, hitObject.startX, hitObject.startY, radius)
		);
	}

	return simulatedFrames;
};
