import { Navigate, Route, Routes } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.js";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
