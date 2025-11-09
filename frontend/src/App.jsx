import Navbar from './components/Navbar.jsx'
import PostList from './components/PostList.jsx'
import Card from './components/Card.jsx'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { user, showAuthCard, handleAuth } = useAuth();

  // Show auth card if explicitly requested or if no user
  if (showAuthCard || !user) {
    return <Card onAuth={handleAuth} />;
  }

  return (
    <>
      <Navbar />
        <PostList />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
