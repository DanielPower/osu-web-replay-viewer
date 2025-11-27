export const calcPreempt = (AR: number) => {
	if (AR < 5) {
		return 1200 + (600 * (5 - AR)) / 5;
	}
	if (AR > 5) {
		return 1200 - (120 * (AR - 5)) / 5;
	}
	return 1200;
};

export const calcFade = (AR: number) => {
	if (AR < 5) {
		return 800 + (400 * (5 - AR)) / 5;
	}
	if (AR > 5) {
		return 800 - (80 * (AR - 5)) / 5;
	}
	return 800;
};

export function calcObjectRadius(CS: number) {
	return 32 * (1 - (0.7 * (CS - 5)) / 5);
}
