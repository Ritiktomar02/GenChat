import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user.context";
import axios from "../config/axios";

const UserAuth = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      if (user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post("/users/profile");
        setUser(res.data.user);
      } catch (err) {
        console.log(err)
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, user, navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default UserAuth;
