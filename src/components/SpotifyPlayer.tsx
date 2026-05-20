"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Settings, ExternalLink, Save, RefreshCw, X, User } from "lucide-react";

const PLAYLISTS = [
  { name: "Lofi Beats", id: "37i9dQZF1DWWQRwui0ExPn", color: "#C3E5C4" }, // Sage Green
  { name: "Deep Focus", id: "37i9dQZF1DWZeKCadgRdKQ", color: "#FFB7B2" }, // Peach Rose
  { name: "Peaceful Piano", id: "37i9dQZF1DX4sWSpwq3LiO", color: "#A3C4F3" }, // Periwinkle Blue
  { name: "Jazz Vibes", id: "37i9dQZF1DX0SM0LYsmbMT", color: "#FFFFFF" }, // Paper
];

export function SpotifyPlayer() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLISTS[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [customId, setCustomId] = useState("");
  const [activeCustomId, setActiveCustomId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("spotify_custom_playlist_id");
    if (savedId) {
      setActiveCustomId(savedId);
      setCustomId(savedId);
    }
  }, []);

  const handleSaveCustomId = () => {
    let finalId = customId.trim();
    if (finalId.includes("playlist/")) {
      finalId = finalId.split("playlist/")[1].split("?")[0];
    }

    if (finalId) {
      localStorage.setItem("spotify_custom_playlist_id", finalId);
      setActiveCustomId(finalId);
      setShowSettings(false);
    }
  };

  const handleClearCustomId = () => {
    localStorage.removeItem("spotify_custom_playlist_id");
    setActiveCustomId(null);
    setCustomId("");
  };

  const handleSyncProfile = () => {
    window.open("https://open.spotify.com/", "_blank");
  };

  const currentId = activeCustomId || selectedPlaylist.id;

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] p-6 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col transition-all h-full">
      <div className="border-b-[1.5px] border-ink mb-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-serif-header text-2xl font-black text-ink leading-none">Mood Station</h3>
          <p className="font-mono-tag text-[10px] italic font-bold uppercase text-gray-500 mt-1">
            {activeCustomId ? "Personalized Channel" : "Audio Environment v2.1"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 border-[1.5px] border-ink rounded-full transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:bg-acid-green ${showSettings ? 'bg-acid-green' : ''}`}
          >
            <Settings size={18} className="text-ink" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showSettings ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 mb-4 p-4 bg-gray-50 border-[1.5px] border-ink border-dashed rounded-xl">
              <div>
                <label className="font-mono-tag text-[10px] font-black uppercase text-ink mb-1 block">Custom Playlist ID or URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    placeholder="Paste Spotify Link..."
                    className="flex-1 bg-paper border-[1.5px] border-ink rounded-lg px-3 py-1.5 font-mono-tag text-xs outline-none focus:ring-2 focus:ring-hot-pink transition-all"
                  />
                  <button
                    onClick={handleSaveCustomId}
                    className="p-2 bg-ink text-paper rounded-lg hover:bg-hot-pink transition-colors"
                  >
                    <Save size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handleSyncProfile}
                  className="flex-1 flex items-center justify-center gap-2 font-mono-tag text-[10px] font-black uppercase py-2 bg-paper border-[1.5px] border-ink rounded-lg hover:bg-electric-blue transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RefreshCw size={12} />
                  Sync Spotify Profile
                </button>
                {activeCustomId && (
                  <button
                    onClick={handleClearCustomId}
                    className="p-2 border-[1.5px] border-ink rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col flex-1"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {PLAYLISTS.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    setActiveCustomId(null);
                  }}
                  className={`font-mono-tag text-[9px] font-black uppercase px-2 py-1 border-[1.5px] border-ink rounded-full transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]
                    ${!activeCustomId && selectedPlaylist.id === playlist.id
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-gray-100"}
                  `}
                >
                  {playlist.name}
                </button>
              ))}
              {activeCustomId && (
                <div className="flex items-center gap-1 font-mono-tag text-[9px] font-black uppercase px-2 py-1 border-[1.5px] border-ink rounded-full bg-hot-pink text-paper shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                  <User size={10} />
                  Custom
                </div>
              )}
            </div>

            <div className="relative w-full h-[152px] bg-ink rounded-xl overflow-hidden border-[1.5px] border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group">
              <iframe
                key={currentId}
                src={`https://open.spotify.com/embed/playlist/${currentId}?utm_source=generator`}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t-[1.5px] border-ink border-dashed flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-hot-pink animate-pulse" />
          <span className="font-mono-tag text-[8px] text-gray-500 uppercase tracking-widest">
            {activeCustomId ? "Private Stream Active" : "Signal: Stable / Audio Active"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://open.spotify.com/playlist/${currentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-ink transition-colors"
          >
            <ExternalLink size={12} />
          </a>
          <Music size={12} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
