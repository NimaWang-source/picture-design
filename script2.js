const constraints = {
	audio: false,
	video: {
		facingMode: 'user'
	}
};

const getFrameFromVideo = (output, video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(video.width, 0);
	ctx.scale(-1, 1);
	ctx.drawImage(video, 0, 0, video.width, video.height);
	// ctx.beginPath();
	// ctx.lineWidth = 5;
	// ctx.strokeStyle = 'white';
	// ctx.rect(90, 0, 540, 540);
	// ctx.stroke();
	ctx.restore();
	sketch(output, 1080, 1080, canvas);
	requestAnimationFrame(() => getFrameFromVideo(output, video, canvas));
};

const getCameraStream = video => {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function success(stream) {
			video.srcObject = stream;
		});
};

const createVideo = (id, width, height) => {
	const video = document.createElement('video');
	video.id = id;
	video.width = width;
	video.height = height;
	video.autoplay = true;
	video.controls = true;
	return video;
};

const createCanvas = (id, width, height) => {
	const canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

const init = () => {
	const video = createVideo('vid', 720, 540);
	const canvas = createCanvas('canvas', 720, 540);
	const output = createCanvas('output', 1080, 1080);
	const app = document.getElementById('app');
	getCameraStream(video);
	getFrameFromVideo(output, video, canvas);
	// app.appendChild(video);
	// app.appendChild(canvas);
	app.appendChild(output);
	console.log('init');
};

const sketch = (output, width, height, video) => {
	const context = output.getContext('2d');
	context.clearRect(0, 0, 1080, 1080);

	const cell = 18;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;
	const videoContext = video.getContext('2d');

	const videoData = videoContext.getImageData(90, 0, 540, 540).data;
	console.log(videoData);

	for (let i = 0; i < numCells; i++) {
		const col = i % cols;
		const row = Math.floor(i / cols);

		const x = col * cell;
		const y = row * cell;

		const r = Math.floor(
			videoData[
				(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) * 4 +
					0
			] *
				0.299 +
				videoData[
					(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) *
						4 +
						1
				] *
					0.587 +
				videoData[
					(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) *
						4 +
						2
				] *
					0.114
		);
		context.save();
		context.translate(x, y);
		context.translate(cell * 0.5, cell * 0.5);

		context.beginPath();

		// context.fillStyle = rgbToHex(
		// 	videoData[
		// 		(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) * 4 +
		// 			0
		// 	],
		// 	videoData[
		// 		(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) * 4 +
		// 			1
		// 	],
		// 	videoData[
		// 		(row * (cell / 2) * cols * (cell / 2) + col * (cell / 2)) * 4 +
		// 			2
		// 	]
		// );
		context.fillStyle = 'white';

		context.arc(0, 0, (cell * 0.5 * r) / 256, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
};

const componentToHex = c => {
	let hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getGlyph = v => {
	const glyph1 = '._+';
	const glyph2 = '_=/#';
};

document.getElementById('app').onload = init();
