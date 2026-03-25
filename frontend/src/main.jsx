import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserProvider.jsx";
import ProjectProvider from "./context/ProjectProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <UserProvider>
        <ProjectProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <App />
        </ProjectProvider>
      </UserProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);