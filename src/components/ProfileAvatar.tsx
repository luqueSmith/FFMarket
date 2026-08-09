/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type FrameType = 'none' | 'cyan' | 'heroic' | 'sakura' | 'gold' | 'evolutive';

interface ProfileAvatarProps {
  url: string;
  frame?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  url,
  frame = 'none',
  size = 'md',
  className = '',
}) => {
  // Determine dimensions based on size preset
  let dimensions = 'h-10 w-10';
  if (size === 'xs') dimensions = 'h-6 w-6';
  else if (size === 'sm') dimensions = 'h-8 w-8';
  else if (size === 'md') dimensions = 'h-12 w-12'; // Slightly larger for navbar/general as requested
  else if (size === 'lg') dimensions = 'h-14 w-14';
  else if (size === 'xl') dimensions = 'h-20 w-20';
  else if (size === '2xl') dimensions = 'h-24 w-24 sm:h-28 sm:w-28';

  let frameRingClass = "";
  let frameWrapperClass = "relative rounded-full flex items-center justify-center";
  let innerImageClass = "w-full h-full object-cover rounded-full aspect-square";

  if (frame === 'cyan') {
    frameRingClass = "ring-2 ring-neon-blue shadow-[0_0_15px_rgba(0,210,255,0.7)] border-none";
  } else if (frame === 'heroic') {
    frameRingClass = "ring-2 ring-[#ff003c] bg-gradient-to-tr from-[#ff003c] via-[#ff7700] to-[#ff003c] p-[2px] shadow-[0_0_18px_rgba(255,0,60,0.8)] animate-pulse border-none";
  } else if (frame === 'sakura') {
    frameRingClass = "ring-2 ring-[#9d50bb] bg-gradient-to-tr from-[#9d50bb] via-[#e100ff] to-[#9d50bb] p-[2px] shadow-[0_0_18px_rgba(225,0,255,0.8)] border-none";
  } else if (frame === 'gold') {
    frameRingClass = "ring-2 ring-yellow-500 bg-gradient-to-tr from-yellow-600 via-amber-400 to-yellow-600 p-[2px] shadow-[0_0_18px_rgba(234,179,8,0.85)] border-none";
  } else if (frame === 'evolutive') {
    frameRingClass = "ring-2 ring-transparent bg-gradient-to-tr from-red-500 via-green-400 via-blue-500 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(0,210,255,0.9)] animate-[spin_8s_linear_infinite] border-none";
  } else {
    // none or unknown
    frameRingClass = "border border-white/20";
  }

  const hasPadding = ['heroic', 'sakura', 'gold', 'evolutive'].includes(frame);

  return (
    <div className={`relative flex-shrink-0 inline-block select-none ${className}`} style={{ borderRadius: "50%" }}>
      {/* Glow highlight backdrop */}
      {frame !== 'none' && (
        <div className={`absolute inset-0 rounded-full blur-[6px] opacity-75 -z-10 ${
          frame === 'cyan' ? 'bg-[#00d2ff]/40' :
          frame === 'heroic' ? 'bg-[#ff003c]/40' :
          frame === 'sakura' ? 'bg-[#e100ff]/40' :
          frame === 'gold' ? 'bg-yellow-500/40' :
          frame === 'evolutive' ? 'bg-cyan-400/40' : ''
        }`} />
      )}

      {/* Frame Container */}
      <div className={`${dimensions} ${frameRingClass} ${frameWrapperClass}`}>
        {/* Anti-rotation child for image if wrapper spins */}
        <div className={`w-full h-full rounded-full overflow-hidden bg-black/40 flex items-center justify-center ${hasPadding ? 'p-[1px]' : ''}`} style={{ borderRadius: "50%" }}>
          <img
            src={url}
            alt="User Avatar"
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`${innerImageClass} ${frame === 'evolutive' ? 'animate-[spin_8s_linear_infinite_reverse]' : ''}`}
            style={{ borderRadius: "50%" }}
          />
        </div>

        {/* Small decorative corner badges or flare effects for Heroic / Gold */}
        {frame === 'heroic' && (
          <div className="absolute -top-1 -right-1 bg-red-600 text-[6px] text-white px-1 rounded-full font-black scale-90 border border-white/20 shadow-[0_0_4px_rgba(255,0,0,0.5)] z-20">
            🔥
          </div>
        )}
        {frame === 'gold' && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-[6px] text-black px-1 rounded-full font-black scale-90 border border-white/20 shadow-[0_0_4px_rgba(234,179,8,0.5)] z-20">
            🏆
          </div>
        )}
        {frame === 'evolutive' && (
          <div className="absolute -top-1 -right-1 bg-cyan-400 text-[6px] text-black px-1 rounded-full font-black scale-90 border border-white/20 shadow-[0_0_4px_rgba(0,210,255,0.5)] z-20">
            ⭐
          </div>
        )}
      </div>
    </div>
  );
};
