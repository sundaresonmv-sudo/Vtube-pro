import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpNotice, setOtpNotice] = useState("")

  const loginUser = async () => {
    if (!email || !password) {
      alert("Please fill in all credentials")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )

      const user = res.data.user

      // south india cities
      const southCities = [
        "chennai",
        "bangalore",
        "hyderabad",
        "kochi",
        "vijayawada"
      ]

      // generate 6-digit OTP
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString()

      setGeneratedOtp(otp)

      // Notify user visually inside the premium UI instead of just a raw blocking alert!
      if (southCities.includes(user.city?.toLowerCase())) {
        setOtpNotice(`An OTP verification code was sent to your registered Email: ${user.email}`)
        alert(`[OTP SENT TO EMAIL] OTP: ${otp}`)
      } else {
        setOtpNotice(`An OTP verification code was sent to your registered Mobile: ${user.mobile}`)
        alert(`[OTP SENT TO MOBILE] OTP: ${otp}`)
      }

      setOtpSent(true)
      localStorage.setItem(
        "tempUser",
        JSON.stringify(res.data)
      )
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.msg || "Login Session Failed. Validate credentials.")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = () => {
    if (!enteredOtp) return

    if (enteredOtp === generatedOtp) {
      const userData = JSON.parse(
        localStorage.getItem("tempUser")
      )

      localStorage.setItem("token", userData.token)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.removeItem("tempUser")

      alert("Welcome to VTube Pro! Login Successful.")
      window.location.href = "/video"
    } else {
      alert("Invalid OTP code. Please verify again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 bg-[#151515]/75 shadow-2xl relative z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-600 text-white p-2.5 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.4)] mb-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Sign In to VTube Pro</h2>
          <p className="text-xs text-white/50 mt-1">Unlock seamless offline video downloads and Creator Studio</p>
        </div>

        {/* INPUT FORM CONTENT */}
        {!otpSent ? (
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={loginUser}
              disabled={loading}
              className="w-full mt-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-xl cursor-pointer transition-all shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Continue to OTP"
              )}
            </button>
          </div>
        ) : (
          /* OTP VERIFICATION CONTENT */
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* OTP Notice Info Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs leading-relaxed text-amber-400">
              <span className="font-bold block mb-1">🔒 MFA Security Authorization</span>
              {otpNotice}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Verification OTP Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP code"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] font-mono placeholder-white/20 text-white outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl cursor-pointer transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99]"
            >
              Verify & Complete Sign In
            </button>

            <button
              onClick={() => setOtpSent(false)}
              className="text-xs text-white/40 hover:text-white/60 transition-colors text-center font-semibold cursor-pointer underline decoration-dotted"
            >
              Back to edit credentials
            </button>
          </div>
        )}

        {/* Card footer links */}
        {!otpSent && (
          <div className="mt-8 text-center text-xs text-white/40">
            Don't have a VTube Pro account?{" "}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-bold ml-1 transition-colors">
              Sign up free
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login