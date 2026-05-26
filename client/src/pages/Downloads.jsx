import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Downloads() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const fetchDownloads = async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await axios.get(
        `http://localhost:5000/api/downloads/${user._id}`
      )
      setDownloads(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDownloads()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-8 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Offline Downloads Library
            </h1>
            <p className="text-white/50 text-xs mt-1">Access your saved videos directly without internet buffering. Exclusive Premium feature.</p>
          </div>
          <Link
            to="/video"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
          >
            Browse Videos
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white/50 font-medium">Fetching download manifest...</span>
          </div>
        ) : downloads.length === 0 ? (
          /* Empty State */
          <div className="glass-card py-20 rounded-2xl text-center max-w-lg mx-auto flex flex-col items-center p-8 border border-white/5 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No Offline Downloads</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              You haven't saved any videos offline yet. Click the "Download" button on any video page to save them here for offline playback.
            </p>
            <Link
              to="/video"
              className="bg-white hover:bg-white/90 text-black font-semibold text-xs px-6 py-3 rounded-full transition-all shadow hover:scale-105 active:scale-95"
            >
              Find Videos to Download
            </Link>
          </div>
        ) : (
          /* Download Cards Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <div
                key={item._id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/5"
              >
                {/* Simulated Thumbnail */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-white/5">
                  {/* Decorative background visual */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-indigo-600/10 to-transparent group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Glowing Checkmark Badge */}
                  <div className="absolute top-2 right-2 bg-emerald-500/20 backdrop-blur text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Offline Saved
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12 text-white/20 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300">
                    <path d="M8 5v14l11-7z" />
                  </svg>

                  <div className="absolute bottom-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white/90">
                    MP4 Format
                  </div>
                </div>

                {/* Card Content Info */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                      {item.videoTitle || "Untitled Downloaded Video"}
                    </h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-semibold">
                      Stored locally on browser cache
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                    <span className="text-[10px] font-medium text-white/50">Size: ~12.4 MB</span>
                    
                    <a
                      href={item.videoUrl}
                      download
                      className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Download Again
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Downloads