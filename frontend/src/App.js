import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/SignIn/Signin";
import Register from "./pages/Register/Register";
import Homepage from "./pages/Homepage/Homepage";
import Upload from "./pages/Upload/Upload";
import Video from "./pages/Video/Video";
import { VideoProvider } from "./context/VideoContext";
import AppLayout from "./components/AppLayout/AppLayout";
import { DarkModeProvider } from "./context/DarkModeContext";
import { OpenSidebarProvider } from "./context/OpenSidebarContext";
import { UserProvider } from "./context/UserContext";
import UserVideos from "./components/UserVideos/UserVideos";
import VideoDetails from "./components/VideoDetails/VideoDetails";
import UserManagement from "./components/UserManagement/UserManagement";
import { Navbar } from "react-bootstrap";

function App() {
  return (
    // Wrapping the entire application with UserProvider for managing user state
    <UserProvider>
      {/* Wrapping with DarkModeProvider to manage dark mode state */}
      <DarkModeProvider>
        {/* Wrapping with VideoProvider to manage video state */}
        <VideoProvider>
          {/* Wrapping with OpenSidebarProvider to manage sidebar state */}
          <OpenSidebarProvider>
            {/* Setting up routing for the application */}
            <BrowserRouter>
              <Routes>
                {/* Route for the login page */}
                <Route path="/login" element={<Signin />} />
                {/* Route for the registration page */}
                <Route path="/register" element={<Register />} />
                {/* Nested routes under AppLayout for consistent layout */}
                <Route element={<AppLayout />}>
                  {/* Route for the homepage */}
                  <Route path="/" element={<Homepage />} />
                  {/* Route for the upload page */}
                  <Route path="/upload" element={<Upload />} />
                  {/* Route for individual video page */}
                  <Route path="/video/:id" element={<Video />} />
                  {/* Route for user-specific videos page */}
                  <Route path="/videos/:id" element={<UserVideos />} />
                  {/* Route for video details page */}
                  <Route path="/video-details/:id" element={<VideoDetails />} />
                  {/* Route for user management page */}
                  <Route path="/me" element={<UserManagement />} />
                  {/* Catch-all route for undefined paths */}
                  <Route
                    path="*"
                    element={
                      <div>
                        <h1>Page was not found!</h1>
                      </div>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </OpenSidebarProvider>
        </VideoProvider>
      </DarkModeProvider>
    </UserProvider>
  );
}

export default App; // Exporting the App component as the default export
