'use client'

import { useRef, useState } from 'react'

interface Props {
  src: string
  title?: string
}

export default function AudioPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  const onTimeUpdate = () => {
    const a = audioRef.current
    if (!a) return
    setCurrentTime(a.currentTime)
    setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current
    if (!a) return
    const t = (Number(e.target.value) / 100) * a.duration
    a.currentTime = t
    setProgress(Number(e.target.value))
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
      {title && <p className="text-sm font-semibold text-blue-900 truncate">{title}</p>}

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={toggle}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0 shadow"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Scrubber */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={seek}
            className="w-full accent-blue-600 h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-blue-700 font-mono">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
