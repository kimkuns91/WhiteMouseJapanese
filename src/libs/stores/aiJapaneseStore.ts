import { createJSONStorage, devtools, persist } from "zustand/middleware";

import axios from "axios";
import { create } from "zustand";

export interface Message {
  answer: any;
  question: string;
  id: number;
  audioPlayer?: any;
  visemes?: any;
}

interface AIJapaneseState {
  messages: Message[];
  currentMessage: Message | null;
  loading: boolean;
  askAI: (question: string) => Promise<void>;
  playMessage: (message: Message) => Promise<void>;
  stopMessage: (message: Message) => void;
}

const useAIJapanese = create<AIJapaneseState>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        currentMessage: null,
        loading: false,
        askAI: async (question: string) => {
          if (!question) {
            return;
          }
          const message = {
            question,
            answer: null,
            id: get().messages.length,
          };
          set(() => ({
            loading: true,
          }));

          const res = await axios.get(`/api/ai?question=${question}`);
          console.log(res.data);
          message.answer = res.data;

          set(() => ({
            currentMessage: message,
          }));

          set((state) => ({
            messages: [...state.messages, message],
            loading: false,
          }));

          // get().playMessage(message);
        },
        playMessage: async (message) => {
          console.log(message);
          set(() => ({
            currentMessage: message,
          }));
        },
        stopMessage: (message) => {
          console.log(message);
        },
      }),
      {
        name: "ai-japanese",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useAIJapanese;
