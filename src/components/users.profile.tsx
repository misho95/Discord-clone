import { userSignedIn } from "../utils/zustand";
import { useState } from "react";
import {
  signOutUser,
  updateUserStatus,
  updateUserTime,
  getImgUrl,
  storage,
  updateUserProfileImg,
} from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const UsersProfile = () => {
  const userAccount = userSignedIn((state) => state.currentUser);
  const setNewUser = userSignedIn((state) => state.setCurrentUser);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  if (!userAccount) {
    return <div>loading...</div>;
  }

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const waitUpdateUserTime = async (id) => {
    await updateUserTime(id);
  };

  const signOut = async () => {
    waitUpdateUserTime(userAccount.id);
    await signOutUser();
    setNewUser(null);
    navigate("/signin");
    await updateUserStatus(userAccount.id, false);
  };

  const updateUserImg = () => {
    if (file === null) {
      setError("Please Upload File");
      return;
    }

    const type = file.type.slice(0, 5);

    if (type !== "image") {
      setError("Upload Only Images");
      return;
    }
    const imageRef = ref(storage, `profileImages/${file.name + v4()}`);
    uploadBytes(imageRef, file)
      .then(async (f) => {
        const url = await getImgUrl(f.metadata.fullPath);
        return url;
      })
      .then((url) => {
        updateUserProfileImg(userAccount.id, url);
        setOpenSettingsModal(false);
      });
  };

  const SettingsModal = () => {
    return (
      <div
        onClick={() => setOpenSettingsModal(false)}
        className="fixed w-full h-screen bg-black/50 top-0 left-0 flex justify-center items-center z-50"
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="bg-neutral-700 w-80 p-5 rounded-md"
        >
          <div className="flex flex-col gap-3">
            <label>Change Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            {error && <div className="text-sm text-red-500">{error}</div>}
            <button
              onClick={updateUserImg}
              className="bg-indigo-500 p-2 rounded-lg"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-800 absolute bottom-0 w-full p-2 flex gap-2">
      {openSettingsModal && <SettingsModal />}
      <div
        onClick={() => setOpen(!open)}
        className="flex gap-2 hover:bg-neutral-700 p-2 rounded-lg relative z-0"
      >
        {open && (
          <div
            className="absolute -top-28 flex flex-col gap-2 w-56"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button className="bg-red-600 p-2 rounded-lg" onClick={signOut}>
              SignOut
            </button>
            <button
              onClick={() => {
                setOpenSettingsModal(!openSettingsModal), setOpen(false);
              }}
              className="bg-indigo-500 p-2 rounded-lg"
            >
              Settings
            </button>
          </div>
        )}
        <div className="relative w-8 h-8">
          <div
            className={`w-3 h-3 ${
              userAccount.userOnline ? "bg-green-600" : "bg-red-600"
            }  rounded-full absolute bottom-0 right-0 z-10 border-2 border-neutral-700`}
          ></div>
          <img
            src={userAccount.userImg}
            className="w-8 h-8 rounded-full absolute"
          />
        </div>
        <div className="text-xs text-neutral-300">
          <p>{userAccount.userName}</p>
          <p>{userAccount.userOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
