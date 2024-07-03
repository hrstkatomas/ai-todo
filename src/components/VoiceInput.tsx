import React from 'react';

export function VoiceInput() {
	const handleVoiceInput = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			const chunks: Blob[] = [];
			mediaRecorder.addEventListener('dataavailable', (event) => {
				chunks.push(event.data);
			});
			mediaRecorder.addEventListener('stop', () => {
				const blob = new Blob(chunks, { type: 'audio/mpeg' });
				const audioUrl = URL.createObjectURL(blob);
				const audio = new Audio(audioUrl);
				audio.play();
				// const newTodo = {
				// 	id: todos.length + 1,
				// 	title: "New Todo",
				// 	completed: false,
				// 	assignee: "John",
				// };
				// setTodos([...todos, newTodo]);
			});
			mediaRecorder.start();
			setTimeout(() => {
				mediaRecorder.stop();
			}, 3000);
		} catch (error) {
			console.error('Error recording audio:', error);
		}
	};

	return (
		<button onClick={handleVoiceInput} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
			<MicIcon className="h-6 w-6" />
		</button>
	);
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
			<line x1="12" x2="12" y1="19" y2="22" />
		</svg>
	);
}
