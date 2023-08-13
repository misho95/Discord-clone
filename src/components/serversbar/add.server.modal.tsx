import { useState } from "react";
import { zustandShowAddModal } from "../../utils/zustand";

const AddServerModal = () => {
  const [serverName, setServerName] = useState("name's server");
  const showModal = zustandShowAddModal((state) => state.setShowModal);

  return (
    <div onClick={showModal} className="w-full h-screen fixed bg-black/50 z-50">
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="bg-white text-neutral-700 rounded-lg p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4"
      >
        <form className="flex flex-col gap-3">
          <h1 className="text-xl text-center">Customize your server</h1>
          <p className="text-neutral-400 text-sm">
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </p>
          <input type="file" />
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full bg-neutral-200 p-2 rounded-lg"
          />
          <button className="bg-indigo-500 text-white p-2 rounded-lg">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServerModal;
