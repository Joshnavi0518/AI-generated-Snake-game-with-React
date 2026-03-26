/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans crt-flicker relative overflow-hidden">
      <div className="noise-bg" />
      <div className="scanline" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
        
        {/* Main Game Area */}
        <div className="lg:col-span-8 flex flex-col items-center bg-black p-6 md:p-10 brutal-border">
          <div className="mb-8 text-center w-full border-b-4 border-fuchsia-500 pb-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-widest text-white glitch-text uppercase" data-text="SYS.OP.SNAKE_PROTOCOL">
              SYS.OP.SNAKE_PROTOCOL
            </h1>
            <p className="text-cyan-400 text-xl mt-2 tracking-widest uppercase">&gt;&gt; DIRECTIVE: CONSUME_BIOMASS</p>
          </div>
          
          <SnakeGame />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <MusicPlayer />
          
          <div className="bg-black p-6 brutal-border">
            <h2 className="text-2xl font-bold text-fuchsia-500 mb-5 tracking-widest uppercase border-b-2 border-cyan-400 pb-2">
              &gt;&gt; INPUT_MATRIX
            </h2>
            <ul className="space-y-4 text-cyan-400 text-xl">
              <li className="flex items-center justify-between">
                <span>&gt; VECTOR_CTRL</span>
                <div className="flex gap-2">
                  <span className="bg-fuchsia-500 text-black px-2 py-1">W</span>
                  <span className="bg-fuchsia-500 text-black px-2 py-1">A</span>
                  <span className="bg-fuchsia-500 text-black px-2 py-1">S</span>
                  <span className="bg-fuchsia-500 text-black px-2 py-1">D</span>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span>&gt; ALT_VECTOR</span>
                <span className="bg-cyan-400 text-black px-2 py-1">ARROWS</span>
              </li>
              <li className="flex items-center justify-between">
                <span>&gt; HALT_EXEC</span>
                <span className="bg-white text-black px-2 py-1">SPACE</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
