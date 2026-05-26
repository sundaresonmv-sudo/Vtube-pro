import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Navbar from "./components/Navbar"

import Login from "./pages/login"
import Register from "./pages/Register"
import Comments from "./pages/Comments"
import Plans from "./pages/Plans"
import VideoPlayer from "./pages/VideoPlayer"
import Downloads from "./pages/Downloads"
import VideoCall from "./pages/VideoCall"
function App() {

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  // south indian cities
  const southCities = [

    "chennai",
    "bangalore",
    "hyderabad",
    "kochi",
    "vijayawada"

  ]

  // current hour
  const hour =
    new Date().getHours()

  // light theme condition
  const isLightTheme =

    user &&

    southCities.includes(
      user.city?.toLowerCase()
    ) &&

    hour >= 10 &&
    hour <= 12

  return (

    <div

      style={{
  backgroundColor: isLightTheme
    ? "white"
    : "black",

  color: isLightTheme
    ? "black"
    : "white",

  minHeight: "100vh"
     }}

    >

      <Navbar />

      <Routes>

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
          path="/plans"
          element={
            user
              ? <Plans />
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
          path="/videocall"
          element={
            user
              ? <VideoCall />
              : <Navigate to="/login" />
            }
        />

        <Route
          path="*"
          element={
            <Navigate to="/video" />
          }
        />

      </Routes>

    </div>

  )

}

export default App