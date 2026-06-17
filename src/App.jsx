import React from 'react';
import { useAuthStore } from './store/useAuthStore';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="dark">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;
