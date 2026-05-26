import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function VideoPlayer() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const videosData = [
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Big Buck Bunny - Official Blender Open Source Ultra HD Masterpiece",
      creator: "Blender Foundation",
      views: "1.4M views",
      uploaded: "3 days ago",
      duration: "10:00",
      description: "Big Buck Bunny is a short computer-animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation's first film, Elephants Dream, the film was made using Blender, a free software application for 3D computer graphics modeling and animation. Experience premium open-source visual rendering.",
      avatarColor: "from-blue-600 to-indigo-700",
      likes: "42K",
      category: "Animation"
    },
    {
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: "Nature Blooms: Ultra HD Macro Footage of Spring Flowers in 8K",
      creator: "Terra Discovery",
      views: "320K views",
      uploaded: "1 week ago",
      duration: "0:06",
      description: "Stunning macro time-lapse captures flowers blooming in early spring under controlled natural studio lighting. Shot on RED V-Raptor 8K. Marvel at the intricate structures of botanical cells unfolding in high contrast.",
      avatarColor: "from-emerald-500 to-teal-600",
      likes: "18K",
      category: "Nature"
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "How to Build a Modern Web Application with React, Tailwind v4 & Vite",
      creator: "CodeAlchemy Studio",
      views: "89K views",
      uploaded: "2 hours ago",
      duration: "14:20",
      description: "In this comprehensive guide, we build a state-of-the-art video streaming platform from absolute scratch. We will cover custom video controllers, custom tap gesture triggers, responsive layout styling, and RESTful database backend integration.",
      avatarColor: "from-red-500 to-pink-600",
      likes: "9.2K",
      category: "Tech & Dev"
    },
    {
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: "Exploring Hidden Waterfalls Deep in the Oregon Wilderness Forests",
      creator: "Roam & Wander",
      views: "1.2M views",
      uploaded: "5 months ago",
      duration: "8:45",
      description: "Join us as we trek off-grid into the Pacific Northwest forests to find undocumented, breathtaking waterfalls hidden beneath dense canopy and mossy basalt cliffs. Captured using specialized cinematic drones.",
      avatarColor: "from-amber-500 to-orange-600",
      likes: "78K",
      category: "Adventure"
    }
  ]

  const [currentVideo, setCurrentVideo] = useState(0)
  const [watchedSeconds, setWatchedSeconds] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  // Comments state
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])

  // Gesture ripple animation states
  const [leftRipple, setLeftRipple] = useState(false)
  const [rightRipple, setRightRipple] = useState(false)

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  // watch limits
  const limits = {
    free: 300,
    bronze: 420,
    silver: 600,
    gold: Infinity
  }

  const watchLimit = limits[user?.plan || "free"]

  // FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/comments")
      setComments(res.data)
    } catch (error) {
      console.log("Error loading comments", error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  // ADD COMMENT
  const addComment = async () => {
    if (!user) {
      alert("Please login first")
      return
    }
    if (!text.trim()) return

    try {
      const res = await axios.post("http://localhost:5000/api/comments/add", {
        userId: user._id,
        userName: user.name,
        city: user.city,
        text
      })
      setText("")
      fetchComments()
    } catch (error) {
      console.log(error)
      alert("Comment Failed")
    }
  }

  // LIKE COMMENT
  const likeComment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/like/${id}`)
      fetchComments()
    } catch (error) {
      console.log(error)
    }
  }

  // DISLIKE COMMENT
  const dislikeComment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/dislike/${id}`)
      fetchComments()
    } catch (error) {
      console.log(error)
    }
  }

  // TRANSLATE COMMENT
  const translateComment = (commentText) => {
    const translations = {
      "வணக்கம்": "Hello",
      "நன்றி": "Thank You",
      "எப்படி இருக்கிறீர்கள்": "How are you",
      "நமஸ்தே": "Hello",
      "नमस्ते": "Hello",
      "धन्यवाद": "Thank You"
    }
    const translatedText = translations[commentText] || "Translation not found"
    alert("Translated:\n\n" + translatedText)
  }

  // WATCH TIMER & METADATA UPDATE
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    setCurrentTime(current)
    setWatchedSeconds(Math.floor(current))

    // stop if limit reached
    if (current >= watchLimit) {
      videoRef.current.pause()
      setIsPlaying(false)
      setLimitReached(true)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // DOWNLOAD
  const downloadVideo = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/downloads/download",
        {
          userId: user?._id || "guest",
          videoTitle: videosData[currentVideo].title,
          videoUrl: videosData[currentVideo].url
        }
      )

      const link = document.createElement("a")
      link.href = videosData[currentVideo].url
      link.download = "video.mp4"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      alert(error.response?.data?.msg || "Download Failed")
    }
  }

  // PLAY / PAUSE
  const togglePlayPause = () => {
    if (limitReached) return
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // GESTURE: BACKWARD 10S
  const backward10 = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    setLeftRipple(true)
    setTimeout(() => setLeftRipple(false), 600)
  }

  // GESTURE: FORWARD 10S
  const forward10 = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
    setRightRipple(true)
    setTimeout(() => setRightRipple(false), 600)
  }

  // GESTURE: NEXT VIDEO
  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videosData.length)
    setLimitReached(false)
    setWatchedSeconds(0)
    setIsPlaying(true)
  }

  // GESTURE: OPEN COMMENTS
  const openComments = () => {
    window.location.href = "/comments"
  }

  // GESTURE: CLOSE WEBSITE
  const closeWebsite = () => {
    alert("Close Website Gesture Triggered")
  }

  // Click & tap timer config to support Single, Double, Triple Click Gestures
  let clickTimeout = useRef(null)
  let clickCount = useRef(0)

  const handleZoneClick = (e, zone) => {
    e.preventDefault()
    clickCount.current++

    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        if (clickCount.current === 1) {
          togglePlayPause()
        } else if (clickCount.current === 2) {
          if (zone === "left") backward10()
          if (zone === "center") nextVideo()
          if (zone === "right") forward10()
        } else if (clickCount.current === 3) {
          if (zone === "left") openComments()
          if (zone === "right") closeWebsite()
        }
        clickCount.current = 0
      }, 280)
    }
  }

  // Format Time
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  // Handle Timeline Seeking
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value)
    if (seekTime >= watchLimit) {
      setLimitReached(true)
      videoRef.current.currentTime = watchLimit
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      setLimitReached(false)
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  // Volume Change
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (videoRef.current) {
      videoRef.current.volume = v
      setIsMuted(v === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  // Fullscreen Trigger
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Speed Change
  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
    setShowSpeedMenu(false)
  }

  const activeVideo = videosData[currentVideo]

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-6">
      {/* 2-COLUMN VIEWPORT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* LEFT COLUMN: Main Video Player & Details */}
        <div className="lg:col-span-8 flex flex-col">
          {/* THE GORGEOUS VIDEO PLAYER CONTAINER */}
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl group/player"
          >
            <video
              ref={videoRef}
              src={activeVideo.url}
              autoPlay
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-contain"
            />

            {/* HIGH-FIDELITY INTERACTIVE GESTURE CLICK ZONES */}
            <div className="absolute inset-0 flex z-10">
              {/* LEFT THIRD ZONE */}
              <div
                className="w-1/3 h-full cursor-pointer relative"
                onClick={(e) => handleZoneClick(e, "left")}
              >
                {leftRipple && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 flex flex-col items-center justify-center animate-ripple-left pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                      <path d="M12.5 5v14l-8-7 8-7zm8 0v14l-8-7 8-7z" />
                    </svg>
                    <span className="text-[10px] font-bold mt-1">-10s</span>
                  </div>
                )}
              </div>

              {/* CENTER THIRD ZONE */}
              <div
                className="w-1/3 h-full cursor-pointer relative"
                onClick={(e) => handleZoneClick(e, "center")}
              />

              {/* RIGHT THIRD ZONE */}
              <div
                className="w-1/3 h-full cursor-pointer relative"
                onClick={(e) => handleZoneClick(e, "right")}
              >
                {rightRipple && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 flex flex-col items-center justify-center animate-ripple-right pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                      <path d="M4 5v14l8-7-8-7zm8 0v14l8-7-8-7z" />
                    </svg>
                    <span className="text-[10px] font-bold mt-1">+10s</span>
                  </div>
                )}
              </div>
            </div>

            {/* WATCH LIMIT GLASSMORPHIC LOCK SCREEN OVERLAY */}
            {limitReached && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-red-600/35 to-black border border-red-500/30 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Watch Limit Reached</h3>
                  <p className="text-white/70 text-sm mb-6">
                    You have watched <span className="text-red-400 font-bold">{watchedSeconds}s</span> on your <span className="capitalize font-bold text-white">{user?.plan || "free"}</span> plan. Upgrade to a premium tier for extended playback limits!
                  </p>

                  <div className="flex flex-col gap-2 w-full">
                    <Link
                      to="/plans"
                      className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View Premium Plans
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOM SLEEK YOUTUBE-STYLE CONTROL OVERLAYS */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pt-10 pb-3 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 pointer-events-auto flex flex-col gap-2">
              
              {/* TIMELINE PROGRESS SEEKER */}
              <div className="flex items-center w-full">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full cursor-pointer h-1.5 rounded-lg appearance-none bg-white/25 accent-red-600 hover:accent-red-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                {/* LEFT CONTROL BUTTONS */}
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button onClick={togglePlayPause} className="text-white hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Backward 10s */}
                  <button onClick={backward10} className="text-white hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Rewind 10s">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </button>

                  {/* Forward 10s */}
                  <button onClick={forward10} className="text-white hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Fast Forward 10s">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                    </svg>
                  </button>

                  {/* Volume Group */}
                  <div className="flex items-center gap-1.5 group/volume">
                    <button onClick={toggleMute} className="text-white hover:text-red-500 cursor-pointer">
                      {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 4L9.91 6.09 12 8.18V4zm-8.81-.3L1.91 5.03 5.88 9H3v6h4l5 5v-6.88l4.78 4.78c-.85.67-1.8 1.2-2.78 1.45v2.02c1.5-.32 2.87-1.05 4.02-2.05l2.05 2.05 1.33-1.33L3.19 3.7z" />
                        </svg>
                      ) : volume < 0.5 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <path d="M3 9v6h4l5 5V4L9 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-16 transition-all duration-300 h-1 rounded bg-white/20"
                    />
                  </div>

                  {/* Time Counters */}
                  <span className="text-xs text-white/80 font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* RIGHT CONTROL BUTTONS */}
                <div className="flex items-center gap-4 relative">
                  {/* Speed Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="text-xs font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors"
                    >
                      {playbackSpeed === 1 ? "Normal" : `${playbackSpeed}x`}
                    </button>

                    {showSpeedMenu && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowSpeedMenu(false)} />
                        <div className="absolute bottom-8 right-0 bg-[#1e1e1e] border border-white/10 rounded-lg p-1 w-24 flex flex-col z-30 shadow-xl">
                          {[0.5, 1, 1.5, 2].map((s) => (
                            <button
                              key={s}
                              onClick={() => changeSpeed(s)}
                              className={`text-left text-xs px-3 py-1.5 rounded hover:bg-white/5 transition-colors font-medium ${
                                playbackSpeed === s ? "text-red-500 font-bold" : "text-white"
                              }`}
                            >
                              {s === 1 ? "Normal" : `${s}x`}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button onClick={toggleFullscreen} className="text-white hover:text-red-500 transition-colors cursor-pointer" title="Fullscreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ACTIVE VIDEO METADATA INFO */}
          <div className="mt-4 pb-4 border-b border-white/10">
            <div className="flex gap-2 mb-1.5">
              <span className="bg-red-600/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                {activeVideo.category}
              </span>
              {watchedSeconds > 0 && (
                <span className="bg-white/10 text-white/80 px-2 py-0.5 rounded text-xs font-semibold">
                  Watched: {watchedSeconds}s
                </span>
              )}
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold leading-tight mb-3">
              {activeVideo.title}
            </h1>

            {/* CHANNEL ROW & ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeVideo.avatarColor} flex items-center justify-center font-bold text-white shadow-md`}>
                  {activeVideo.creator[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white leading-none mb-1">{activeVideo.creator}</span>
                  <span className="text-xs text-white/50">4.2M subscribers</span>
                </div>
                <button className="ml-4 bg-white text-black font-semibold text-xs py-2 px-4 rounded-full hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-md">
                  Subscribe
                </button>
              </div>

              {/* ACTION PILLS */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <button className="flex items-center gap-1.5 px-4 py-2 hover:bg-white/10 transition-colors text-xs font-semibold border-r border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path d="M7.493 18.75c-.425 0-.82-.233-1.019-.608l-2.037-3.831A.75.75 0 015.05 13.25h3.705L8.05 8.169a.75.75 0 011.3-.68l4.4 7.6a.75.75 0 01-.65 1.127H9.25v2.5a.75.75 0 01-.75.75h-1.007zM16.507 5.25c.425 0 .82.233 1.019.608l2.037 3.831a.75.75 0 01-.613 1.061h-3.705l.706 5.081a.75.75 0 01-1.3.68l-4.4-7.6a.75.75 0 01.65-1.127h3.85v-2.5a.75.75 0 01.75-.75h1.007z" />
                    </svg>
                    {activeVideo.likes}
                  </button>
                  <button className="flex items-center px-3 py-2 hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white/70">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h9m-9-3h9m-9-3h9M3.375 19.5h17.25c.621 0 1.125-.504 1.125-1.125v-13.5C21.75 4.254 21.246 3.75 20.625 3.75H3.375C2.754 3.75 2.25 4.254 2.25 4.875v13.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={downloadVideo}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold py-2 px-4 rounded-full transition-all"
                  title="Download offline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* VIDEO DESCRIPTION ACCORDION */}
            <div className="mt-4 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm leading-relaxed text-white/80 transition-colors">
              <div className="flex gap-3 font-semibold text-white text-xs mb-1">
                <span>{activeVideo.views}</span>
                <span>{activeVideo.uploaded}</span>
              </div>
              <p>{activeVideo.description}</p>
            </div>
          </div>

          {/* EMBEDDED DYNAMIC COMMENTS FEED */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>Comments</span>
              <span className="text-sm font-normal text-white/50">({comments.length})</span>
            </h2>

            {/* Post comment input box */}
            <div className="flex items-start gap-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-initials-gradient text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user ? user.name[0].toUpperCase() : "G"}
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <textarea
                  rows={2}
                  placeholder={user ? "Add a public comment..." : "Login to comment..."}
                  disabled={!user}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:border-red-500 outline-none resize-none transition-colors"
                />
                {user && (
                  <div className="flex justify-end">
                    <button
                      onClick={addComment}
                      disabled={!text.trim()}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all cursor-pointer shadow-md"
                    >
                      Post Comment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Thread */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3 bg-white/5 border border-white/5 p-4 rounded-xl shadow-sm hover:border-white/10 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                      {comment.userName[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-white">{comment.userName}</span>
                        <span className="text-[10px] text-white/40 capitalize bg-white/5 px-1.5 py-0.5 rounded">
                          {comment.city || "earth"}
                        </span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-light">{comment.text}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        {/* Like Button */}
                        <button
                          onClick={() => likeComment(comment._id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-green-500 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                        >
                          👍 {comment.likes}
                        </button>

                        {/* Dislike Button */}
                        <button
                          onClick={() => dislikeComment(comment._id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-red-500 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                        >
                          👎 {comment.dislikes}
                        </button>

                        {/* Translate */}
                        <button
                          onClick={() => translateComment(comment.text)}
                          className="text-[10px] font-bold text-red-500 hover:text-red-400 cursor-pointer ml-auto uppercase tracking-wider"
                        >
                          Translate
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Up Next Sidebar (Recommended Videos) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-base font-bold text-white/90 mb-1 flex items-center gap-2">
            <span>Up Next</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          </h2>

          <div className="flex flex-col gap-3.5">
            {videosData.map((item, idx) => {
              const isSelected = idx === currentVideo
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentVideo(idx)
                    setLimitReached(false)
                    setWatchedSeconds(0)
                    setIsPlaying(true)
                  }}
                  className={`flex gap-3 p-2 rounded-xl cursor-pointer border transition-all duration-300 ${
                    isSelected
                      ? "bg-red-600/10 border-red-500/35 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : "bg-[#181818]/60 hover:bg-[#202020] border-transparent hover:border-white/5"
                  }`}
                >
                  {/* Thumbnail Placeholder Card */}
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-black/60 border border-white/5 flex-shrink-0 flex items-center justify-center group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.avatarColor} opacity-20`} />
                    <span className="text-white/20 font-bold text-xs uppercase tracking-wider">{item.category}</span>
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-bold text-white">
                      {item.duration}
                    </span>
                  </div>

                  {/* Metadata Info */}
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2 mb-1 hover:text-red-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-white/50 hover:text-white transition-colors truncate mb-0.5">
                      {item.creator}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] text-white/40 font-medium">
                      <span>{item.views}</span>
                      <span>•</span>
                      <span>{item.uploaded}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer