import { Navigate, Route, Routes } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.js";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { useEffect } from "react";
import LoadingPage from "./pages/LoadingPage.jsx";
import TheChronicle from "./pages/HomePages/TheChronicle.jsx";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

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
      <Routes>
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
        <Route index element={<Home />} />

        <Route path="/chronicle" element={<TheChronicle />} />
      </Routes>
    </>
  );
}

export default App;
