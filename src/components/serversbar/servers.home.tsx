import { activeServer, zustandShowAddModal } from "../../utils/zustand";

const ServersHome = ({ id, link, name }) => {
  const setActiveserver = activeServer((state) => state.setActive);
  const serverActive = activeServer((state) => state.active);
  const showModal = zustandShowAddModal((state) => state.showModal);
  const setShowModal = zustandShowAddModal((state) => state.setShowModal);
  return (
    <div className="flex gap-2 items-center justify-center relative group w-full h-fit">
      <div className="absolute inset-x-24 z-50 bg-neutral-900 py-1 px-2 rounded-md hidden group-hover:block whitespace-nowrap w-fit">
        {name}
      </div>
      {serverActive === id && (
        <div className="w-1 h-10 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg"></div>
      )}
      <div className="w-1 h-6 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg hidden group-hover:block"></div>
      <div>
        <div
          className={`${
            serverActive === id ? "bg-indigo-500" : "bg-neutral-700"
          } px-2 py-3 w-12 ${
            serverActive === id ? "rounded-xl" : "rounded-full"
          }`}
        >
          <img
            onClick={() => {
              setActiveserver(id), showModal && setShowModal();
            }}
            src={link}
            className="w-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ServersHome;
