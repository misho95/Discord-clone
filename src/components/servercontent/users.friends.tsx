import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const UsersFriends = ({ id, userImg, userName, userId, removeFriend }) => {
  const [userOnline, setUserOnline] = useState(false);

  const setUserData = async (server, id) => {
    onSnapshot(doc(db, server, id), (doc) => {
      setUserOnline(doc.data().userOnline);
    });
  };

  useEffect(() => {
    setUserData("users", userId);
  }, []);

  return (
    <div
      key={id}
      className="flex items-center justify-between w-full hover:bg-neutral-500 p-2 rounded-md"
    >
      <div className="flex gap-2 items-center relative">
        <img src={userImg} className="w-10 h-10 rounded-full" />
        <div
          className={`w-3 h-3 ${
            userOnline ? "bg-green-600" : "bg-red-600"
          }  rounded-full absolute bottom-0 left-8 z-10 border-2 border-neutral-700`}
        ></div>
        {userName}
      </div>
      <div className="flex gap-2">
        <button className="bg-neutral-700 p-2 rounded-full flex">
          <span className="material-symbols-outlined">chat</span>
        </button>
        <button
          onClick={() => removeFriend(userId)}
          className="bg-neutral-700 p-1 rounded-md text-red-500"
        >
          Remove Friend
        </button>
      </div>
    </div>
  );
};

export default UsersFriends;
