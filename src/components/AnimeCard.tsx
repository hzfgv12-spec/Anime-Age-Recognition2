import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, ShieldAlert, Award, Hash, Flame, Sparkle } from "lucide-react";
import { AnimeAnalysis } from "../types";

interface AnimeCardProps {
  analysis: AnimeAnalysis;
  imageUrl: string;
}

export function AnimeCard({ analysis, imageUrl }: AnimeCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    characterName,
    estimatedAge,
    estimatedAgeGroup,
    confidenceScore,
    animeArchetype,
    customCardQuote,
    personalityVibe
  } = analysis;

  // Determine RPG Rarity based on confidence percentage
  let rarity = "R";
  let rarityColor = "from-blue-500 to-indigo-600 border-blue-400 text-blue-400 shadow-blue-500/10";
  let rarityBadgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/30";
  let cardBorderColor = "border-blue-500/20 shadow-blue-500/10";

  if (confidenceScore >= 95) {
    rarity = "SSR";
    rarityColor = "from-amber-400 via-orange-500 to-rose-600 border-yellow-400 text-amber-400 shadow-amber-500/30";
    rarityBadgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    cardBorderColor = "border-amber-400/50 shadow-amber-500/20";
  } else if (confidenceScore >= 85) {
    rarity = "SR";
    rarityColor = "from-purple-500 via-fuchsia-500 to-pink-600 border-purple-400 text-purple-400 shadow-purple-500/25";
    rarityBadgeColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
    cardBorderColor = "border-purple-500/40 shadow-purple-500/15";
  }

  // Text to Speech logic for the role quote
  const speakQuote = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Use clean quote
      const cleanText = customCardQuote.replace(/「|」/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Try resolving optimal standard Chinese (Traditional) voice or Japanese voice
      utterance.lang = "zh-TW";
      utterance.rate = 1.0;
      utterance.pitch = 1.15; // slightly higher pitch for anime-like vibe

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("您的瀏覽器暫不支援語音合成合成播放喔！");
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className={`relative group max-w-sm mx-auto overflow-hidden rounded-3xl border-2 bg-slate-900/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${cardBorderColor}`}>
      
      {/* Background magical ambient glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${rarityColor} opacity-20 blur-xl group-hover:opacity-30 transition-all duration-700`} />
      
      {/* Anime card container */}
      <div className="relative p-5 flex flex-col h-full text-white z-10">
        
        {/* Rarity & Confidence Bar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-md border font-display font-black tracking-widest ${rarityBadgeColor}`}>
              {rarity} GRADE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              CONFID: <span className="text-emerald-400 font-bold">{confidenceScore}%</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-purple-300 font-sans px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
              {animeArchetype}
            </span>
          </div>
        </div>

        {/* Character Image viewport */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950/40">
          <img
            src={imageUrl}
            alt={characterName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Hologram Overlay Pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/0 to-transparent opacity-90" />

          {/* Golden/Purple sparkle elements */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {rarity === "SSR" && (
              <>
                <div className="bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg animate-bounce">
                  <Sparkles size={14} />
                </div>
                <div className="bg-rose-500 text-white p-1 rounded-full shadow-lg text-[8px] font-black text-center">
                  LV.MAX
                </div>
              </>
            )}
            {rarity === "SR" && (
              <div className="bg-purple-500 text-white p-1.5 rounded-full shadow-lg">
                <Sparkle size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            )}
          </div>

          {/* Age Overlay Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-mono font-medium">
                ESTIMATED AGE / 鑑定年齡
              </p>
              <h3 className="text-2xl font-bold font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 drop-shadow">
                {estimatedAge}
              </h3>
            </div>
            
            <span className="px-2.5 py-1 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-slate-700/50 rounded-lg text-xs font-bold font-sans text-rose-300">
              {estimatedAgeGroup}
            </span>
          </div>
        </div>

        {/* Character identity & core tag details */}
        <div className="mt-4 flex-grow flex flex-col">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-mono font-semibold">
            <Hash size={12} className="text-pink-400" />
            <span>ID: ANIME_TARGET_{Math.floor(1000 + Math.random() * 9000)}</span>
          </div>
          
          <h2 className="text-xl font-bold font-display tracking-tight text-white mt-1 group-hover:text-pink-300 transition-colors">
            {characterName}
          </h2>

          <div className="mt-2.5 px-3 py-2 bg-slate-800/40 border border-slate-700/30 rounded-xl">
            <p className="text-[10px] text-purple-300 font-mono flex items-center gap-1 uppercase tracking-wider font-bold">
              <Flame size={10} /> Core Vibe / 二次元氣質
            </p>
            <p className="text-xs text-slate-200 font-sans mt-1 leading-snug">
              <strong className="text-pink-300">【{personalityVibe.primaryVibe}】</strong>
              {personalityVibe.description}
            </p>
          </div>

          {/* Character Dialogue Box with Live Voice Reader */}
          <div className="relative mt-4 p-3 bg-slate-950/60 border border-pink-500/25 rounded-xl flex items-center justify-between gap-3">
            <div className="flex-1">
              <span className="absolute -top-1.5 left-3 px-1.5 py-0.2 bg-pink-500 text-[8px] font-bold rounded text-white tracking-widest uppercase">
                Dialogue / 角色台詞
              </span>
              <p className="text-xs text-pink-100 italic font-sans leading-relaxed mt-1">
                {customCardQuote}
              </p>
            </div>
            
            <button
              onClick={speakQuote}
              className={`p-2.5 rounded-lg border flex-shrink-0 transition-all ${
                isPlaying
                  ? "bg-pink-600 border-pink-400 text-white animate-pulse"
                  : "bg-slate-800/80 border-slate-700 text-pink-300 hover:bg-slate-700 hover:text-white"
              }`}
              title="播放角色配音"
            >
              <Volume2 size={16} className={isPlaying ? "animate-bounce" : ""} />
            </button>
          </div>
        </div>

        {/* Card Footer Design decoration (Anti-Tech Larper / Plain authentic style) */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>ACG-AGE READER v3.5-FLASH</span>
          <span>PERSISTENCE: LOCAL</span>
        </div>
      </div>
    </div>
  );
}
