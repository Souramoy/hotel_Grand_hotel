
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Lock, User } from 'lucide-react';
import api from '../../utils/api';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the API client to login
      const { username, password } = credentials;
      
      // Add debug logging
      console.log('Attempting login with:', { username, passwordLength: password.length });
      
      // Temporary solution: Use the hard-coded credentials directly
      if (username === 'admin' && password === 'hotel123') {
        console.log('Login successful with hardcoded credentials');
        const mockToken = 'mock-admin-token';
        onLogin(mockToken);
        navigate('/admin/dashboard');
        return;
      }
      
      // Try API login
      console.log('Attempting API login...');
      const response = await api.login(username, password);
      console.log('API Response:', response);
      
      if (response.success && response.token) {
        onLogin(response.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Hotel className="h-16 w-16 text-yellow-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage hotel content</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Demo Credentials:</p>
            <p className="text-sm text-gray-500">Username: admin</p>
            <p className="text-sm text-gray-500">Password: hotel123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;