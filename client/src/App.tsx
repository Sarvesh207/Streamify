import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoutes from './components/auth/ProtectedRoutes';
import PublicRoutes from './components/auth/PublicRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoDetail from './pages/VideoDetail';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import LikedVideos from './pages/LikedVideos';
import History from './pages/History';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Subscriptions from './pages/Subscriptions';
import Search from './pages/Search';
import Channel from './pages/Channel';
import { Bounce, ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store/store'



function App() {
  return (
    <Provider store={store}>

      <Router>
        <Routes>
          <Route element={<AuthLayout><Outlet /></AuthLayout>}>
            {/* Public Routes - Only accessible when NOT logged in */}
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes - Only accessible when logged in */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/community" element={
                <Layout>
                  <Community />
                </Layout>
              } />
              <Route path="/profile" element={
                <Layout>
                  <Profile />
                </Layout>
              } />
              <Route path="/analytics" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/settings" element={
                <Layout>
                  <Settings />
                </Layout>
              } />
              <Route path="/liked" element={<Layout><LikedVideos /></Layout>} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/collection" element={<Layout><Playlists /></Layout>} />
              <Route path="/playlist/:id" element={<Layout><PlaylistDetail /></Layout>} />
              <Route path="/subscribers" element={<Layout><Subscriptions /></Layout>} />
            </Route>

            {/* Open Routes - Accessible by anyone, but Layout might show different nav items */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/video/:id" element={
              <Layout>
                <VideoDetail />
              </Layout>
            } />
            <Route path="/search" element={<Layout><Search /></Layout>} />
            <Route path="/c/:username" element={<Layout><Channel /></Layout>} />

            {/* Catch all */}
            <Route path="*" element={
              <Layout>
                <div className="flex items-center justify-center h-64">
                  <h2 className="text-2xl font-bold text-gray-500">Page Not Found</h2>
                </div>
              </Layout>
            } />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Provider>
  );
}

export default App;
