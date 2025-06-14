import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import OnboardingFlow from './components/Auth/OnboardingFlow';
import Dashboard from './components/Admin/Dashboard';
import MenuDisplay from './components/Public/MenuDisplay';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu/:restaurantId" element={<MenuDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;