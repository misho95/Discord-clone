import AddServerModal from "../components/serversbar/add.server.modal";
import ChannelsBarContainer from "../components//channels.bar.container";
import ServerContentContainer from "../components/servercontent/servercontentcontainer";
import ServersBarContainer from "../components/serversbar/serversbarcontainer";
import {
  zustandShowAddModal,
  serverLoaded,
  userSignedIn,
  userType,
  requestNotification,
} from "../utils/zustand";
import { useEffect } from "react";
import { updateUserStatus, getUserInfoFromDataBase } from "../utils/firebase";

const HomePage = () => {
  const showAddModal = zustandShowAddModal((state) => state.showModal);
  const loadedServer = serverLoaded((state) => state.currentServer);
  const userActive = userSignedIn((state) => state.currentUser);
  const setUserAcive = userSignedIn((state) => state.setCurrentUser);
  const setUserType = userType((state) => state.setType);
  const setNewRequestNotif = requestNotification((state) => state.setNumber);

  useEffect(() => {
    const findUserInServer = loadedServer?.users.find((usr) => {
      if (userActive.id === usr.id) return usr;
    });
    if (findUserInServer) {
      setUserType(findUserInServer.userType);
    }
  }, [loadedServer]);

  useEffect(() => {
    const waitToUpdate = async (val) => {
      await updateUserStatus(userActive.id, val);
      const updated = await getUserInfoFromDataBase(userActive.id);
      setUserAcive(updated);
    };
    waitToUpdate(true);

    const handleBeforeUnload = () => {
      waitToUpdate(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const notif = userActive?.friendsRequests?.reduce((val, el) => {
      return val + 1;
    }, 0);
    setNewRequestNotif(notif > 0 ? notif : null);
  }, [userActive]);

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
