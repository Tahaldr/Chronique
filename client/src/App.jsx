import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from './stores/useUserStore.js';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import { createContext, useEffect, useRef, useState } from 'react';
import LoadingPage from './pages/LoadingPage.jsx';
import TheChronicle from './pages/HomePages/TheChronicle.jsx';
import Profile from './pages/Profile.jsx';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop.jsx';
import PostDetails from './pages/PostDetails.jsx';
import ScrollRestoration from './lib/ScrollRestoration.js';
import CommentSidebar from './components/HomeComponents/ChronicleComps/CommentSidebar.jsx';
import { Toaster } from 'react-hot-toast';
import { setGlobalNavigate } from './lib/navigation.js.js';
import CreatePost from './pages/CreatePost.jsx';

export const PostContext = createContext(null);
export const CommentContext = createContext(null);
export const AdminDashboardContext = createContext(null);

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate); // store navigate globally
  }, [navigate]);

  // Post context variables and functions
  const dropdownRef = useRef(null);
  const [optionsPosition, setOptionsPosition] = useState('up');
  const [optionsShow, setOptionsShow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    postId: null,
    confirming: false,
  });
  const [commentHovered, setCommentHovered] = useState({});
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Comment context variables and functions
  const CommentDropdownRef = useRef(null);
  const [commentOptionsPosition, setCommentOptionsPosition] = useState('up');
  const [commentOptionsShow, setCommentOptionsShow] = useState(null);
  const [commentDeleteConfirm, setCommentDeleteConfirm] = useState({
    commentId: null,
    confirming: false,
  });

  // Comment sidebar variables and functions
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(null);

  // Admin Dashboard variables and functions
  const [usersSearch_Term, setUsersSearch_Term] = useState('');
  const [usersSearch_FinalTerm, setUsersSearch_FinalTerm] = useState('');
  const [usersSearch_Submitted, setUsersSearch_Submitted] = useState(false);
  const [filterUsers, setFilterUsers] = useState('all');
  const [reportsToggled, setReportsToggled] = useState(false);
  const [reportSelected, setReportSelected] = useState(null);

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
    commentSidebarOpen,
    setCommentSidebarOpen,
  };

  // Admin Dashboard context value
  const adminDashboardContextValue = {
    usersSearch_Term,
    setUsersSearch_Term,
    usersSearch_FinalTerm,
    setUsersSearch_FinalTerm,
    usersSearch_Submitted,
    setUsersSearch_Submitted,
    filterUsers,
    setFilterUsers,
    reportsToggled,
    setReportsToggled,
    reportSelected,
    setReportSelected,
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  if (checkingAuth) {
    return <LoadingPage />;
  }

  return (
    <>
      {/* Toast */}
      <Toaster />
      {/* Comment sidebar */}
      <AnimatePresence>
        {commentSidebarOpen && (
          <PostContext.Provider value={contextValue}>
            <CommentContext.Provider value={commentContextValue}>
              <CommentSidebar postId={commentSidebarOpen} />
            </CommentContext.Provider>
          </PostContext.Provider>
        )}
      </AnimatePresence>
      {/* Routes */}
      <ScrollToTop /> {/* Add this component here */}
      <PostContext.Provider value={contextValue}>
        <CommentContext.Provider value={commentContextValue}>
          <AdminDashboardContext.Provider value={adminDashboardContextValue}>
            <AnimatePresence mode='wait'>
              <ScrollRestoration />
              <Routes location={location} key={location.pathname}>
                {/* Authentication routes */}
                <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />

                {/* Home routes */}
                <Route path='/' element={<Home />} />

                <Route path='/chronicle' element={<TheChronicle />} />

                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/post/:postId' element={<PostDetails />} />
                <Route path='/create' element={!user ? <Home /> : <CreatePost />} />
              </Routes>
            </AnimatePresence>
          </AdminDashboardContext.Provider>
        </CommentContext.Provider>
      </PostContext.Provider>
    </>
  );
}

export default App;
