import { activeServer, serverLoaded, userType } from "../utils/zustand";
import Channels from "./channels";
import DirectChatContainer from "./directChat/direct.chat.container";
import UsersProfile from "./users.profile";
import { useState } from "react";
import { addNewServerChannel, getServerUid } from "../utils/firebase";
import { v4 } from "uuid";

const ChannelsBarContainer = () => {
  const serverActive = activeServer((state) => state.active);
  const loadedServer = serverLoaded((state) => state.currentServer);
  const typeOfUser = userType((state) => state.type);
  const [openServerSettings, setOpenServerSettings] = useState(false);
  const [openAddNewCategoryModal, setOpenNewCategoryModal] = useState(false);

  const ModalForAddNewCategory = () => {
    const [input, setInput] = useState("");

    const cancel = () => {
      setOpenNewCategoryModal(false), setInput("");
    };

    const createNewCategory = async () => {
      const uid = await getServerUid(serverActive);
      await addNewServerChannel(uid, {
        id: v4(),
        name: input,
        channel: [],
      });
    };

    return (
      <div onClick={cancel} className="fixed w-full h-screen bg-black/50">
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="fixed top-1/2 left-1/2 bg-neutral-500 w-80 h-fit p-5 flex flex-col gap-3 -translate-x-1/2 -translate-y-1/2 rounded-md"
        >
          <h1 className="text-lg">Create Category</h1>
          <label className="text-sm flex flex-col gap-1">
            Category Name
            <input
              type="text"
              className="w-full bg-neutral-700 rounded-md p-1"
              placeholder="new category"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </label>
          <div className="flex justify-between">
            <button onClick={cancel}>cancel</button>
            <button
              onClick={createNewCategory}
              disabled={input === "" ? true : false}
              className={`${
                input === "" ? "bg-indigo-400" : "bg-indigo-500"
              } p-1 rounded-md`}
            >
              Create Category
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        {openAddNewCategoryModal && <ModalForAddNewCategory />}
        {openServerSettings && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-neutral-800 w-60 p-2 rounded-lg flex flex-col gap-2 z-20">
            {typeOfUser === "owner" && (
              <button
                onClick={() => {
                  setOpenNewCategoryModal(!openAddNewCategoryModal),
                    setOpenServerSettings(false);
                }}
                className="w-full flex justify-between"
              >
                Create Category
                <span className="material-symbols-outlined">
                  create_new_folder
                </span>
              </button>
            )}
            {typeOfUser === "owner" ? (
              <button className="w-full flex justify-between">
                Delete Server
                <span className="material-symbols-outlined">delete</span>
              </button>
            ) : (
              <button className="w-full flex justify-between">
                Leave Server
                <span className="material-symbols-outlined">exit_to_app</span>
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setOpenServerSettings(!openServerSettings)}
          className="hover:bg-neutral-600 w-full h-full rounded-tl-lg text-left p-3"
        >
          {loadedServer.name}
        </button>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {loadedServer.channels.map((c) => {
          return (
            <Channels key={c.id} id={c.id} name={c.name} channel={c.channel} />
          );
        })}
      </div>
      <UsersProfile />
    </div>
  );
};

export default ChannelsBarContainer;
