import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/legacy.css";
import "./styles/works.css";
import "./styles/blog.css";
import "./styles/business.css";
import "./styles/navigation.css";
import "./styles/cursor.css";
import "./styles/background.css";
import "./styles/react.css";
import "./styles/loading.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
