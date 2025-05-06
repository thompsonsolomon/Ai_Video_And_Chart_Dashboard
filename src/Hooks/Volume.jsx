import { useState, useEffect, useRef } from "react";

const VolumeControl = () => {
    const [volume, setVolume] = useState(60);
    const [muteVolume, setMuteVolume] = useState(false);
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);

    // Initialize Web Audio API context and gain node
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination); // Connect to the speakers
        }
    }, []);

    // Update volume based on the range slider
    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = e.target.value / 100;
        }
    };

    // Mute/Unmute Function
    const toggleMute = () => {
        setMuteVolume((prev) => {
            if (!prev) {
                setVolume(0); // Mute the volume
            } else {
                setVolume(60); // Reset volume to 60% when unmuted
            }
            return !prev;
        });
    };

    // Set volume when the page loads or when the volume state changes
    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume / 100;
        }
    }, [volume]);

    // Set mute based on muteVolume state
    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = muteVolume ? 0 : volume / 100;
        }
    }, [muteVolume]);

    return (
        <div className="vol flex">
            {
                muteVolume ?
                    <svg      onClick={toggleMute}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                    : volume ?
                        <svg      onClick={toggleMute}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                        :
                        ""
            }


            {/* Volume Slider */}
            <input
                type="range"
                max="100"
                id="currentMusic"
                value={volume}
                onChange={handleVolumeChange}
                disabled={muteVolume} // Disable the slider when muted
            />

            {/* Volume bar and dot */}
            <div className="vol_bar" style={{ width: `${volume}%` }}></div>
            <div className="dot" id="vol_dot" style={{ left: `${volume}%` }}></div>
        </div>
    );
};

export default VolumeControl;
