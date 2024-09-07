import React, { useState, useEffect } from 'react';
import { useChoghadiya } from '../hooks/useChoghadiya';
import { PlayCircle, PauseCircle, StopCircle, RefreshCw } from 'lucide-react';

interface MeditationTimerProps {
	onClose: () => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onClose }) => {
	const { currentPeriod } = useChoghadiya();
	const [timeLeft, setTimeLeft] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const [customDuration, setCustomDuration] = useState('');

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prevTime) => prevTime - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsActive(false);
			if (interval) clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, timeLeft]);

	const startTimer = () => {
		if (currentPeriod) {
			const endTime = new Date(currentPeriod.end).getTime();
			const now = new Date().getTime();
			const difference = Math.max(0, Math.floor((endTime - now) / 1000));
			setTimeLeft(difference);
			setIsActive(true);
		}
	};

	const startCustomTimer = () => {
		const duration = parseInt(customDuration);
		if (!isNaN(duration) && duration > 0) {
			setTimeLeft(duration * 60);
			setIsActive(true);
		}
	};

	const pauseTimer = () => {
		setIsActive(false);
	};

	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(0);
		setCustomDuration('');
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">Meditation Timer</h2>
				<p className="text-sm text-gray-500 mb-4">Current Period: {currentPeriod ? currentPeriod.name : 'Loading...'}</p>
			</div>
			<div className="text-center">
				<div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
				<div className="flex justify-center space-x-2 mb-4">
					{!isActive ? (
						<button
							onClick={startTimer}
							disabled={!currentPeriod}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
						>
							<PlayCircle className="mr-2 h-4 w-4" /> Start Period Timer
						</button>
					) : (
						<button
							onClick={pauseTimer}
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
						>
							<PauseCircle className="mr-2 h-4 w-4" /> Pause
						</button>
					)}
					<button
						onClick={resetTimer}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
					>
						<StopCircle className="mr-2 h-4 w-4" /> Reset
					</button>
				</div>
				<div className="flex items-center space-x-2">
					<input
						type="number"
						placeholder="Custom duration (minutes)"
						value={customDuration}
						onChange={(e) => setCustomDuration(e.target.value)}
						className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
					<button
						onClick={startCustomTimer}
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
					>
						<RefreshCw className="mr-2 h-4 w-4" /> Start Custom
					</button>
				</div>
			</div>
			<div className="text-center text-sm text-gray-500 mt-4">
				Meditate mindfully during this Choghadiya period
			</div>
		</div>
	);
};

export default MeditationTimer;