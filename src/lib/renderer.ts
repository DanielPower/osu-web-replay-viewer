import { HitObject, Score, type Beatmap } from 'osu-classes';
import { Application, Graphics } from 'pixi.js';

const calcPreempt = (AR: number) => {
	if (AR < 5) {
		return 1200 + (600 * (5 - AR)) / 5;
	}
	if (AR > 5) {
		return 1200 - (120 * (AR - 5)) / 5;
	}
	return 1200;
};

const calcFade = (AR: number) => {
	if (AR < 5) {
		return 800 + (400 * (5 - AR)) / 5;
	}
	if (AR > 5) {
		return 800 - (80 * (AR - 5)) / 5;
	}
	return 800;
};

function calcObjectRadius(CS: number) {
	return 32 * (1 - (0.7 * (CS - 5)) / 5);
}

function approachCircleRadius({
	timeRemaining,
	preempt,
	objectRadius
}: {
	timeRemaining: number;
	preempt: number;
	objectRadius: number;
}) {
	let progress = Math.min(Math.max(1 - timeRemaining / preempt, 0), 1); // Clamped between 0 and 1
	let approachRadius = (1.8 - 0.8 * progress) * objectRadius;

	return approachRadius;
}

export const createRenderer = async ({ beatmap, score }: { beatmap: Beatmap; score?: Score }) => {
	const renderer = new Application();
	const offsetX = (640 - 512) / 2;
	const offsetY = (480 - 384) / 2;

	await renderer.init({ backgroundColor: 0x000000, width: 640, height: 480, antialias: true });

	const preempt = calcPreempt(beatmap.difficulty.approachRate);
	const fade = calcFade(beatmap.difficulty.approachRate);
	const objectRadius = calcObjectRadius(beatmap.difficulty.circleSize);
	const cursor = new Graphics();
	renderer.stage.addChild(cursor);

	const circles: {
		hitObject: HitObject;
		hitCircle: Graphics;
		approachCircle: Graphics;
	}[] = [];

	let hitColorIndex = 0;
	for (const hitObject of beatmap.hitObjects) {
		const hitCircle = new Graphics();
		if (hitObject.hitType === 2) {
			hitColorIndex = (hitColorIndex + 1) % beatmap.colors.comboColors.length;
		}
		const color = beatmap.colors.comboColors[hitColorIndex];
		const hexColor = (color.red << 16) + (color.green << 8) + color.blue;
		hitCircle.circle(hitObject.startX + offsetX, hitObject.startY + offsetY, objectRadius);
		hitCircle.fill(hexColor);
		hitCircle.stroke(0x000000);
		hitCircle.zIndex = -hitObject.startTime;
		hitCircle.alpha = 0;
		hitCircle.visible = false;
		renderer.stage.addChild(hitCircle);

		const approachCircle = new Graphics();
		approachCircle.visible = false;
		approachCircle.zIndex = -hitObject.startTime;
		renderer.stage.addChild(approachCircle);

		circles.push({ hitObject, hitCircle, approachCircle });
	}

	const update = (time: number) => {
		for (const { hitObject, hitCircle, approachCircle } of circles) {
			if (time >= hitObject.startTime - preempt && time <= hitObject.startTime) {
				const alpha = Math.min(1, (time - (hitObject.startTime - preempt)) / fade);
				hitCircle.visible = true;
				approachCircle.visible = true;
				approachCircle.clear();
				approachCircle.circle(
					hitObject.startX + offsetX,
					hitObject.startY + offsetY,
					approachCircleRadius({
						timeRemaining: hitObject.startTime - time,
						preempt,
						objectRadius
					})
				);
				approachCircle.stroke(0xffffff);
				hitCircle.alpha = alpha;
				approachCircle.alpha = alpha;
			} else {
				hitCircle.visible = false;
				approachCircle.visible = false;
			}
		}

		if (score?.replay) {
			const frameIndex = score.replay.frames.findIndex((frame) => frame.startTime > time) - 1;
			const frame = score.replay.frames[Math.max(0, frameIndex)];
			cursor.moveTo(frame.position.x + offsetX, frame.position.y + offsetY);
			cursor.clear();
			cursor.circle(frame.position.x + offsetX, frame.position.y + offsetY, 5);
			cursor.fill(0xff0000);
		}
	};

	return {
		update,
		canvas: renderer.canvas
	};
};
