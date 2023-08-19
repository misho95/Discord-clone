import {
  activeServer,
  directChatActive,
  channelOpen,
  requestNotification,
} from "../../utils/zustand";
import Button from "./button";
import ButtonAdd from "./buttonadd";

const ServerContentHeader = () => {
  const serverActive = activeServer((state) => state.active);
  const directActiveChat = directChatActive((state) => state.active);
  const openChannel = channelOpen((state) => state.open);
  const ifRequestNotification = requestNotification((state) => state.number);

  if (serverActive === 0) {
    return directActiveChat === 1 ? (
      <div className="bg-neutral-600 h-12 border-b-2 border-neutral-800 flex items-center px-5 gap-3">
        <h1 className="flex gap-2 justify-start items-center">
          <span className="material-symbols-outlined">emoji_people</span>
          Friends
        </h1>
        <Button id={0} name={"Online"} />
        <Button id={1} name={"All"} />
        <Button id={2} name={"Pending"} />
        <div className="w-fit h-fit relative">
          <Button id={5} name={"Requests"} />
          {ifRequestNotification && (
            <div className="absolute bg-red-600 rounded-full text-red-200 -right-3 -top-3 w-6 h-6 flex items-center justify-center">
              {ifRequestNotification}
            </div>
          )}
        </div>
        <Button id={3} name={"Blocked"} />
        <ButtonAdd id={4} name={"Add Friend"} />
      </div>
    ) : (
      directActiveChat === 2 && (
        <div className="bg-neutral-600 h-12 border-b-2 border-neutral-800 flex items-center px-5 gap-3">
          <h1 className="flex gap-2 justify-start items-center">
            <span className="material-symbols-outlined">filter_vintage</span>
            Nitro
          </h1>
        </div>
      )
    );
  }

  if (serverActive === 99) {
    return;
  }

  if (!openChannel) {
    <div className="bg-neutral-600 h-12 border-b-2 border-neutral-800 p-2">
      loading...
    </div>;
  }

  return (
    <div className="bg-neutral-600 h-12 border-b-2 border-neutral-800 p-2 flex items-center gap-1">
      <span className="text-xl text-neutral-400">#</span>
      {openChannel.name}
    </div>
  );
};

export default ServerContentHeader;
