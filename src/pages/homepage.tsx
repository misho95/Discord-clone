import ChannelsBarContainer from "../components/channelsbarcontainer";
import ServerContentContainer from "../components/servercontentcontainer";
import ServersBarContainer from "../components/serversbarcontainer";

const HomePage = () => {
  return (
    <div className="bg-neutral-800 w-full min-h-screen text-neutral-200 pt-8 flex">
      <div className="fixed top-1 left-1 text-sm text-neutral-500 select-none">
        DISCORD
      </div>
      <ServersBarContainer />
      <ChannelsBarContainer />
      <ServerContentContainer />
    </div>
  );
};

export default HomePage;
