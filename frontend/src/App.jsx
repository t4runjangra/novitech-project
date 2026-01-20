import { useContext } from 'react';
import './App.css'
import LoginPage from './pages/login.jsx';
import RegisterForm from './components/SignupForm.jsx';
import { AuthContext } from './context/AuthContext.jsx';
import Dashboard from './pages/dashboard.jsx';
import { Routes , Route ,Navigate} from 'react-router-dom';
function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
export default App
