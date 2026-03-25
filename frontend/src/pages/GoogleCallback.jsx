import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useContext(UserContext);

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const redirectUri = window.location.origin + "/google-callback";
      googleLogin(code, redirectUri).then((success) => {
        navigate(success ? "/" : "/login");
      });
    } else {
      navigate("/login");
    }
  }, []);

  return <LoadingSpinner />;
};

export default GoogleCallback;
