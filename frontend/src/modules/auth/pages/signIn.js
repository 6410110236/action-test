import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeOffIcon,
} from "@heroicons/react/solid";
import useAuthStore from "../../../store/authStore";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const login = useAuthStore((state) => state.login);
  const isLoginPending = useAuthStore((state) => state.isLoginPending);
  const loginError = useAuthStore((state) => state.loginError);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setError(null);
      const result = await login(
        formData.username.trim(),
        formData.password
      );

      if (result.success) {
        navigate("/home");
      } else {
        throw new Error(result.error?.message || "Invalid username or password");
      }
    } catch (err) {
      setError(err.message);
      setFormData(prev => ({...prev, password: ""}));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoginPending}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="username"
              aria-label="Username"
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoginPending}
              className="w-full pl-10 pr-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="current-password"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
                aria-label="Remember me"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          {(error || loginError) && (
            <div role="alert" className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {typeof (error || loginError) === "string"
                ? error || loginError
                : error?.message || loginError?.message || "An error occurred"}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoginPending}
            className={`w-full p-2 rounded-lg text-white transition ${
              isLoginPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoginPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Not a member?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;