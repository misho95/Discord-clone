import { activeServer, serverLoaded, channelOpen } from "../../utils/zustand";
import { getUserImgUrl } from "../../utils/firebase";

const ActiveBar = () => {
  const serverActive = activeServer((state) => state.active);
  const loadedServer = serverLoaded((state) => state.currentServer);
  const openChannel = channelOpen((state) => state.open);

  const getImgUrlFromUser = async (id) => {
    const url = await getUserImgUrl(id);
    return url;
  };

  if (serverActive === 0) {
    return (
      <div className="w-80 h-C_H2 bg-neutral-700 p-2 flex flex-col gap-2">
        <h1 className="text-lg">Active Now</h1>
        <h2 className="text-center">It's Quiet for now</h2>
        <p className="text-neutral-500 text-center">
          When a friend starts an activity-like playing a game or hanging out on
          voice-we'll showit here!
        </p>
      </div>
    );
  }

  if (serverActive === 99) {
    return;
  }

  if (!loadedServer || !openChannel.id) {
    return <div className="w-80 h-C_H2 bg-neutral-700">Loading...</div>;
  }

  return (
    <div className="w-80 h-C_H2 bg-neutral-700 p-5 flex flex-col gap-3">
      {loadedServer.users.map((usr) => {
        return (
          <div key={usr.id} className="flex gap-2 items-center">
            {console.log(getImgUrlFromUser(usr.id))}
            <img src={usr.userImg} className="w-10 h-10  rounded-full" />
            <span
              className={`${
                usr.userType === "owner"
                  ? "text-white"
                  : usr.userType === "moderator"
                  ? "text-yellow-400"
                  : "text-green-400"
              } text-md`}
            >
              {usr.userName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveBar;
