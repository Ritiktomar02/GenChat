import { Route, Routes, Navigate } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Home from "./pages/Home";
import Project from "./pages/Project";
import GoogleCallback from "./pages/GoogleCallback";
import { useContext, useEffect } from "react";
import UserContext from "./context/UserContext";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { authenticated, user } = useContext(UserContext);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const VerifyEmailRoute = ({ children }) => {
  const { authenticated, user } = useContext(UserContext);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { authenticated, user } = useContext(UserContext);

  if (authenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      {children}
    </div>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
      <Navbar />
      {children}
    </div>
  );
};

const App = () => {
  const { checkingAuth, checkAuth } = useContext(UserContext);

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Protected app routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/project"
        element={
          <ProtectedRoute>
            <Project />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route
        path="/signup"
        element={
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <SignUpPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        }
      />
      <Route
        path="/verify-email"
        element={
          <VerifyEmailRoute>
            <AuthLayout>
              <EmailVerificationPage />
            </AuthLayout>
          </VerifyEmailRoute>
        }
      />

      {/* Google OAuth redirect callback */}
      <Route path="/google-callback" element={<GoogleCallback />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
