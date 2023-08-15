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
  writeBatch,
  query,
  where,
  updateDoc,
  arrayUnion,
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
const app = initializeApp(firebaseConfig);
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

export const updateDataInServer = async (serverName, id, obj) => {
  const batch = writeBatch(db);
  const sfRef = doc(db, serverName, id);
  batch.update(sfRef, { joinedServers: obj });
  // Commit the batch
  await batch.commit();
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
