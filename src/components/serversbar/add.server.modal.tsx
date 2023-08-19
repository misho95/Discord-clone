import { useState } from "react";
import { zustandShowAddModal, userSignedIn } from "../../utils/zustand";
import { ref, uploadBytes } from "firebase/storage";
import {
  storage,
  addDataInServer,
  getImgUrl,
  updateDataInServer,
} from "../../utils/firebase";

import { v4 } from "uuid";

const AddServerModal = () => {
  const currentUser = userSignedIn((state) => state.currentUser);
  const showModal = zustandShowAddModal((state) => state.setShowModal);
  const [serverName, setServerName] = useState(
    `${currentUser.userName}'s server`
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const createNewServerInDataBase = (e) => {
    e.preventDefault();
    if (file === null) {
      setError("Please Upload File");
      return;
    }

    const type = file.type.slice(0, 5);

    if (type !== "image") {
      setError("Upload Only Images");
      return;
    }

    const imageRef = ref(storage, `images/${file.name + v4()}`);
    uploadBytes(imageRef, file)
      .then(async (f) => {
        const url = await getImgUrl(f.metadata.fullPath);
        return url;
      })
      .then((url) => {
        const ID = v4();
        const obj = {
          id: v4(),
          name: serverName,
          img: url,
          users: [
            {
              id: currentUser.id,
              userName: currentUser.userName,
              userImg: currentUser.userImg,
              userType: "owner",
            },
          ],
          channels: [
            {
              id: v4(),
              name: "text channels",
              channel: [
                {
                  id: ID,
                  name: "general",
                },
              ],
            },
          ],
        };
        addDataInServer("servers", v4(), obj);
        setServerName(currentUser.userName + "'s server");
        setFile("");
        showModal();
        addDataInServer("chat", ID, {
          id: v4(),
          channelId: ID,
          messages: [],
        });
        return obj;
      })
      .then((obj) => {
        updateDataInServer("users", "joinedServers", currentUser.id, {
          id: obj.id,
          img: obj.img,
          name: obj.name,
        });
      });
  };

  return (
    <div onClick={showModal} className="w-full h-screen fixed bg-black/50 z-50">
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="bg-white text-neutral-700 rounded-lg p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4"
      >
        <form
          onSubmit={createNewServerInDataBase}
          className="flex flex-col gap-3"
        >
          <h1 className="text-xl text-center">Customize your server</h1>
          <p className="text-neutral-400 text-sm">
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </p>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full bg-neutral-200 p-2 rounded-lg"
          />
          <button className="bg-indigo-500 text-white p-2 rounded-lg">
            Create
          </button>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddServerModal;
