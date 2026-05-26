import { useRef, useState } from "react"
import { Link } from "react-router-dom"

function VideoCall() {
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const [stream, setStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // START CAMERA
  const startVideoCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setIsLive(true)
      setIsScreenSharing(false)
    } catch (error) {
      console.log(error)
      alert("Camera access denied. Please grant hardware permissions.")
    }
  }

  // SCREEN SHARE
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })
      videoRef.current.srcObject = screenStream
      setIsLive(true)
      setIsScreenSharing(true)

      // Handle screen share stop event
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // START RECORDING
  const startRecording = () => {
    if (!stream) {
      alert("Please start the Camera or Screen Share first to establish a stream source.")
      return
    }

    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "video/webm"
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `VTube_LiveStream_${new Date().toISOString().slice(0, 10)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setIsRecording(false)
    }

    recorder.start()
    setIsRecording(true)
  }

  // STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-8 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              VTube Creator Studio Live
            </h1>
            <p className="text-white/50 text-xs mt-1">Broadcast directly from your browser, share your desktop workspace, and archive your recording.</p>
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE BROADCAST
              </span>
            )}
            {isRecording && (
              <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                REC ACTIVE
              </span>
            )}
            {!isLive && !isRecording && (
              <span className="bg-white/10 text-white/50 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                Studio Offline
              </span>
            )}
          </div>
        </div>

        {/* MAIN STUDIO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Video Preview Stream Monitor */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/90 border border-white/5 shadow-2xl flex items-center justify-center group/studio">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: isScreenSharing ? "none" : "scaleX(-1)" }} // Mirror camera feed for natural view, keep screen sharing normal
              />

              {/* Decorative Studio Grid Overlays */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none" />
              
              {/* Overlay graphics when stream is offline */}
              {!isLive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#121212] via-black to-[#0f0f0f] text-center z-10">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/30 group-hover/studio:border-red-500/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">Connect Video Input</h3>
                  <p className="text-xs text-white/60 leading-relaxed max-w-sm">
                    Activate your high-definition camera stream or share your browser layout/desktop to begin hosting your broadcast inside VTube Pro Studio.
                  </p>
                  <button
                    onClick={startVideoCall}
                    className="mt-6 btn-premium-red text-white font-semibold text-xs px-6 py-3 rounded-full cursor-pointer transition-all shadow hover:scale-105 active:scale-95"
                  >
                    Start Web Camera
                  </button>
                </div>
              )}

              {/* Audio meter visualization overlay (purely visual & beautiful!) */}
              {isLive && (
                <div className="absolute bottom-4 left-4 z-20 flex gap-0.5 items-end h-8 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/15">
                  <div className="w-1 bg-red-600 rounded-full h-1/2 animate-[pulse_0.4s_infinite_alternate]" />
                  <div className="w-1 bg-red-600 rounded-full h-4/5 animate-[pulse_0.6s_infinite_alternate]" style={{ animationDelay: "0.1s" }} />
                  <div className="w-1 bg-red-600 rounded-full h-1/3 animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1 bg-red-600 rounded-full h-5/5 animate-[pulse_0.3s_infinite_alternate]" style={{ animationDelay: "0.3s" }} />
                  <div className="w-1 bg-red-600 rounded-full h-2/3 animate-[pulse_0.7s_infinite_alternate]" style={{ animationDelay: "0.4s" }} />
                  <span className="text-[9px] font-black text-white/70 ml-2 tracking-widest uppercase">MIC FEED</span>
                </div>
              )}
            </div>

            {/* Video description footer */}
            <div className="glass-card p-4 rounded-2xl border border-white/5 text-xs text-white/60 leading-relaxed">
              <span className="font-bold text-white uppercase block mb-1">Developer Notes:</span>
              HTML5 MediaRecorder capture is compiled in real-time inside your browser core sandbox. Capturing is securely sandboxed and exports a premium WebM visual container for local storage immediately upon stop command.
            </div>
          </div>

          {/* RIGHT: Studio Mixer Console Control Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Action controls panel */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-sm font-bold border-b border-white/10 pb-2 text-white/80 uppercase tracking-wider">
                Broadcast Mixer Console
              </h3>

              {/* Control Buttons Group */}
              <div className="flex flex-col gap-3">
                {/* 1. Camera Input */}
                <button
                  onClick={startVideoCall}
                  className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-between font-semibold text-xs transition-all cursor-pointer ${
                    isLive && !isScreenSharing
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    Start Web Camera
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-black opacity-60">
                    {isLive && !isScreenSharing ? "ACTIVE" : "SELECT"}
                  </span>
                </button>

                {/* 2. Screen Share */}
                <button
                  onClick={shareScreen}
                  className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-between font-semibold text-xs transition-all cursor-pointer ${
                    isLive && isScreenSharing
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                    Share Desktop Screen
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-black opacity-60">
                    {isLive && isScreenSharing ? "ACTIVE" : "SELECT"}
                  </span>
                </button>

                <div className="border-t border-white/5 my-2" />

                {/* 3. Start Recording */}
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                      <circle cx="12" cy="12" r="5" className="fill-red-500 animate-pulse" />
                    </svg>
                    Start Recording Broadcast
                  </button>
                ) : (
                  /* 4. Stop Recording */
                  <button
                    onClick={stopRecording}
                    className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all shadow-[0_4px_12px_rgba(220,38,38,0.3)] animate-pulse"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M6 6h12v12H6z" />
                    </svg>
                    Stop Recording & Save
                  </button>
                )}
              </div>
            </div>

            {/* Broadcast Details card */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest">Mixer Metadata</h4>
              
              <div className="flex flex-col gap-2 text-xs text-white/50">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Stream Format</span>
                  <span className="font-semibold text-white">H.264 / AAC WebRTC</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Canvas Resolution</span>
                  <span className="font-semibold text-white">1080p Full HD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Frame Rate Target</span>
                  <span className="font-semibold text-white">60 frames/sec</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default VideoCall