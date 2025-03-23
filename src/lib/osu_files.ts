import { BlobReader, ZipReader, TextWriter, BlobWriter } from '@zip.js/zip.js';
import { BeatmapDecoder, ScoreDecoder } from 'osu-parsers';

const readZip = (blob: Blob) => {
	const blobReader = new BlobReader(blob);
	const zipReader = new ZipReader(blobReader);
	return zipReader.getEntries();
};

const beatmapDecoder = new BeatmapDecoder();
const scoreDecoder = new ScoreDecoder();

export const extractAudioFile = async (entry: any) => {
	if (!entry.getData) {
		throw new Error('Entry does not have a getData method');
	}

	const blobWriter = new BlobWriter();
	await entry.getData(blobWriter);
	const blob = await blobWriter.getData();

	// Create an object URL for the audio blob
	const audioUrl = URL.createObjectURL(blob);
	return audioUrl;
};

export const readBeatmapSet = async (url: string) => {
	const response = await fetch(url);
	const blob = await response.blob();
	const entries = await readZip(blob);

	const beatmaps = await Promise.all(
		entries
			.filter((entry) => entry.filename.endsWith('.osu'))
			.map(async (entry) => {
				if (!entry.getData) {
					throw new Error('Entry does not have a getData method');
				}
				const textWriter = new TextWriter();
				await entry.getData(textWriter);
				const content = await textWriter.getData();
				return beatmapDecoder.decodeFromString(content);
			})
	);

	const audios = await Promise.all(
		entries
			.filter(
				(entry) =>
					entry.filename.endsWith('.mp3') ||
					entry.filename.endsWith('.ogg') ||
					entry.filename.endsWith('.wav')
			)
			.map(async (entry) => {
				const audioFile = await extractAudioFile(entry);
				return new Audio(audioFile);
			})
	);

	return {
		entries,
		beatmaps,
		audios
	};
};

export const readScore = async (url: string) => {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const score = await scoreDecoder.decodeFromBuffer(buffer);

	return score;
};
