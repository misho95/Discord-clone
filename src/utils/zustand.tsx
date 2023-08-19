import { create } from "zustand";

const createActiveServer = (set) => ({
  active: 0,
  setActive: (id) => set(() => ({ active: id })),
});

export const activeServer = create(createActiveServer);

const createShowModal = (set) => ({
  showModal: false,
  setShowModal: () => set((state) => ({ showModal: !state.showModal })),
});

export const zustandShowAddModal = create(createShowModal);

const createDirectChatActive = (set) => ({
  active: 1,
  setActive: (id) => set(() => ({ active: id })),
});

export const directChatActive = create(createDirectChatActive);

const createFriendsActiveBar = (set) => ({
  active: 0,
  setActive: (id) => set(() => ({ active: id })),
});

export const friendsActiveBar = create(createFriendsActiveBar);

const createUserSignedIn = (set) => ({
  currentUser: null,
  setCurrentUser: (obj) => set(() => ({ currentUser: obj })),
});

export const userSignedIn = create(createUserSignedIn);

const createServerLoaded = (set) => ({
  currentServer: null,
  setCurrentServer: (server) => set(() => ({ currentServer: server })),
});

export const serverLoaded = create(createServerLoaded);

const createChatLoaded = (set) => ({
  chatLoaded: null,
  setChatLoaded: (chat) => set(() => ({ chatLoaded: chat })),
});

export const chatLoaded = create(createChatLoaded);

const createUserType = (set) => ({
  type: null,
  setType: (type) => set(() => ({ type })),
});

export const userType = create(createUserType);

const createChannelOpen = (set) => ({
  open: { id: null, name: null },
  setOpen: (id, name) => set(() => ({ open: { id, name } })),
});

export const channelOpen = create(createChannelOpen);

const createServersList = (set) => ({
  servers: null,
  setServers: (servers) => set(() => ({ servers })),
});

export const serversList = create(createServersList);

const createRequestNotification = (set) => ({
  number: null,
  setNumber: (num) => set(() => ({ number: num })),
});

export const requestNotification = create(createRequestNotification);
