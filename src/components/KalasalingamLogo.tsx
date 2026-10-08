import React from 'react';
import kareOfficialLogoWebp from '../assets/images/kare_official_logo.webp';
import kareOfficialLogoPng from '../assets/images/kare_official_logo.png';
import kareOfficialEmblemWebp from '../assets/images/kare_official_emblem.webp';
import kareOfficialEmblemPng from '../assets/images/kare_official_emblem.png';

export interface KalasalingamLogoProps {
  variant?: 'full' | 'crest' | 'compact' | 'badge' | '3d-card' | '3d-showcase' | 'hero-banner';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const KalasalingamLogo: React.FC<KalasalingamLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions for the 3D Crest Emblem
  const emblemSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  // Dimensions for the Full Horizontal Logo Banner
  const fullLogoSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12 md:h-14',
    lg: 'h-14 sm:h-16 md:h-20',
    xl: 'h-20 sm:h-24 md:h-28',
  };

  // 3D Crest Emblem Element with Realistic Dimensional Lighting & Sheen
  const Emblem3D = (
    <div className={`relative shrink-0 ${emblemSizes[size]} group cursor-pointer select-none`}>
      {/* 3D Ambient Glow */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600/35 via-amber-500/25 to-sky-400/30 blur-md opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* 3D Emblem Image */}
      <img
        src={kareOfficialEmblemWebp}
        onError={(e) => {
          (e.target as HTMLImageElement).src = kareOfficialEmblemPng;
        }}
        alt="Kalasalingam Academy of Research and Education Official Emblem"
        className="w-full h-full object-contain rounded-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] relative z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
        loading="eager"
      />
    </div>
  );

  // 1. Hero Banner Variant: Clean transparent 3D logo banner (no enclosing box or background, expanded presence)
  if (variant === 'hero-banner') {
    return (
      <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
        <img
          src={kareOfficialLogoWebp}
          onError={(e) => {
            (e.target as HTMLImageElement).src = kareOfficialLogoPng;
          }}
          alt="Kalasalingam Academy of Research and Education Official 3D Logo"
          className="w-full h-auto max-h-[140px] sm:max-h-[190px] md:max-h-[240px] lg:max-h-[280px] object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)] transition-transform duration-300 ease-out hover:scale-[1.03]"
          loading="eager"
        />
      </div>
    );
  }

  // 2. 3D Card / Showcase: Features the official 3D logo banner filling the container (no extra side words or Tamil text)
  if (variant === '3d-card' || variant === '3d-showcase') {
    return (
      <div className={`logo-3d-scene w-full ${className}`}>
        <div className="logo-3d-monument logo-3d-sheen-sweep relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c1328]/95 via-[#080d1a]/95 to-[#04060f]/95 border border-blue-500/35 p-3 sm:p-5 shadow-2xl flex items-center justify-center overflow-hidden group">
          {/* 3D Ambient Glow behind the logo */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 via-sky-500/15 to-indigo-600/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          {/* Official 3D University Logo Image (fills the full container cleanly) */}
          <div className="relative z-10 w-full flex items-center justify-center py-1 sm:py-2">
            <img
              src={kareOfficialLogoWebp}
              onError={(e) => {
                (e.target as HTMLImageElement).src = kareOfficialLogoPng;
              }}
              alt="Kalasalingam Academy of Research and Education Official 3D Logo"
              className="w-full h-auto max-h-[140px] sm:max-h-[180px] md:max-h-[220px] object-contain drop-shadow-[0_10px_26px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. 3D Badge Variant (for modals, headers, cards)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-[#080d1c]/90 border border-blue-500/30 shadow-xl shadow-blue-950/40 backdrop-blur-md logo-3d-sheen-sweep group ${className}`}>
        <img
          src={kareOfficialLogoWebp}
          onError={(e) => {
            (e.target as HTMLImageElement).src = kareOfficialLogoPng;
          }}
          alt="Kalasalingam Official University Logo"
          className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)] relative z-10 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="hidden sm:flex flex-col border-l border-blue-500/30 pl-2.5">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300 font-mono leading-tight">
            NAAC A++
          </span>
          <span className="text-[9px] text-zinc-400 font-medium leading-tight">
            Deemed University
          </span>
        </div>
      </div>
    );
  }

  // 3. Compact Variant (for mobile navbar & tight buttons)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {Emblem3D}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-sm tracking-wide text-white font-sans uppercase">
              KARE
            </span>
            <span className="text-[10px] font-bold text-sky-400 tracking-wider">
              AI PORTAL
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-sans mt-0.5">
            Kalasalingam University
          </span>
        </div>
      </div>
    );
  }

  // 4. Crest Variant (just the circular 3D emblem)
  if (variant === 'crest') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {Emblem3D}
      </div>
    );
  }

  // 5. Full Variant: Clean transparent logo (no background box)
  return (
    <div className={`relative inline-flex items-center group cursor-pointer select-none ${className}`}>
      <img
        src={kareOfficialLogoWebp}
        onError={(e) => {
          (e.target as HTMLImageElement).src = kareOfficialLogoPng;
        }}
        alt="Kalasalingam Academy of Research and Education Official Logo"
        className={`${fullLogoSizes[size]} w-auto object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
