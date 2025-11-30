import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/user.context';
import axios from '../config/axios';

const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    axios.post('/users/register', {
      email,
      password
    })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate('/');
      })
      .catch((err) => {
        console.log(err.response?.data || err);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="bg-[#1b1b1b] p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-800">
        
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">

          <div>
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>

        </form>

        <p className="text-gray-400 mt-5 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline hover:text-blue-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
