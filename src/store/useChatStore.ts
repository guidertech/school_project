import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

interface ChatStore {
  chatMessages: ChatMessage[];
  activeTopicKey: string;
  setActiveTopicKey: (key: string) => void;
  setChatMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatStore: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chatMessages: [],
      activeTopicKey: "",
      setActiveTopicKey: (key) => set({ activeTopicKey: key }),
      setChatMessages: (messages) =>
        set((state) => ({
          chatMessages: typeof messages === "function" ? messages(state.chatMessages) : messages,
        })),
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),
      clearChatStore: () => set({ chatMessages: [], activeTopicKey: "" }),
    }),
    {
      name: "topic-chat-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
