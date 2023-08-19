import { userSignedIn } from "../../utils/zustand";
import { useState, useEffect } from "react";

const ServersList = ({ id, img, name, users, joinNewServer }) => {
  const [isUserExist, setIsUserExist] = useState(false);
  const currentUser = userSignedIn((state) => state.currentUser);

  useEffect(() => {
    const userInData = users.find((user) => {
      if (user.userName === currentUser.userName) {
        return users;
      }
    });
    if (userInData) {
      setIsUserExist(true);
    } else {
      setIsUserExist(false);
    }
  }, [users]);

  return (
    <div className="w-fit h-fit flex gap-2 p-2">
      <img src={img} className="w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-1">
        <h1>{name}</h1>
        {!isUserExist && (
          <button
            className="bg-indigo-500 px-3 rounded-md"
            onClick={() => joinNewServer(id, name, img)}
          >
            Join
          </button>
        )}
        {isUserExist && (
          <div className="bg-green-600 px-3 rounded-md text-center">Joined</div>
        )}
      </div>
    </div>
  );
};

export default ServersList;
