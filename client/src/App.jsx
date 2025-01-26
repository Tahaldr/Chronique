import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.js";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { createContext, useEffect } from "react";
import LoadingPage from "./pages/LoadingPage.jsx";
import TheChronicle from "./pages/HomePages/TheChronicle.jsx";
import Profile from "./pages/Profile.jsx";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop.jsx";

export const PostContext = createContext(null);

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

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
      <ScrollToTop /> {/* Add this component here */}
      <AnimatePresence mode="wait">
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
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
