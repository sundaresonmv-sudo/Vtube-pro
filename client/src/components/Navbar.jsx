import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const logout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "VT"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between">
      {/* LEFT SECTION: Logo */}
      <div className="flex items-center gap-6">
        <Link to="/video" className="flex items-center gap-2 group">
          <div className="bg-red-600 text-white p-1.5 rounded-lg group-hover:bg-red-500 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            {/* YouTube-like Play icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-red-500 bg-clip-text text-transparent group-hover:text-red-400 transition-colors">
            VTube<span className="text-xs ml-1 bg-red-600/20 text-red-500 px-1.5 py-0.5 rounded font-semibold align-middle uppercase tracking-widest border border-red-500/20">Pro</span>
          </span>
        </Link>
      </div>

      {/* CENTER SECTION: Realistic Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <div className="flex w-full rounded-full overflow-hidden border border-white/10 bg-white/5 focus-within:border-red-500/50 focus-within:bg-black/40 transition-all duration-300 shadow-inner">
          <input
            type="text"
            placeholder="Search creators, videos, streams..."
            className="flex-1 bg-transparent px-5 py-2 text-sm text-white placeholder-white/40 outline-none border-none"
          />
          <button className="bg-white/5 hover:bg-white/10 px-6 border-l border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </button>
        </div>
      </div>

      {/* RIGHT SECTION: Navigation & User Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {user && (
          <div className="flex items-center gap-1 sm:gap-2 mr-2">
            {/* Live studio icon */}
            <Link
              to="/videocall"
              className={`p-2 rounded-full hover:bg-white/5 transition-all relative group ${
                isActive("/videocall") ? "text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
              }`}
              title="Go Live Studio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-pulse border border-black" />
            </Link>

            {/* Downloads Link */}
            <Link
              to="/downloads"
              className={`p-2 rounded-full hover:bg-white/5 transition-all ${
                isActive("/downloads") ? "text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
              }`}
              title="Offline Downloads"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </Link>

            {/* Comments Link */}
            <Link
              to="/comments"
              className={`p-2 rounded-full hover:bg-white/5 transition-all ${
                isActive("/comments") ? "text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
              }`}
              title="Global Comments"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </Link>

            {/* Premium Plans Link */}
            <Link
              to="/plans"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                user.plan && user.plan !== "free"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
              title="Pricing Plans"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span>{user.plan || "Free"}</span>
            </Link>
          </div>
        )}

        {user ? (
          /* Profile Avatar & Dropdown */
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 rounded-full bg-initials-gradient text-white font-bold text-sm flex items-center justify-center border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {getInitials(user.name)}
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-3 w-64 glass-panel rounded-xl shadow-2xl border border-white/10 p-4 z-20 flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="w-10 h-10 rounded-full bg-initials-gradient flex items-center justify-center font-bold text-white shadow">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-white truncate">{user.name}</span>
                      <span className="text-xs text-white/50 truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-white/70">
                    <div className="flex justify-between py-1">
                      <span>Current Plan:</span>
                      <span className="font-semibold text-amber-400 capitalize">{user.plan || "free"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>User City:</span>
                      <span className="font-semibold text-white capitalize">{user.city || "N/A"}</span>
                    </div>
                    {user.mobile && (
                      <div className="flex justify-between py-1">
                        <span>Mobile:</span>
                        <span className="font-semibold text-white">{user.mobile}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={logout}
                    className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Auth links */
          <div className="flex gap-2">
            <Link
              to="/login"
              className="text-sm text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm bg-white text-black hover:bg-white/90 px-4 py-2 rounded-full transition-all font-semibold shadow"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar