import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Comments() {
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])

  const userData = localStorage.getItem("user")
  const user = userData ? JSON.parse(userData) : null

  // fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/comments")
      setComments(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  // add comment
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

  // like comment
  const likeComment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/like/${id}`)
      fetchComments()
    } catch (error) {
      console.log(error)
    }
  }

  // dislike comment
  const dislikeComment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/dislike/${id}`)
      fetchComments()
    } catch (error) {
      console.log(error)
    }
  }

  // translate comment
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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-8 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Global Comments Discussion
            </h1>
            <p className="text-white/50 text-xs mt-1">Share your feedback, reviews, and insights with the community</p>
          </div>
          <Link
            to="/video"
            className="flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Streaming
          </Link>
        </div>

        {/* Input box */}
        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-initials-gradient text-white flex items-center justify-center font-bold text-sm shadow">
            {user ? user.name[0].toUpperCase() : "G"}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <textarea
              rows={3}
              placeholder={user ? `What are your thoughts on this channel, ${user.name}?` : "Sign in to leave a comment..."}
              disabled={!user}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-red-500 focus:bg-black/80 outline-none resize-none transition-all duration-300"
            />
            {user && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40">Posting publicly as {user.name} from {user.city}</span>
                <button
                  onClick={addComment}
                  disabled={!text.trim()}
                  className="btn-premium-red text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none"
                >
                  Publish Comment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Feed List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-semibold text-white/50 px-1 border-b border-white/5 pb-2">
            <span>ALL DISCUSSIONS ({comments.length})</span>
            <span>SORT BY: RECENT</span>
          </div>

          <div className="flex flex-col gap-4">
            {comments.length === 0 ? (
              <div className="glass-card py-16 text-center text-white/30 text-sm rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-white/15 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.35 20.25l3.22-.805a9.81 9.81 0 004.43.805z" />
                </svg>
                No public comments yet. Write a comment to kick off the thread!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="glass-card p-5 rounded-2xl flex gap-4 hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0">
                    {comment.userName[0].toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2.5 mb-1.5 flex-wrap">
                      <span className="font-bold text-sm text-white">{comment.userName}</span>
                      <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded-full capitalize">
                        {comment.city || "global"}
                      </span>
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed font-light mt-1">
                      {comment.text}
                    </p>

                    <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-3">
                      {/* Like Action */}
                      <button
                        onClick={() => likeComment(comment._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-green-400 hover:bg-white/5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083-.205.173-.405.27-.602.197-.4-.078-.898-.523-.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 7.152 4.14 6.5 5 6.5h.828c.447 0 .722-.497.523-.898a12.75 12.75 0 01-.27-.602M5.904 18.75a13.5 13.5 0 004.887 0M5.904 18.75h-.008L5.9 18.75zm0-12.75h.008L5.9 6.002z" />
                        </svg>
                        <span>{comment.likes}</span>
                      </button>

                      {/* Dislike Action */}
                      <button
                        onClick={() => dislikeComment(comment._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-red-400 hover:bg-white/5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all border border-transparent hover:border-white/5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.367 13.5c-.806 0-1.533.446-2.031 1.08a9.041 9.041 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H-3.12c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 01-.068-1.285 11.95 11.95 0 012.649-7.521c.388-.482.987-.729 1.605-.729H2.52c.483 0 .964.078 1.423.23l3.114 1.04c.46.154.964.23 1.423.23h1.463c.889 0 1.713.518 1.972 1.368.14.457.25.926.329 1.405M-4.25 15h-2.25M10.096 5.25c-.083.205-.173.405-.27.602-.197.4.078.898.523.898h.908c.889 0 1.713.518 1.972 1.368a12 12 0 01.521 3.507c0 1.553-.295 3.036-.831 4.398C12.613 16.848 11.86 17.5 11 17.5h-.828c-.447 0-.722.497-.523.898a12.75 12.75 0 01.27.602M10.096 5.25a13.5 13.5 0 00-4.887 0M10.096 5.25h.008L10.1 5.25zm0 12.75h-.008L10.1 18z" />
                        </svg>
                        <span>{comment.dislikes}</span>
                      </button>

                      {/* Translate Action */}
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
    </div>
  )
}

export default Comments