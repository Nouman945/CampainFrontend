import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import image1 from "@/assets/images/users/user-1.jpg";
import image2 from "@/assets/images/users/user-2.jpg";
import image3 from "@/assets/images/users/user-3.jpg";
import image4 from "@/assets/images/users/user-4.jpg";
import image5 from "@/assets/images/users/user-5.jpg";
import image6 from "@/assets/images/users/user-6.jpg";

export const appChatSlice = createSlice({
  name: "appchat",
  initialState: {
    openProfile: false,
    openinfo: true,
    activechat: false,
    searchContact: "",
    mobileChatSidebar: false,
    profileinfo: {},
    messFeed: [],
    user: {},
    contacts: [
      
      {
        id: 5,
        fullName: "BI Assitant",
        role: "Frontend Developer",
        lastmessage: "Hey! there I'm available",
        lastmessageTime: "2:30 PM",
        unredmessage: Math.floor(Math.random() * 10),
        // avatar: image1,
        status: "offline",
      },
    ],
    chats: [
      {
        id: 5,
        userId: 5,
        messages: [
          {
            img: image2,
            content: "Hey! How are you?",
            time: "10:00",
            sender: "them",
          },
        ],
      },
    ],
  },
  reducers: {
    openChat: (state, action) => {
      state.activechat = action.payload.activechat;
      state.mobileChatSidebar = !state.mobileChatSidebar;
      state.user = action.payload.contact;
      state.chats.map((item) => {
        if (item.userId === action.payload.contact.id) {
          state.messFeed = item.messages;
        }
      });
    },
    // toggole mobile chat sidebar
    toggleMobileChatSidebar: (state, action) => {
      state.mobileChatSidebar = action.payload;
    },
    infoToggle: (state, action) => {
      state.openinfo = action.payload;
    },
    sendMessage: (state, action) => {
      state.messFeed.push(action.payload);
    },
    toggleProfile: (state, action) => {
      state.openProfile = action.payload;
    },
    setContactSearch: (state, action) => {
      state.searchContact = action.payload;
    },
    toggleActiveChat: (state, action) => {
      state.activechat = action.payload;
    },
  },
});

export const {
  openChat,
  toggleMobileChatSidebar,
  infoToggle,
  sendMessage,
  toggleProfile,
  setContactSearch,
  toggleActiveChat,
} = appChatSlice.actions;
export default appChatSlice.reducer;
