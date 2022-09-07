import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import Profile from "./pages/Profile/Profile";
import LogIn from "./pages/LogIn/LogIn";
import ForumHomePage from "./pages/Forum/ForumHomePage";
import ForumPost from "./pages/Forum/ForumPost";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="profile/:id" element={<Profile />} />
        <Route path="login" element={<LogIn />} />
        <Route path="forum" element={<ForumHomePage />} />
        <Route path="forum/:id" element={<ForumHomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
