import {
  activeServer,
  friendsActiveBar,
  chatLoaded,
  userType,
  userSignedIn,
  loadedDirectChat,
} from "../../utils/zustand";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import {
  addNewMessageInChat,
  userJoinServer,
  addUserInServer,
  findUserByUserName,
  getServerUid,
  updateUserFriendRequests,
  updateUserFriendRequestsPending,
  findUserById,
  removeObjectFromArray,
  addNewFriendInUsers,
  getUserInfoFromDataBase,
  addDataInServer,
  addNewMessageInDirectChat,
  getServerTimestamp,
} from "../../utils/firebase";
import Message from "./message";
import ServersList from "./servers.lists";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";
import UsersFriends from "./users.friends";

const ChatBar = () => {
  const serverActive = activeServer((state) => state.active);
  const activeFriendsBar = friendsActiveBar((state) => state.active);
  const [input, setInput] = useState("");
  const loadedChat = chatLoaded((state) => state.chatLoaded);
  const typeUser = userType((state) => state.type);
  const currentUser = userSignedIn((state) => state.currentUser);
  const chatBox = useRef(null);
  const [allServersList, setAllServersList] = useState([]);
  const [replayTo, setReplayTo] = useState(null);
  const [replayToDirectChat, setReaplyToDirectChat] = useState(null);
  const directChatLoaded = loadedDirectChat((state) => state.chat);
  const [directChatMessage, setDirectChatMessage] = useState("");

  const waitAllDataFromServer = async () => {
    onSnapshot(collection(db, "servers"), (querySnapshot) => {
      const serverData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        serverData.push(data);
      });
      setAllServersList(serverData);
    });
  };

  useEffect(() => {
    waitAllDataFromServer();
  }, []);

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
        setReplayTo(null);
      } else {
        submitNewMessage();
      }
      setMessage("");
    }
  };

  const handleKeyDownOnDirectMessages = (event) => {
    if (event.key === "Enter") {
      if (replayToDirectChat) {
        replayMessageToDirectChat(
          replayToDirectChat.id,
          replayToDirectChat.userName,
          replayToDirectChat.img,
          replayToDirectChat.message,
          replayToDirectChat.type
        );
        setReaplyToDirectChat(null);
      } else {
        submitNewMessageInDirectChat();
      }
      setDirectChatMessage("");
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
  };

  const submitNewMessageInDirectChat = async () => {
    const date = new Date();
    const addNewMessage = {
      id: v4(),
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      message: directChatMessage,
      userType: "owner",
      date: date.toString(),
    };

    await addNewMessageInDirectChat(directChatLoaded.id, addNewMessage);
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
  };

  const getDataFromReplyDirectChat = (
    id,
    img,
    type,
    userName,
    date,
    message
  ) => {
    setReaplyToDirectChat({ id, img, type, userName, date, message });
  };

  const replayMessageToDirectChat = async (id, user, img, mes, type) => {
    const date = new Date();
    const addNewMessage = {
      id: v4(),
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      message: directChatMessage,
      date: date.toString(),
      userType: "owner",
      replay: {
        id: id,
        userName: user,
        userImg: img,
        message: mes,
        type,
      },
    };

    await addNewMessageInDirectChat(directChatLoaded.id, addNewMessage);
  };

  const getDataFromReply = (id, img, type, userName, date, message) => {
    setReplayTo({ id, img, type, userName, date, message });
  };

  const sendFriendRequest = async () => {
    const respons = await findUserByUserName(input);
    if (respons) {
      const findIfUserIsAlreadyFriend = currentUser.userFriends.find((user) => {
        if (user.userName === input) {
          return user;
        }
      });

      if (!findIfUserIsAlreadyFriend) {
        await updateUserFriendRequests(respons[0].id, {
          id: v4(),
          userId: currentUser.id,
          userName: currentUser.userName,
          accept: false,
        });
        await updateUserFriendRequestsPending(currentUser.id, {
          id: v4(),
          userId: respons[0].id,
          userName: respons[0].userName,
          accept: false,
        });
      }
    }
  };

  const denideRequest = async (id) => {
    findUserById(currentUser.id)
      .then((userRef) => {
        if (userRef) {
          removeObjectFromArray(userRef, "friendsRequests", id);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    findUserById(id)
      .then((userRef) => {
        if (userRef) {
          removeObjectFromArray(
            userRef,
            "friendsRequestsPending",
            currentUser.id
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const acceptFriendRequest = async (userId) => {
    const ID = v4();

    await addDataInServer("directChat", ID, {
      id: ID,
      messages: [],
    });

    await denideRequest(userId);
    await addNewFriendInUsers(userId, {
      id: v4(),
      userId: currentUser.id,
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      chatId: ID,
    });
    findUserById(userId).then((userRef) => {
      getUserInfoFromDataBase(userRef.id).then((user) => {
        addNewFriendInUsers(currentUser.id, {
          id: v4(),
          userId: user.id,
          userName: user.userName,
          userImg: user.userImg,
          chatId: ID,
        });
      });
    });
  };

  const removeFriend = (id) => {
    findUserById(currentUser.id)
      .then((userRef) => {
        if (userRef) {
          removeObjectFromArray(userRef, "userFriends", id);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    findUserById(id)
      .then((userRef) => {
        if (userRef) {
          removeObjectFromArray(userRef, "userFriends", currentUser.id);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const cancelRequest = async (id) => {
    findUserById(id).then((userRef) => {
      if (userRef) {
        removeObjectFromArray(userRef, "friendsRequests", currentUser.id);
      }
    });
    findUserById(currentUser.id).then((userRef) => {
      if (userRef) {
        removeObjectFromArray(userRef, "friendsRequestsPending", id);
      }
    });
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
                placeholder="add friends by discord username"
              />
              <button
                onClick={sendFriendRequest}
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
        {activeFriendsBar === 1 && (
          <div className="flex flex-wrap p-5">
            {currentUser.userFriends.map((user) => {
              return (
                <UsersFriends
                  key={user.id}
                  id={user.id}
                  userImg={user.userImg}
                  userName={user.userName}
                  userId={user.userId}
                  chatId={user.chatId}
                  removeFriend={removeFriend}
                />
              );
            })}
          </div>
        )}
        {activeFriendsBar === 2 && (
          <div>
            <h1>Pending...</h1>
            {currentUser?.friendsRequestsPending?.map((user) => {
              return (
                <div key={user.id} className="flex gap-3 items-center">
                  <div> {user.userName}</div>
                  <button
                    onClick={() => cancelRequest(user.userId)}
                    className="bg-indigo-500 px-2 rounded-md"
                  >
                    Cancel Request
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {activeFriendsBar === 5 && (
          <>
            <h1>requests...</h1>
            <div className="flex flex-col gap-3">
              {currentUser?.friendsRequests?.map((user) => {
                return (
                  <div key={user.id} className="flex gap-3 items-center">
                    <div> {user.userName}</div>
                    <button
                      onClick={() => acceptFriendRequest(user.userId)}
                      className="bg-indigo-500 p-1 rounded-md"
                    >
                      accept
                    </button>
                    <button
                      onClick={() => denideRequest(user.userId)}
                      className="bg-red-500 p-1 rounded-md"
                    >
                      denide
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {activeFriendsBar === 6 && (
          <div>
            <div
              className="flex flex-col gap-3 h-C_H3 overflow-y-auto"
              ref={chatBox}
            >
              {directChatLoaded?.messages.map((m) => {
                return (
                  <Message
                    key={m.id}
                    id={m.id}
                    img={m.userImg}
                    type={m.userType}
                    userName={m.userName}
                    date={m.date}
                    message={m.message}
                    replay={m.replay}
                    getDataFromReply={getDataFromReplyDirectChat}
                  />
                );
              })}
            </div>
            <div className="w-full h-20 relative">
              {replayToDirectChat && (
                <span className="absolute -top-10">
                  replay to {replayToDirectChat.userName}{" "}
                  <button
                    className="bg-indigo-500 rounded-md p-1"
                    onClick={() => setReaplyToDirectChat(null)}
                  >
                    cancel
                  </button>
                </span>
              )}
              <textarea
                value={directChatMessage}
                onChange={(e) => setDirectChatMessage(e.target.value)}
                onKeyDown={handleKeyDownOnDirectMessages}
                className="w-full h-fit bg-neutral-700 rounded-md resize-none focus:outline-none p-2"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (serverActive === 99) {
    return (
      <div className="bg-neutral-600 w-full h-C_H p-2 flex flex-col flex-wrap gap-1 items-start justify-start">
        {allServersList.map((ser) => {
          return (
            <ServersList
              key={ser.id}
              id={ser.id}
              img={ser.img}
              name={ser.name}
              users={ser.users}
              joinNewServer={joinNewServer}
            />
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
                key={m.id}
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
