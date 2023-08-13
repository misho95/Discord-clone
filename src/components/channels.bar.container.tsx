import { activeServer, serverLoaded } from "../utils/zustand";
import Channels from "./channels";
import DirectChatContainer from "./directChat/direct.chat.container";
import UsersProfile from "./users.profile";

const ChannelsBarContainer = () => {
  const serverActive = activeServer((state) => state.active);
  const loadedServer = serverLoaded((state) => state.currentServer);

  if (serverActive === 0) {
    return <DirectChatContainer />;
  }

  if (serverActive === 99) {
    return (
      <div className="bg-neutral-700 w-80 h-C_H rounded-tl-lg relative z-0">
        Explore Servers
        <UsersProfile />
      </div>
    );
  }

  if (!loadedServer) {
    return (
      <div className="bg-neutral-700 w-80 h-C_H rounded-tl-lg relative z-0">
        loading....
        <UsersProfile />
      </div>
    );
  }

  return (
    <div className="bg-neutral-700 w-80 h-C_H rounded-tl-lg relative z-0">
      <div className="h-12 border-b-2 border-neutral-800">
        <button className="hover:bg-neutral-600 w-full h-full rounded-tl-lg text-left p-3">
          {loadedServer.name}
        </button>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {loadedServer.channels.map((c) => {
          return <Channels id={c.id} name={c.name} channel={c.channel} />;
        })}
      </div>
      <UsersProfile />
    </div>
  );
};

export default ChannelsBarContainer;
