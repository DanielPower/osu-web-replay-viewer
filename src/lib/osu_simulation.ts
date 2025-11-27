import type { Beatmap, Replay } from 'osu-classes';
import type { StandardAction, StandardReplayFrame } from 'osu-standard-stable';

type HitObject = {
	x: number;
	y: number;
	time: number;
};

export type SimulatedFrame = {
	x: number;
	y: number;
	time: number;
	score: number;
	combo: number;
	perfect: number;
	good: number;
	okay: number;
	miss: number;
	actions: Set<StandardAction>;
	hitObjects: HitObject[];
};

export const isInside = (cx: number, cy: number, hx: number, hy: number, hr: number) =>
	Math.sqrt((cx - hx) ** 2 + (cy - hy) ** 2) < hr;

export const simulateReplay = (
	replay: Replay,
	beatmap: Beatmap,
	mods: number
): SimulatedFrame[] => {
	const simulatedFrames: SimulatedFrame[] = [];
	const frames = replay.frames as StandardReplayFrame[];

	let hitObjectIndex = 0;
	let score = 0;
	let combo = 0;
	let perfect = 0;
	let good = 0;
	let okay = 0;
	let miss = 0;
	let hitObjects: HitObject[] = [];

	for (let i = 0; i < replay.frames.length - 1; i++) {
		const frame = frames[i];
		const { x, y } = frame.position;
		// const radius = calcObjectRadius(beatmap.difficulty.circleSize);
		const currentFrameHitObjects = [];
		while (
			beatmap.hitObjects[hitObjectIndex] &&
			frame.startTime > beatmap.hitObjects[hitObjectIndex].startTime
		) {
			const hitObject = beatmap.hitObjects[hitObjectIndex];
			currentFrameHitObjects.push({
				x: hitObject.startX,
				y: hitObject.startY,
				time: hitObject.startTime
			});
			hitObjectIndex++;
		}
		simulatedFrames.push({
			x,
			y,
			time: frame.startTime,
			score,
			combo,
			perfect,
			good,
			okay,
			miss,
			actions: frame.actions,
			hitObjects: [...hitObjects, ...currentFrameHitObjects]
		});
	}

	return simulatedFrames;
};
