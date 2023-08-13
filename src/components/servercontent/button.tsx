import { friendsActiveBar } from "../../utils/zustand";

const Button = ({ id, name }) => {
  const active = friendsActiveBar((state) => state.active);
  const setActive = friendsActiveBar((state) => state.setActive);

  return (
    <button
      onClick={() => setActive(id)}
      className={`${active === id ? "bg-neutral-500" : ""} ${
        active === id ? "text-white" : "text-neutral-400"
      } p-1 rounded-md`}
    >
      {name}
    </button>
  );
};

export default Button;
