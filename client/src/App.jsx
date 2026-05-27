import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Navbar from "./components/Navbar"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Comments from "./pages/Comments"
import VideoPlayer from "./pages/VideoPlayer"
import Downloads from "./pages/Downloads"
import Plans from "./pages/Plans"
import VideoCall from "./pages/VideoCall"

function App() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/comments"
          element={
            user
              ? <Comments />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/video"
          element={
            user
              ? <VideoPlayer />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/downloads"
          element={
            user
              ? <Downloads />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/plans"
          element={
            user
              ? <Plans />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/videocall"
          element={
            user
              ? <VideoCall />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App