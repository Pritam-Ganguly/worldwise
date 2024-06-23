import React, { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContextProvider";
import { useNavigate } from "react-router-dom";

const ProtectedNavigation: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated){
        navigate('/');
    }
  }, [isAuthenticated, navigate])

  return isAuthenticated ? children : null;
};

export default ProtectedNavigation;
