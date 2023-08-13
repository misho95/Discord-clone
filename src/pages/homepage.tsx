import AddServerModal from "../components/serversbar/add.server.modal";
import ChannelsBarContainer from "../components//channels.bar.container";
import ServerContentContainer from "../components/servercontent/servercontentcontainer";
import ServersBarContainer from "../components/serversbar/serversbarcontainer";
import {
  zustandShowAddModal,
  serverLoaded,
  userSignedIn,
  userType,
} from "../utils/zustand";
import { useEffect } from "react";

const HomePage = () => {
  const showAddModal = zustandShowAddModal((state) => state.showModal);
  const loadedServer = serverLoaded((state) => state.currentServer);
  const userActive = userSignedIn((state) => state.currentUser);
  const setUserType = userType((state) => state.setType);

  useEffect(() => {
    const findUserInServer = loadedServer.users.find((usr) => {
      if (userActive.id === usr.id) return usr;
    });
    if (findUserInServer) {
      setUserType(findUserInServer.type);
    }
  }, []);

  return (
    <div className="bg-neutral-900 w-full min-h-screen text-neutral-200 pt-8 flex">
      <div className="fixed top-1 left-1 text-sm text-neutral-500 select-none">
        DISCORD
      </div>
      {showAddModal && <AddServerModal />}
      <ServersBarContainer />
      <ChannelsBarContainer />
      <ServerContentContainer />
    </div>
  );
};

export default HomePage;
