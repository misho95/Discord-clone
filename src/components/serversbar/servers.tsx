import {
  activeServer,
  zustandShowAddModal,
  serverLoaded,
} from "../../utils/zustand";
import { getDataFromServerByID } from "../../utils/firebase";

const Servers = ({ id, link, name }) => {
  const setActiveserver = activeServer((state) => state.setActive);
  const serverActive = activeServer((state) => state.active);
  const showModal = zustandShowAddModal((state) => state.showModal);
  const setShowModal = zustandShowAddModal((state) => state.setShowModal);
  const setLoadedServer = serverLoaded((state) => state.setCurrentServer);

  const loadNewServer = async () => {
    const serverData = await getDataFromServerByID("servers", id);
    setLoadedServer(serverData[0]);
  };

  return (
    <div className="flex gap-2 items-center justify-center relative group w-20">
      <div className="absolute inset-x-24 z-50 bg-neutral-900 py-1 px-2 rounded-md hidden group-hover:block whitespace-nowrap w-fit">
        {name}
      </div>
      {serverActive === id && (
        <div className="w-1 h-10 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg"></div>
      )}
      <div className="w-1 h-6 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg hidden group-hover:block"></div>
      <div>
        <img
          onClick={() => {
            setActiveserver(id), showModal && setShowModal(), loadNewServer();
          }}
          src={link}
          className={`w-12 ${
            serverActive === id ? "rounded-xl" : "rounded-full"
          }`}
        />
      </div>
    </div>
  );
};

export default Servers;
