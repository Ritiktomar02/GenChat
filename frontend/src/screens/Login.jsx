import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import UserContext from "../context/user.context";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submithandler(e) {
    e.preventDefault();

    axios
      .post("/users/login", { email, password })
      .then((res) => {
        toast.success("Login successful!");

        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        navigate("/");
      })
      .catch((err) => {
        const data = err.response?.data;

        if (!data) {
          toast.error("Something went wrong");
          return;
        }

        const msg = data.errors || data.error;

        if (Array.isArray(msg)) {
          msg.forEach((m) => toast.error(m.msg));
        } else {
          toast.error(msg || "Invalid credentials");
        }
      });
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#14B8A6] via-[#06B6D4] to-[#3B82F6]  flex items-center justify-center px-4"
    >
      <div
        className="w-full max-w-md bg-white/10 backdrop-blur-lg 
                      border border-white/20 shadow-lg p-8 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Login to GenChat
        </h2>

        <form onSubmit={submithandler} className="space-y-4">
          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-white/10 border border-white/20 
                       placeholder-white/60 focus:outline-none"
          />

          <input
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white/10 border border-white/20 
                       placeholder-white/60 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-800"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-200 underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
