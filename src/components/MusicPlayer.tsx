import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'AUDIO_STREAM_01.dat', artist: 'SYS.OP.1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'AUDIO_STREAM_02.dat', artist: 'SYS.OP.2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'AUDIO_STREAM_03.dat', artist: 'SYS.OP.3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-black p-6 brutal-border w-full">
      <div className="border-b-4 border-cyan-400 pb-2 mb-4 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase glitch-text" data-text=">> AUDIO_MATRIX">
          &gt;&gt; AUDIO_MATRIX
        </h2>
        <span className="text-fuchsia-500 animate-pulse text-xl">
          {isPlaying ? 'TX_ACTIVE' : 'TX_IDLE'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6 bg-[#111] p-4 border border-fuchsia-500">
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white text-2xl font-bold truncate uppercase">
            {TRACKS[currentTrack].title}
          </h3>
          <p className="text-cyan-400 text-lg truncate uppercase">&gt; SRC: {TRACKS[currentTrack].artist}</p>
        </div>
        <button onClick={toggleMute} className="text-fuchsia-500 hover:text-white hover:bg-fuchsia-500 px-2 py-1 border border-fuchsia-500 transition-colors cursor-pointer text-xl uppercase">
          {isMuted ? '[ MUTED ]' : '[ VOL_ON ]'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-2 text-cyan-400 text-lg uppercase">&gt; BUFFER_STATUS</div>
      <div 
        className="h-6 bg-[#111] mb-6 cursor-pointer border-2 border-cyan-400 relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-fuchsia-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {/* Grid overlay for progress bar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cGF0aCBkPSJNMCAwTDAgNE00IDBMNCA0IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={handlePrev}
          className="flex-1 bg-cyan-400 text-black text-xl font-bold py-2 border-2 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-colors cursor-pointer uppercase"
        >
          [ &lt;&lt; ]
        </button>
        <button 
          onClick={togglePlay}
          className="flex-2 bg-fuchsia-500 text-black text-2xl font-bold py-2 border-2 border-fuchsia-500 hover:bg-black hover:text-fuchsia-500 transition-colors cursor-pointer uppercase"
        >
          {isPlaying ? '[ HALT ]' : '[ EXEC ]'}
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 bg-cyan-400 text-black text-xl font-bold py-2 border-2 border-cyan-400 hover:bg-black hover:text-cyan-400 transition-colors cursor-pointer uppercase"
        >
          [ &gt;&gt; ]
        </button>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />
    </div>
  );
}
