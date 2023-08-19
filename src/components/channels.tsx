import { useState } from "react";
import {
  userType,
  channelOpen,
  chatLoaded,
  activeServer,
} from "../utils/zustand";
import { addDataInServer, getUid } from "../utils/firebase";
import { v4 } from "uuid";
import { onSnapshot, doc } from "firebase/firestore";
import { db, addNewCategoryChannel } from "../utils/firebase";

const Channels = ({ id, name, channel }) => {
  const [open, setOpen] = useState(false);

  const typeUser = userType((state) => state.type);
  const openChannel = channelOpen((state) => state.open);
  const setOpenChanell = channelOpen((state) => state.setOpen);
  const setLoadedChat = chatLoaded((state) => state.setChatLoaded);
  const serverActive = activeServer((state) => state.active);

  const setNewChatLoaded = async (id) => {
    onSnapshot(doc(db, "chat", id), (doc) => {
      setLoadedChat(doc.data());
    });
  };

  const [openChannelAdd, setOpenChannelAdd] = useState(false);

  const ModalForAddNewCategory = () => {
    const [input, setInput] = useState("");

    const cancel = () => {
      setOpenChannelAdd(false), setInput("");
    };

    const createNewChannel = async () => {
      const ID = v4();
      const uid = await getUid("servers", serverActive);
      await addNewCategoryChannel(uid, id, {
        id: ID,
        name: input,
      });
      await addDataInServer("chat", ID, {
        id: v4(),
        channelId: ID,
        messages: [],
      });
      setOpenChannelAdd(false);
    };

    return (
      <div
        onClick={cancel}
        className="fixed w-full h-screen bg-black/50 z-50 top-0 left-0"
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="fixed top-1/2 left-1/2 bg-neutral-500 w-80 h-fit p-5 flex flex-col gap-3 -translate-x-1/2 -translate-y-1/2 rounded-md"
        >
          <h1 className="text-lg">Create Channel</h1>
          <label className="text-sm flex flex-col gap-1">
            Channel Name
            <input
              type="text"
              className="w-full bg-neutral-700 rounded-md p-1"
              placeholder="new Channel"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </label>
          <div className="flex justify-between">
            <button onClick={cancel}>cancel</button>
            <button
              onClick={createNewChannel}
              disabled={input === "" ? true : false}
              className={`${
                input === "" ? "bg-indigo-400" : "bg-indigo-500"
              } p-1 rounded-md`}
            >
              Create Channel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {openChannelAdd && <ModalForAddNewCategory />}
      <div key={id}>
        <h1 className="flex justify-between">
          <span
            className="cursor-pointer flex gap-1"
            onClick={() => setOpen(!open)}
          >
            <div className={`${open ? "rotate-90" : ""} duration-100`}>
              {">"}
            </div>
            {name}
          </span>
          {typeUser === "owner" && (
            <button
              onClick={() => setOpenChannelAdd(!openChannelAdd)}
              className="text-lg"
            >
              +
            </button>
          )}
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
                    openChannel.id === c.id
                      ? "bg-neutral-600"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex gap-1 items-center">
                    <span className="text-2xl">#</span>
                    {c.name}
                  </div>
                  {typeUser === "owner" && (
                    <button>
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
    </>
  );
};

export default Channels;
