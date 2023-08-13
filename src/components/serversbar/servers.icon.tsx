import { activeServer, zustandShowAddModal } from "../../utils/zustand";
const ServersIcon = ({ id, link, server, handler, name }) => {
  const setActiveserver = activeServer((state) => state.setActive);
  const serverActive = activeServer((state) => state.active);
  const showModal = zustandShowAddModal((state) => state.showModal);
  const setShowModal = zustandShowAddModal((state) => state.setShowModal);
  return (
    <div className="flex gap-2 items-center justify-center relative group">
      <div className="absolute inset-x-24 z-50 bg-neutral-900 py-1 px-2 rounded-md hidden group-hover:block whitespace-nowrap w-fit">
        {name}
      </div>
      {server && serverActive === id && (
        <div className="w-1 h-10 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg"></div>
      )}
      {server && (
        <div className="w-1 h-6 bg-neutral-300 absolute left-0 rounded-tr-lg rounded-br-lg hidden group-hover:block"></div>
      )}
      <div>
        <div
          onClick={
            server
              ? () => {
                  setActiveserver(id), showModal && setShowModal();
                }
              : handler
          }
          className={`${
            serverActive === id
              ? "bg-green-600 text-white"
              : "bg-neutral-700 text-green-600"
          } w-12 h-12 flex items-center justify-center ${
            serverActive === id ? "rounded-xl" : "rounded-full"
          }
          group-hover:rounded-xl group-hover:bg-green-600 group-hover:text-white
          `}
        >
          <span className="material-symbols-outlined text-3xl select-none">
            {link}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServersIcon;
