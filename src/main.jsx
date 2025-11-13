import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import "./index.css";
import App from "./App.jsx";

// Configure Amplify - try to load outputs, fallback gracefully
let outputs;
try {
  outputs = require("../amplify_outputs.json");
  if (outputs && outputs.auth && outputs.auth.user_pool_id) {
    Amplify.configure(outputs);
  }
} catch (e) {
  console.warn("Amplify config not loaded");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
