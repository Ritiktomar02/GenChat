import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import UserContext from "../context/user.context";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { setUser } = useContext(UserContext);

  function handleregestration(e) {
    e.preventDefault();

    axios
      .post("/users/register", { email, password })
      .then((res) => {
        toast.success("Account created!");

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
          toast.error(msg || "Registration failed");
        }
      });
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#14B8A6] via-[#06B6D4] to-[#3B82F6] flex items-center justify-center px-4"
    >
      <div
        className="w-full max-w-md bg-white/10 backdrop-blur-lg
                      border border-white/20 shadow-lg p-8 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleregestration} className="space-y-4">
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
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-200 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
