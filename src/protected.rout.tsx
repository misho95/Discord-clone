import { userSignedIn } from "./utils/zustand";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  onAuthStateChangeListener,
  getUserInfoFromDataBase,
} from "./utils/firebase";

const ProtectedRout = ({ children }) => {
  const navigate = useNavigate();
  const user = userSignedIn((state) => state.currentUser);
  const setUser = userSignedIn((state) => state.setCurrentUser);

  const getUserDataAsync = async (user) => {
    const userData = await getUserInfoFromDataBase(user.uid);
    setUser(userData);
  };

  useEffect(() => {
    const unsubsribe = onAuthStateChangeListener((user) => {
      if (user) {
        getUserDataAsync(user);
      }
      if (!user) {
        navigate("/signin");
      } else if (user) {
        navigate("/");
      }
    });

    return unsubsribe;
  }, []);

  if (user) {
    return children;
  }
};

export default ProtectedRout;
