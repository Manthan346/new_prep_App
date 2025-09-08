import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({
          general: result.message || 'Login failed'
        });
      }
    } catch (error) {
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Sign In container with no background image */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-lg font-normal text-gray-800">
              Placement Tracking System
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6"> 
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="error-text">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="error-text">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Right: Background image only */}
      <div className="hidden md:block flex-2 bg-[url('/src/assets/corpimg.jpeg')] bg-cover bg-center"></div>
    </div>
  );
};

export default Login;