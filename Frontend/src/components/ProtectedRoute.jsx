import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { logout, reset } from '../store/slices/authSlice';
import { API_URL, authConfig } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    const validateToken = async () => {
      if (!user || !token) {
        if (active) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        await axios.get(`${API_URL}/api/auth/me`, authConfig(token));
        if (active) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
      } catch {
        dispatch(logout());
        dispatch(reset());
        if (active) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
      }
    };

    setIsChecking(true);
    validateToken();

    return () => {
      active = false;
    };
  }, [dispatch, token, user]);

  if (isChecking) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        Verifying your session...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
