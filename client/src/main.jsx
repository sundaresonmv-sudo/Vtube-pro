import React from "react"
import ReactDOM from "react-dom/client"
import axios from "axios"

import {
  BrowserRouter
} from "react-router-dom"

import App from "./App"

import "./index.css"

// Global Axios Interceptor to dynamically handle sandboxed & production deployments
axios.interceptors.request.use((config) => {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"
  if (config.url && config.url.startsWith("http://localhost:5000")) {
    config.url = config.url.replace("http://localhost:5000", baseURL)
  }
  return config
})

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </React.StrictMode>

)