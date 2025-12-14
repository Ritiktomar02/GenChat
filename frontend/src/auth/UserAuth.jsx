import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user.context";
import axios from "../config/axios";

const UserAuth = ({ children }) => {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post("/users/profile");
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default UserAuth;
