import Button from "../directChat/button";
import UsersProfile from "../users.profile";

const DirectChatContainer = () => {
  const friends = [];

  return (
    <div className="bg-neutral-700 w-80 h-C_H rounded-tl-lg flex flex-col gap-3 relative z-0">
      <div className="h-12 border-b-2 border-neutral-800 flex justify-center items-center">
        <input
          type="text"
          placeholder="find or start a conversation"
          className="bg-neutral-800 rounded-md p-1 w-5/6 text-sm"
        />
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Button id={1} name={"Friends"} icon={"emoji_people"} />
        <Button id={2} name={"Nitro"} icon={"filter_vintage"} />
      </div>
      <div className="p-2">
        <h1 className="flex justify-between items-center">
          Direct Messages <button className="text-xl">+</button>
        </h1>
      </div>
      <div className="text-neutral-500 px-2">
        {friends.length > 0 ? "friends list" : "loading..."}
      </div>
      <UsersProfile />
    </div>
  );
};

export default DirectChatContainer;
