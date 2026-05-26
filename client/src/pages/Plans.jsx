import axios from "axios"

function Plans() {
  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const buyPlan = async (amount, plan) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      )

      const options = {
        key: "rzp_test_StduPeTiIQvQFR",
        amount: res.data.amount,
        currency: "INR",
        name: "VTube Premium",
        description: plan.toUpperCase() + " Subscription Plan",
        order_id: res.data.id,
        handler: async function () {
          // update user plan
          await axios.put(
            "http://localhost:5000/api/payment/update-plan",
            {
              userId: user._id,
              plan
            }
          )

          // update local storage
          user.plan = plan
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          )

          alert(plan.toUpperCase() + " Plan Activated Successfully!")
          window.location.href = "/video"
        },
        theme: {
          color: "#dc2626" // YouTube red theme accent
        }
      }

      const razor = new window.Razorpay(options)
      razor.open()
    } catch (error) {
      console.log(error)
      alert("Payment Session Failed")
    }
  }

  const features = [
    { name: "Sleek Ad-Free Buffering", bronze: true, silver: true, gold: true },
    { name: "HD Content Rendering", bronze: true, silver: true, gold: true },
    { name: "Creator Studio Streaming Tools", bronze: false, silver: true, gold: true },
    { name: "High Bitrate Stereo Audio", bronze: false, silver: true, gold: true },
    { name: "Infinite Offline Downloads", bronze: false, silver: false, gold: true },
    { name: "Unlimited 4K Playback Hours", bronze: false, silver: false, gold: true },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-10 flex flex-col items-center">
      {/* Top Banner Header */}
      <div className="text-center max-w-2xl mb-12">
        <span className="bg-red-600/10 text-red-500 border border-red-500/25 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          VTube Premium Passes
        </span>
        <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tight leading-none bg-gradient-to-b from-white via-white to-red-500 bg-clip-text text-transparent">
          Unlock Unlimited Streaming
        </h1>
        <p className="text-sm text-white/50 mt-3 leading-relaxed">
          Upgrade your catalog and unlock ad-free streaming, offline high-fidelity caching, live studio tools, and extended watch durations. Choose a tier tailored for you.
        </p>
      </div>

      {/* TIER CARDS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
        {/* Bronze Plan Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col relative border border-white/5 bg-[#181818]/45">
          <div className="mb-4">
            <span className="text-[10px] bg-orange-800/20 text-orange-400 border border-orange-500/15 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
              Bronze Tier
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹10</h2>
          <span className="text-[11px] text-white/40 font-medium">Valid for 7 minutes of active streaming</span>
          
          <div className="border-t border-white/10 my-4 pt-4 flex-1">
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                7 Minutes Watch Timer
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                HD Playback Quality
              </li>
              <li className="flex items-center gap-2 text-white/30 line-through">
                Studio Streaming Panel
              </li>
              <li className="flex items-center gap-2 text-white/30 line-through">
                Unlimited Downloads Manifest
              </li>
            </ul>
          </div>

          <button
            onClick={() => buyPlan(10, "bronze")}
            className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer transition-all border border-white/10 hover:border-orange-500/40"
          >
            Choose Bronze Pass
          </button>
        </div>

        {/* Silver Plan Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col relative border border-white/5 bg-[#181818]/45">
          <div className="mb-4">
            <span className="text-[10px] bg-slate-500/20 text-slate-300 border border-slate-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
              Silver Tier
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹50</h2>
          <span className="text-[11px] text-white/40 font-medium">Valid for 10 minutes of active streaming</span>
          
          <div className="border-t border-white/10 my-4 pt-4 flex-1">
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                10 Minutes Watch Timer
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Creator Studio Access
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                High Bitrate Audio Stream
              </li>
              <li className="flex items-center gap-2 text-white/30 line-through">
                Unlimited Downloads Manifest
              </li>
            </ul>
          </div>

          <button
            onClick={() => buyPlan(50, "silver")}
            className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer transition-all border border-white/10 hover:border-slate-400/40"
          >
            Choose Silver Pass
          </button>
        </div>

        {/* Gold Plan Card (MOST POPULAR - GLOWING GRADIENT BORDER) */}
        <div className="glass-card rounded-3xl p-6 flex flex-col relative bg-[#181818]/65 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] overflow-hidden scale-[1.03]">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] bg-red-600/20 text-red-500 border border-red-500/35 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
              Gold Tier
            </span>
            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-red-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
              Unlimited
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹100</h2>
          <span className="text-[11px] text-white/40 font-medium">Valid for lifetime infinite watching</span>
          
          <div className="border-t border-white/10 my-4 pt-4 flex-1">
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2 font-semibold text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-amber-400 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.178-.388.74-.388.918 0l2.082 5.006 5.404.433c.42.034.587.55.287.848l-4.118 3.528 1.258 5.272c.097.41-.34.728-.707.528L12 18.354l-4.72 2.883c-.367.2-.804-.117-.707-.528l1.257-5.272-4.117-3.528c-.3-.298-.133-.814.288-.848l5.404-.433 2.082-5.006z" />
                </svg>
                Infinite Streaming Cap (No limits)
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Studio Streaming Panel
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                High Bitrate Audio Stream
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Unlimited Downloads Manifest
              </li>
            </ul>
          </div>

          <button
            onClick={() => buyPlan(100, "gold")}
            className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl cursor-pointer transition-all shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Upgrade to Gold
          </button>
        </div>
      </div>

      {/* Comparative Feature Matrix Title */}
      <div className="mt-16 w-full max-w-3xl glass-card rounded-2xl p-6 border border-white/5">
        <h3 className="text-base font-bold mb-4 text-white/90">Exclusive Feature Index</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 font-semibold">
                <th className="py-2.5">Core Features</th>
                <th className="py-2.5 text-center">Bronze</th>
                <th className="py-2.5 text-center">Silver</th>
                <th className="py-2.5 text-center">Gold</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b border-white/5 text-white/80 hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium">{f.name}</td>
                  <td className="py-3 text-center">
                    {f.bronze ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {f.silver ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {f.gold ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Plans