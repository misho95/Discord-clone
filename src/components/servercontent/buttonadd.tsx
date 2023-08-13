import { friendsActiveBar } from "../../utils/zustand";

const ButtonAdd = ({ id, name }) => {
  const active = friendsActiveBar((state) => state.active);
  const setActive = friendsActiveBar((state) => state.setActive);

  return (
    <button
      onClick={() => setActive(id)}
      className={`${
        active === id
          ? "text-green-400 bg-transparent"
          : "text-white bg-green-600"
      }
      p-1 rounded-md`}
    >
      {name}
    </button>
  );
};

export default ButtonAdd;
