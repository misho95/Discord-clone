// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayUnion,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbcdtQ1rWiZGKqRIYjToib1FESQC4D5nM",
  authDomain: "discord-clone-329df.firebaseapp.com",
  projectId: "discord-clone-329df",
  storageBucket: "discord-clone-329df.appspot.com",
  messagingSenderId: "415969664640",
  appId: "1:415969664640:web:65321404d341975555d065",
  measurementId: "G-4FKQPKWVQK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const auth = getAuth();

export const db = getFirestore(app);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapShot = await getDoc(userDocRef);
  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const SignInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChangeListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const getUserInfoFromDataBase = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export const addDataInServer = async (serverName, id, obj) => {
  // Add a new document in collection "cities"
  await setDoc(doc(db, serverName, id), obj);
};

export const updateDataInServer = async (serverName, arrayName, id, obj) => {
  // Reference to the specific channel document
  const channelRef = doc(db, serverName, id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, "users", id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        [arrayName]: arrayUnion(obj),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getAllDataFromServer = async (serverName) => {
  const colRef = collection(db, serverName);
  const docsSnap = await getDocs(colRef);
  const data = [];
  docsSnap.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const getDataFromServerByID = async (serverName, id) => {
  const q = query(collection(db, serverName), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push(doc.data());
  });
  return data;
};

export const getImgUrl = async (imgName) => {
  // Create a reference to the file we want to download
  const storage = getStorage();
  const starsRef = ref(storage, imgName);

  // Get the download URL
  return await getDownloadURL(starsRef).then((url) => {
    return url;
  });
};

export const getDataFromServerBySubId = async (server, id) => {
  const q = query(collection(db, server), where("channelId", "==", id));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push(doc.data());
  });
  return data;
};

export const addNewMessageInChat = async (id, newMessage) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "chat", id);

  getDoc(channelRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        // Update the "messages" array using the arrayUnion function
        updateDoc(channelRef, {
          messages: arrayUnion(newMessage),
        })
          .then(() => {
            console.log("New message added successfully!");
          })
          .catch((error) => {
            console.error("Error adding new message:", error);
          });
      } else {
        console.log("Channel document doesn't exist.");
      }
    })
    .catch((error) => {
      console.error("Error checking channel document:", error);
    });
};

export const addNewServerChannel = async (id, newCategory) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "servers", id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, "servers", id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        channels: arrayUnion(newCategory),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getServerUid = async (id) => {
  const q = query(collection(db, "servers"), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  const getUid = [];
  const uid = querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    getUid.push(doc.id);
  });
  return getUid.toString();
};

export const userJoinServer = async (id, newServer) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "users", id);

  getDoc(channelRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        // Update the "messages" array using the arrayUnion function
        updateDoc(channelRef, {
          joinedServers: arrayUnion(newServer),
        })
          .then(() => {
            console.log("New message added successfully!");
          })
          .catch((error) => {
            console.error("Error adding new message:", error);
          });
      } else {
        console.log("Channel document doesn't exist.");
      }
    })
    .catch((error) => {
      console.error("Error checking channel document:", error);
    });
};

export const addUserInServer = async (id, newServer) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "servers", id);

  getDoc(channelRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        // Update the "messages" array using the arrayUnion function
        updateDoc(channelRef, {
          users: arrayUnion(newServer),
        })
          .then(() => {
            console.log("New message added successfully!");
          })
          .catch((error) => {
            console.error("Error adding new message:", error);
          });
      } else {
        console.log("Channel document doesn't exist.");
      }
    })
    .catch((error) => {
      console.error("Error checking channel document:", error);
    });
};

export const findUserByUserName = async (user) => {
  const q = query(collection(db, "users"), where("userName", "==", user));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push(doc.data());
  });
  return data;
};

