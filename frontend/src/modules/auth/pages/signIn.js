import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockClosedIcon } from "@heroicons/react/solid";
import { AuthContext } from "../../../context/Auth.context"; // Import AuthContext

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
  const [error, setError] = useState(null); // State to handle login errors
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required"); // Set error message if username or password is empty
      return;
    }
    try {
      const result = await login(username, password, rememberMe);
      if (result.success) {
        console.log("Login successful");
        navigate("/home");
      } else {
        setError(result.error?.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4 relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <div>
              <a href="#" className="text-blue-500 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Display error message */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Not a member?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up now.
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;