import { directChatActive } from "../../utils/zustand";

const Button = ({ id, name, icon }) => {
  const active = directChatActive((state) => state.active);
  const setActive = directChatActive((state) => state.setActive);

  return (
    <button
      onClick={() => setActive(id)}
      className={`flex justify-start gap-2 bg items-center w-full ${
        active === id ? "bg-neutral-600" : ""
      } hover:bg-neutral-600 p-2 rounded-lg`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {name}
    </button>
  );
};

export default Button;
