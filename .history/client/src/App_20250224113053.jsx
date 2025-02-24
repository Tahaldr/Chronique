import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.js";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { createContext, useEffect, useRef, useState } from "react";
import LoadingPage from "./pages/LoadingPage.jsx";
import TheChronicle from "./pages/HomePages/TheChronicle.jsx";
import Profile from "./pages/Profile.jsx";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import ScrollRestoration from "./lib/ScrollRestoration.js";
import CommentSidebar from "./components/HomeComponents/ChronicleComps/CommentSidebar.jsx";

export const PostContext = createContext(null);
export const CommentContext = createContext(null);

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  // Post context variables and functions
  const dropdownRef = useRef(null);
  const [optionsPosition, setOptionsPosition] = useState("up");
  const [optionsShow, setOptionsShow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    postId: null,
    confirming: false,
  });
  const [commentHovered, setCommentHovered] = useState({});
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Comment context variables and functions
  const CommentDropdownRef = useRef(null);
  const [commentOptionsPosition, setCommentOptionsPosition] = useState("up");
  const [commentOptionsShow, setCommentOptionsShow] = useState(null);
  const [commentDeleteConfirm, setCommentDeleteConfirm] = useState({
    commentId: null,
    confirming: false,
  });

  // Comment sidebar 

  // Post context value
  const contextValue = {
    dropdownRef,
    setOptionsPosition,
    optionsPosition,
    setOptionsShow,
    optionsShow,
    setDeleteConfirm,
    deleteConfirm,
    setCommentHovered,
    commentHovered,
    setSearchSubmitted,
    searchSubmitted,
  };

  // Comment context value
  const commentContextValue = {
    CommentDropdownRef,
    commentOptionsPosition,
    setCommentOptionsPosition,
    commentOptionsShow,
    setCommentOptionsShow,
    commentDeleteConfirm,
    setCommentDeleteConfirm,
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  if (checkingAuth) {
    return <LoadingPage />;
  }

  return (
    <>
      {/* <CommentSidebar /> */}
      <ScrollToTop /> {/* Add this component here */}
      <PostContext.Provider value={contextValue}>
        <CommentContext.Provider value={commentContextValue}>
          <AnimatePresence mode="wait">
            <ScrollRestoration />
            <Routes location={location} key={location.pathname}>
              {/* Authentication routes */}
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />

              {/* Home routes */}
              <Route path="/" element={<Home />} />

              <Route path="/chronicle" element={<TheChronicle />} />

              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/post/:postId" element={<PostDetails />} />
            </Routes>
          </AnimatePresence>
        </CommentContext.Provider>
      </PostContext.Provider>
    </>
  );
}

export default App;
