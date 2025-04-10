import React, { useRef, useState, useEffect } from "react"
import {
  Play, Pause, Square, SkipBack, SkipForward,
  Volume2, VolumeX, Maximize, Minimize
} from "lucide-react"

const MediaPlayer = ({ type, src, title = "Untitled", artist = "Unknown Artist", coverImage }) => {
  const mediaRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const play = () => {
    mediaRef.current.play()
    setIsPlaying(true)
  }

  const pause = () => {
    mediaRef.current.pause()
    setIsPlaying(false)
  }

  const stop = () => {
    mediaRef.current.pause()
    mediaRef.current.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const togglePlay = () => {
    isPlaying ? pause() : play()
  }

  const toggleMute = () => {
    mediaRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    mediaRef.current.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e) => {
    const seekPosition = e.target.value
    const newTime = (seekPosition / 100) * duration
    mediaRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skip = (seconds) => {
    const newTime = Math.min(Math.max(currentTime + seconds, 0), duration)
    mediaRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const handleTimeUpdate = () => setCurrentTime(media.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(media.duration)
      setIsLoaded(true)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      media.currentTime = 0
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    media.addEventListener("timeupdate", handleTimeUpdate)
    media.addEventListener("loadedmetadata", handleLoadedMetadata)
    media.addEventListener("ended", handleEnded)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      media.removeEventListener("timeupdate", handleTimeUpdate)
      media.removeEventListener("loadedmetadata", handleLoadedMetadata)
      media.removeEventListener("ended", handleEnded)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // 🎵 Audio Layout
  if (type === "audio") {
    return (
      <div
        ref={containerRef}
        className="w-full bg-[#121212] text-white rounded-2xl shadow-lg flex p-6 gap-6"
      >
        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={coverImage || "/portada.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400 font-medium">{artist}</span>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>

          {isLoaded && (
            <div className="mt-3">
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4 items-center">
              <button onClick={() => skip(-10)} className="hover:text-green-500 transition-colors">
                <SkipBack />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <button onClick={() => skip(10)} className="hover:text-green-500 transition-colors">
                <SkipForward />
              </button>
              <button onClick={stop} className="hover:text-red-500 transition-colors">
                <Square />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute}>
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={changeVolume}
                className="w-24 accent-green-500"
              />
            </div>
          </div>
        </div>

        <audio ref={mediaRef} src={src} className="hidden" />
      </div>
    )
  }

  // 🎬 Video Layout
  return (
    <div
      ref={containerRef}
      className="w-full bg-[#181818] text-white rounded-2xl shadow-lg flex p-6 gap-6"
    >
      <div className="w-2/3">
        <video
          ref={mediaRef}
          src={src}
          className="w-full h-auto rounded-lg"
          onClick={togglePlay}
          controls={false}
          muted={false}
          playsInline
        />

      </div>

      <div className="flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400 font-medium">{artist}</span>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>

          {isLoaded && (
            <>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 items-center">
            <button onClick={() => skip(-10)} className="hover:text-green-500 transition-colors">
              <SkipBack />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={() => skip(10)} className="hover:text-green-500 transition-colors">
              <SkipForward />
            </button>
            <button onClick={stop} className="hover:text-red-500 transition-colors">
              <Square />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              className="w-24 accent-green-500"
            />
            <button onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize /> : <Maximize />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaPlayer
