import { activeServer } from "../../utils/zustand";

const ActiveBar = () => {
  const serverActive = activeServer((state) => state.active);

  if (serverActive === 0) {
    return (
      <div className="w-80 h-C_H2 bg-neutral-700 p-2 flex flex-col gap-2">
        <h1 className="text-lg">Active Now</h1>
        <h2 className="text-center">It's Quiet for now</h2>
        <p className="text-neutral-500 text-center">
          When a friend starts an activity-like playing a game or hanging out on
          voice-we'll showit here!
        </p>
      </div>
    );
  }

  return <div className="w-80 h-C_H2 bg-neutral-700">Active</div>;
};

export default ActiveBar;
