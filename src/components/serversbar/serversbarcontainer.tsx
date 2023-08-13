import Servers from "./servers";
import ServersHome from "./servers.home";
import ServersIcon from "./servers.icon";
import { zustandShowAddModal, userSignedIn } from "../../utils/zustand";

const ServersBarContainer = () => {
  const showModal = zustandShowAddModal((state) => state.setShowModal);
  const userAccount = userSignedIn((state) => state.currentUser);

  return (
    <div className="w-20 h-C_H flex flex-col gap-2">
      <ServersHome
        id={0}
        link={"src/assets/imgs/discord.png"}
        name={"Direct Messages"}
      />
      {userAccount.joinedServers.map((ser) => {
        return (
          <Servers key={ser.id} id={ser.id} link={ser.img} name={ser.name} />
        );
      })}
      <ServersIcon
        id={null}
        link={"add"}
        server={false}
        handler={showModal}
        name={"Add Server"}
      />
      <ServersIcon
        id={99}
        link={"explore"}
        server={true}
        handler={null}
        name={"Explore Discoverable Servers"}
      />
    </div>
  );
};

export default ServersBarContainer;
