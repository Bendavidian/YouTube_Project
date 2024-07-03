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
    <UserProvider>
      <DarkModeProvider>
        <VideoProvider>
          <OpenSidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Signin />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/video/:id" element={<Video />} />
                  <Route path="/videos/:id" element={<UserVideos />} />
                  <Route path="/video-details/:id" element={<VideoDetails />} />
                  <Route path="/me" element={<UserManagement />} />
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

export default App;
