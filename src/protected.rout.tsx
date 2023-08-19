import { userSignedIn } from "./utils/zustand";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChangeListener } from "./utils/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./utils/firebase";

const ProtectedRout = ({ children }) => {
  const navigate = useNavigate();
  const user = userSignedIn((state) => state.currentUser);
  const setUser = userSignedIn((state) => state.setCurrentUser);

  const setUserData = async (server, id) => {
    onSnapshot(doc(db, server, id), (doc) => {
      setUser(doc.data());
    });
  };

  useEffect(() => {
    const unsubsribe = onAuthStateChangeListener((user) => {
      if (user) {
        setUserData("users", user.uid);
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