export const updateUserFriendRequests = async (id, obj) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "users", id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, "users", id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        friendsRequests: arrayUnion(obj),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateUserFriendRequestsPending = async (id, obj) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "users", id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, "users", id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        friendsRequestsPending: arrayUnion(obj),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to find user by ID
export const findUserById = async (userId) => {
  const userRef = doc(db, "users", userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.ref;
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

export const findServerById = async (userId) => {
  const userRef = doc(db, "servers", userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.ref;
    } else {
      console.log("Server not found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

// Function to remove a specific element from an array
export const removeObjectFromArray = async (userRef, arrayField, objectId) => {
  try {
    // Fetch the user's data
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // Find the index of the object with the specified ID
      const indexToRemove = userData[arrayField].findIndex(
        (obj) => obj.userId === objectId
      );

      if (indexToRemove !== -1) {
        // Remove the object from the array
        userData[arrayField].splice(indexToRemove, 1);

        // Update the document with the modified array
        await updateDoc(userRef, {
          [arrayField]: userData[arrayField],
        });

        console.log("Object removed successfully.");
      } else {
        console.log("Object with specified ID not found in the array.");
      }
    } else {
      console.log("User document does not exist.");
    }
  } catch (error) {
    console.error("Error removing object:", error);
  }
};

export const addNewFriendInUsers = async (id, obj) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "users", id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, "users", id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        userFriends: arrayUnion(obj),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getUid = async (server, id) => {
  const q = query(collection(db, server), where("id", "==", id));

  const querySnapshot = await getDocs(q);
  const getUid = [];
  const uid = querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    getUid.push(doc.id);
  });
  return getUid.toString();
};

export const listenForServerChanges = async (server, id) => {
  return new Promise((resolve, reject) => {
    const unsub = onSnapshot(doc(db, server, id), (doc) => {
      if (doc.exists()) {
        resolve(doc.data());
      } else {
        reject(new Error("Document does not exist"));
      }
    });
  });
};

export const updateUserStatus = async (id, val) => {
  const user = doc(db, "users", id);

  // Set the "capital" field of the city 'DC'
  await updateDoc(user, {
    userOnline: val,
  });
};

export const updateUserProfileImg = async (id, val) => {
  const user = doc(db, "users", id);

  // Set the "capital" field of the city 'DC'
  await updateDoc(user, {
    userImg: val,
  });
};

export const updateData = async (server, id, obj, arrayName) => {
  // Reference to the specific channel document
  const channelRef = doc(db, server, id);

  try {
    // Reference to the specific server document using the serverId
    const serverRef = doc(db, server, id);

    const serverSnapshot = await getDoc(channelRef);

    if (serverSnapshot.exists()) {
      // Update the "channels" array using the arrayUnion function
      await updateDoc(serverRef, {
        [arrayName]: arrayUnion(obj),
      });

      console.log("New channel added successfully!");
    } else {
      console.log("Server document does not exist.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const addNewCategoryChannel = async (id, channelsId, newChannelObj) => {
  const docRef = doc(db, "servers", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentChannels = docSnap.data().channels || [];
    const updated = currentChannels.map((data) => {
      if (data.id === channelsId) {
        return {
          ...data,
          channel: [...data.channel, newChannelObj],
        };
      }
      return data;
    });
    await updateDoc(docRef, {
      channels: updated,
    });
  } else {
    console.log("No such document!");
  }
};

export const removeObjectFromServer = async (userRef, arrayField, objectId) => {
  try {
    // Fetch the user's data
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // Find the index of the object with the specified ID
      const indexToRemove = userData[arrayField].findIndex(
        (obj) => obj.id === objectId
      );

      if (indexToRemove !== -1) {
        // Remove the object from the array
        userData[arrayField].splice(indexToRemove, 1);

        // Update the document with the modified array
        await updateDoc(userRef, {
          [arrayField]: userData[arrayField],
        });

        console.log("Object removed successfully.");
      } else {
        console.log("Object with specified ID not found in the array.");
      }
    } else {
      console.log("User document does not exist.");
    }
  } catch (error) {
    console.error("Error removing object:", error);
  }
};

export const removeData = async (server, id) => {
  await deleteDoc(doc(db, server, id));
};

export const addNewMessageInDirectChat = async (id, newMessage) => {
  // Reference to the specific channel document
  const channelRef = doc(db, "directChat", id);

  getDoc(channelRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        // Update the "messages" array using the arrayUnion function
        updateDoc(channelRef, {
          messages: arrayUnion(newMessage),
        })
          .then(() => {
            console.log("New message added successfully!");
          })
          .catch((error) => {
            console.error("Error adding new message:", error);
          });
      } else {
        console.log("Channel document doesn't exist.");
      }
    })
    .catch((error) => {
      console.error("Error checking channel document:", error);
    });
};

export const updateUserTime = async (userId) => {
  const userRef = doc(db, "users", userId);

  // Update the lastOpenTime field with the current server timestamp
  updateDoc(userRef, {
    userTime: serverTimestamp(),
  })
    .then(() => {
      console.log("Last open time updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating last open time:", error);
    });
};

export const getUserImgUrl = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  let url = "";

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    url = docSnap.data().userImg;
    // return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  return url;
};
