import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import "./index.css";
import App from "./App.jsx";

// Configure Amplify - handle missing or placeholder config gracefully
try {
  const outputs = require("../amplify_outputs.json");
  // Only configure if not placeholder
  if (outputs && !outputs.auth?.user_pool_id?.includes("PLACEHOLDER")) {
    Amplify.configure(outputs);
  } else {
    console.warn("Amplify backend not configured. App will work in demo mode.");
  }
} catch (error) {
  console.warn("Could not load amplify_outputs.json:", error);
  console.warn("App will work in demo mode without backend.");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
