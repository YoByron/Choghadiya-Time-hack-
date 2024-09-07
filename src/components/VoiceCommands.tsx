import React, { useState, useEffect } from 'react';

interface VoiceCommandsProps {
  onClose: () => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognition = new (window as any).SpeechRecognition();
    }

    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
        console.log('Transcript:', transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      (window as any).recognition?.stop();
    } else {
      (window as any).recognition?.start();
    }
  };

  return (
    <div>
      <h2>Voice Commands</h2>
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceCommands;