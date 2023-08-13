import { userSignedIn } from "../utils/zustand";

const UsersProfile = () => {
  const userAccount = userSignedIn((state) => state.currentUser);

  if (!userAccount) {
    return <div>loading...</div>;
  }

  return (
    <div className="bg-neutral-800 absolute bottom-0 w-full p-2 flex gap-2">
      <div className="flex gap-2 hover:bg-neutral-700 p-2 rounded-lg">
        <div className="relative w-8 h-8">
          <div
            className={`w-3 h-3 ${
              userAccount.isUserOnline ? "bg-green-600" : "bg-red-600"
            }  rounded-full absolute bottom-0 right-0 z-10 border-2 border-neutral-700`}
          ></div>
          <img
            src={userAccount.userImg}
            className="w-8 h-8 rounded-full absolute"
          />
        </div>
        <div className="text-xs text-neutral-300">
          <p>{userAccount.userName}</p>
          <p>{userAccount.isUserOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
