import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FiVideo } from 'react-icons/fi';

const CameraField = () => {
  const webcamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startVideoCall = async () => {
    try {
      console.log('[INFO] Requesting camera access...');
      setError('');
      setCameraOn(true);
      startSpeechRecognition();
    } catch (err) {
      console.error('[ERROR] Camera access failed:', err);
      setError('Could not start the video call. Check permissions.');
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[INFO] Speech recognition started');
    };

    recognition.onerror = (event) => {
      console.error('[ERROR] Speech recognition error:', event.error);
      setError('Speech recognition failed. Try again.');
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      await handleAIRequest(spokenText);
    };

    recognition.onend = () => {
      console.log('[INFO] Speech recognition ended');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAIRequest = async (text) => {
    try {
      setLoading(true);
      setError('');
      setResponse('');
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json",
          "X-Title": "My Chat App",
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
      setResponse(reply);
      speakText(reply);
    } catch (err) {
      console.error('[ERROR] Failed to fetch from OpenAI:', err);
      setError('Something went wrong with AI response.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.onstart = () => console.log('[INFO] Speaking started');
    utterance.onend = () => console.log('[INFO] Speaking ended');
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full h-[60dvh] text-white flex items-center justify-center">
      <div className="relative w-[900px] h-[60dvh] rounded-xl overflow-hidden shadow-lg bg-black">
        {!cameraOn ? (
          <img
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
            alt="placeholder"
            className="w-full h-full object-cover cursor-pointer"
            onClick={startVideoCall}
          />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={true}
            muted
            videoConstraints={{ facingMode: 'user' }}
            className="w-full h-full object-cover"
          />
        )}

        {cameraOn && (
          <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded w-32">
            <label htmlFor="volume" className="block text-xs mb-1">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        )}

        {!cameraOn && (
          <button
            onClick={startVideoCall}
            className="absolute bottom-4 right-4 flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            <FiVideo />
            <span>Start Video Interview</span>
          </button>
        )}

        {cameraOn ? (
          <div className="absolute bottom-16 left-4 right-4 text-sm bg-black/60 p-2 rounded text-white">
            <p><strong>You said:</strong> {transcript || 'Waiting for your voice...'}</p>
            {loading && <p className="text-yellow-400">Loading response...</p>}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )
      :
      (
        <div className="absolute bottom-16 left-4 right-4 text-sm bg-black/60 p-2 rounded text-white">
        <p>Click on image or Button to start  Interview</p>
        
      </div>
      )
      }
      </div>
    </div>
  );
};

export default CameraField;
