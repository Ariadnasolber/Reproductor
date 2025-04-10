import React from "react"
import MediaPlayer from "./components/MediaPlayer"

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-8 py-12 text-white">
      <div className="w-full max-w-6xl space-y-12">
        <MediaPlayer
          type="video"
          src="/RecycledJ-MARAVILLA.mp4"
          title="Recycled J - MARAVILLA MV"
          artist="Recycled J"
        />
        <MediaPlayer
          type="audio"
          src="/Delaossa-RecycledJ-Demonios-De-Blanco.mp3"
          title="Delaossa - Demonios de Blanco ft. Recycled J"
          artist="Delaossa"
          coverImage="/portada.jpg"
        />
      </div>
    </div>
  )
}

export default App
