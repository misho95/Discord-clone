import ActiveBar from "./activerBar";
import ChatBar from "./chatbar";
import ServerContentHeader from "./servercontentheader";

const ServerContentContainer = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <ServerContentHeader />
      </div>
      <div className="w-full flex">
        <ChatBar />
        <ActiveBar />
      </div>
    </div>
  );
};

export default ServerContentContainer;
