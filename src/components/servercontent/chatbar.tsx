import {
  activeServer,
  friendsActiveBar,
  chatLoaded,
  channelOpen,
  userType,
} from "../../utils/zustand";
import { useState } from "react";

const ChatBar = () => {
  const serverActive = activeServer((state) => state.active);
  const activeFriendsBar = friendsActiveBar((state) => state.active);
  const [input, setInput] = useState("");
  const openChannel = channelOpen((state) => state.open);
  const loadedChat = chatLoaded((state) => state.chatLoaded);
  const typeUser = userType((state) => state.type);

  const data = null;

  if (serverActive === 0) {
    return (
      <div className="bg-neutral-600 w-full h-C_H2 p-2">
        {activeFriendsBar === 4 && (
          <div className="flex justify-center">
            <div className="relative w-4/5 h-10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                className="absolute w-full bg-neutral-800 p-2 rounded-md"
              />
              <button
                disabled={input === "" ? true : false}
                className={`${
                  input === "" ? "bg-indigo-400" : "bg-indigo-500"
                } py-1 px-4 rounded-md absolute right-1 top-1/2 -translate-y-1/2`}
              >
                Send Freind Request
              </button>
            </div>
          </div>
        )}
        {data ? "data" : "loading"}
      </div>
    );
  }

  if (!loadedChat || !openChannel.id) {
    return <div className="bg-neutral-600 w-full h-C_H2 p-2">Loading....</div>;
  }

  return (
    <div className="bg-neutral-600 w-full h-C_H2 p-5">
      <div className="flex flex-col gap-3">
        {loadedChat.messages.map((m) => {
          return (
            <div className="flex gap-2">
              <img src={m.userImg} className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-neutral-400 flex gap-2 items-center">
                  <span
                    className={`${
                      typeUser === "owner"
                        ? "text-white"
                        : typeUser === "moderator"
                        ? "text-yellow-400"
                        : "text-green-400"
                    } text-md`}
                  >
                    {m.userName}
                  </span>
                  <div className="text-xs">
                    {m.date} {m.time}
                  </div>
                </div>
                <div>{m.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBar;
