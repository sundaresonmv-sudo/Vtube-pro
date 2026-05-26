import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)

  const registerUser = async () => {
    if (!name || !email || !password || !city || !mobile) {
      alert("Please populate all membership fields")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          city,
          mobile
        }
      )

      alert(res.data.msg || "Registration successful! Welcome aboard.")
      window.location.href = "/login"
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.msg || "Registration Session Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      {/* Dynamic ambient blur backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Main Registration Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 bg-[#151515]/75 shadow-2xl relative z-10">
        
        {/* Header title block */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-600 text-white p-2.5 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.4)] mb-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Create VTube Account</h2>
          <p className="text-xs text-white/50 mt-1">Register now to watch live streams and offline downloads</p>
        </div>

        {/* REGISTRATION FORM FIELDS */}
        <div className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Password</label>
            <input
              type="password"
              placeholder="Password (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* City (MFA Location Target) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider flex justify-between">
              <span>City Location</span>
              <span className="text-[8px] text-red-500 font-medium tracking-normal normal-case">Dictates OTP email/mobile routing</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chennai, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Mobile Number</label>
            <input
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Submit Action */}
          <button
            onClick={registerUser}
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm py-3 px-4 rounded-xl cursor-pointer transition-all shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center text-xs text-white/40">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:text-red-400 font-bold ml-1 transition-colors">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Register