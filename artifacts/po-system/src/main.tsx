import LogRocket from "logrocket";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize LogRocket only if in production and app ID is available
const logRocketAppId = import.meta.env.VITE_LOGROCKET_APP_ID;
if (logRocketAppId && import.meta.env.PROD) {
  try {
    LogRocket.init(logRocketAppId);

    // Capture unhandled errors
    window.addEventListener("error", (event) => {
      LogRocket.captureException(event.error);
    });

    // Capture unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      LogRocket.captureException(event.reason);
    });
  } catch (error) {
    console.error("Failed to initialize LogRocket:", error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);

