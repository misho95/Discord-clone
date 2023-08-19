import { userSignedIn } from "../utils/zustand";
import { useState } from "react";
import {
  signOutUser,
  updateUserStatus,
  updateUserTime,
} from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const UsersProfile = () => {
  const userAccount = userSignedIn((state) => state.currentUser);
  const setNewUser = userSignedIn((state) => state.setCurrentUser);

  if (!userAccount) {
    return <div>loading...</div>;
  }

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const waitUpdateUserTime = async (id) => {
    await updateUserTime(id);
  };

  const signOut = async () => {
    waitUpdateUserTime(userAccount.id);
    await signOutUser();
    setNewUser(null);
    navigate("/signin");
    await updateUserStatus(userAccount.id, false);
  };

  return (
    <div className="bg-neutral-800 absolute bottom-0 w-full p-2 flex gap-2">
      <div
        onClick={() => setOpen(!open)}
        className="flex gap-2 hover:bg-neutral-700 p-2 rounded-lg relative z-0"
      >
        {open && (
          <div
            className="absolute -top-14"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button className="bg-indigo-500 p-2 rounded-lg" onClick={signOut}>
              SignOut
            </button>
          </div>
        )}
        <div className="relative w-8 h-8">
          <div
            className={`w-3 h-3 ${
              userAccount.userOnline ? "bg-green-600" : "bg-red-600"
            }  rounded-full absolute bottom-0 right-0 z-10 border-2 border-neutral-700`}
          ></div>
          <img
            src={userAccount.userImg}
            className="w-8 h-8 rounded-full absolute"
          />
        </div>
        <div className="text-xs text-neutral-300">
          <p>{userAccount.userName}</p>
          <p>{userAccount.userOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
