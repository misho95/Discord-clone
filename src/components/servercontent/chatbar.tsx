import {
  activeServer,
  friendsActiveBar,
  chatLoaded,
  channelOpen,
  userType,
  userSignedIn,
} from "../../utils/zustand";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import {
  addNewMessageInChat,
  getDataFromServerBySubId,
  getAllDataFromServer,
  userJoinServer,
  addUserInServer,
  getServerUid,
} from "../../utils/firebase";
import Message from "./message";

const ChatBar = () => {
  const serverActive = activeServer((state) => state.active);
  const activeFriendsBar = friendsActiveBar((state) => state.active);
  const [input, setInput] = useState("");
  const openChannel = channelOpen((state) => state.open);
  const loadedChat = chatLoaded((state) => state.chatLoaded);
  const setLoadedChat = chatLoaded((state) => state.setChatLoaded);
  const typeUser = userType((state) => state.type);
  const currentUser = userSignedIn((state) => state.currentUser);
  const chatBox = useRef(null);
  const [allServersList, setAllServersList] = useState();
  const [replayTo, setReplayTo] = useState(null);

  const waitAllDataFromServer = async () => {
    const data = await getAllDataFromServer("servers");
    setAllServersList(data);
  };

  useEffect(() => {
    waitAllDataFromServer();
  }, []);

  const data = null;

  const [message, setMessage] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (replayTo) {
        replayMessage(
          replayTo.id,
          replayTo.userName,
          replayTo.img,
          replayTo.message,
          replayTo.type
        );
      } else {
        submitNewMessage();
      }
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages change or component mounts
    scrollToBottom();
  }, [loadedChat]);

  const submitNewMessage = async () => {
    const date = new Date();
    const addNewMessage = {
      id: v4(),
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      message: message,
      date: date.toString(),
      userType: typeUser,
    };

    await addNewMessageInChat(loadedChat.channelId, addNewMessage);
    const data = await getDataFromServerBySubId("chat", loadedChat.channelId);
    console.log(data);
    setLoadedChat(data[0]);
  };

  const joinNewServer = async (id, name, img) => {
    await userJoinServer(currentUser.id, { id, name, img });
    const uid = await getServerUid(id);
    await addUserInServer(uid, {
      id: currentUser.id,
      userImg: currentUser.userImg,
      userName: currentUser.userName,
      userType: "user",
    });
  };

  const replayMessage = async (id, user, img, mes, type) => {
    const date = new Date();
    const addNewMessage = {
      id: v4(),
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      message: message,
      date: date.toString(),
      userType: typeUser,
      replay: {
        id: id,
        userName: user,
        userImg: img,
        message: mes,
        type,
      },
    };

    await addNewMessageInChat(loadedChat.channelId, addNewMessage);
    const data = await getDataFromServerBySubId("chat", loadedChat.channelId);
    console.log(data);
    setLoadedChat(data[0]);
  };

  const getDataFromReply = (id, img, type, userName, date, message) => {
    setReplayTo({ id, img, type, userName, date, message });
  };

  if (serverActive === 0) {
    return (
      <div className="bg-neutral-600 w-full h-C_H2 p-2">
        {activeFriendsBar === 4 && (
          <div className="flex justify-center">
            <div className="relative w-4/5 h-10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                className="absolute w-full bg-neutral-800 p-2 rounded-md"
              />
              <button
                disabled={input === "" ? true : false}
                className={`${
                  input === "" ? "bg-indigo-400" : "bg-indigo-500"
                } py-1 px-4 rounded-md absolute right-1 top-1/2 -translate-y-1/2`}
              >
                Send Freind Request
              </button>
            </div>
          </div>
        )}
        {data ? "data" : "loading"}
      </div>
    );
  }

  if (serverActive === 99) {
    return (
      <div className="bg-neutral-600 w-full h-C_H p-2">
        {allServersList.map((ser) => {
          return (
            <div key={ser.id} className="w-fit flex gap-2 p-2">
              <img src={ser.img} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <h1>{ser.name}</h1>
                <button
                  className="bg-indigo-500 px-3 rounded-md"
                  onClick={() => joinNewServer(ser.id, ser.name, ser.img)}
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-600 w-full h-C_H2 p-5 flex flex-col gap-10">
        <div
          className="flex flex-col gap-3 h-C_H3 overflow-y-auto"
          ref={chatBox}
        >
          {loadedChat?.messages.map((m) => {
            return (
              <Message
                id={m.id}
                img={m.userImg}
                type={m.userType}
                userName={m.userName}
                date={m.date}
                message={m.message}
                replay={m.replay}
                getDataFromReply={getDataFromReply}
              />
            );
          })}
        </div>
        <div className="w-full h-20 relative">
          {replayTo && (
            <span className="absolute -top-10">
              replay to {replayTo.userName}{" "}
              <button
                className="bg-indigo-500 rounded-md p-1"
                onClick={() => setReplayTo(null)}
              >
                cancel
              </button>
            </span>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-fit bg-neutral-700 rounded-md resize-none focus:outline-none p-2"
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default ChatBar;
