import { useState } from "react";
import { userType, channelOpen, chatLoaded } from "../utils/zustand";
import { getDataFromServerBySubId } from "../utils/firebase";

const Channels = ({ id, name, channel }) => {
  const [open, setOpen] = useState(false);
  const typeUser = userType((state) => state.type);
  const openChannel = channelOpen((state) => state.open);
  const setOpenChanell = channelOpen((state) => state.setOpen);
  const setLoadedChat = chatLoaded((state) => state.setChatLoaded);

  const setNewChatLoaded = async (id) => {
    const loaded = await getDataFromServerBySubId("chat", id);
    setLoadedChat(loaded[0]);
  };

  return (
    <div key={id}>
      <h1 className="flex justify-between">
        <span
          className="cursor-pointer flex gap-1"
          onClick={() => setOpen(!open)}
        >
          <div className={`${open ? "rotate-90" : ""} duration-100`}>{">"}</div>
          {name}
        </span>
        {typeUser === "owner" && <button className="text-lg">+</button>}
      </h1>
      {open && (
        <div className="flex flex-col gap-2">
          {channel.map((c) => {
            return (
              <div
                key={c.id}
                onClick={() => {
                  setOpenChanell(c.id, c.name), setNewChatLoaded(c.id);
                }}
                className={`text-neutral-400 flex justify-between items-center p-2 rounded-lg ${
                  openChannel.id === c.id ? "bg-neutral-600" : "bg-transparent"
                }`}
              >
                <div className="flex gap-1 items-center">
                  <span className="text-2xl">#</span>
                  {c.name}
                </div>
                {typeUser === "owner" && (
                  <button className="">
                    <span className="material-symbols-outlined text-sm">
                      settings
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Channels;
