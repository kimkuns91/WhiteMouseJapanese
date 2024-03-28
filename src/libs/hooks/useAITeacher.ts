import { create } from "zustand";

export interface Message {
  question: string;
  id: number;
  answer: any;
  audioPlayer?: any;
  visemes?: any;
}
export interface AITeacherState {
  messages: Message[];
  currentMessage: Message | null;
  teacher: string;
  setTeacher: (teacher: string) => void;
  classroom: "default" | "alternative";
  setClassroom: (classroom: "default" | "alternative") => void;
  loading: boolean;
  furigana: boolean;
  setFurigana: (furigana: boolean) => void;
  english: boolean;
  setEnglish: (english: boolean) => void;
  speech: "formal" | "casual";
  setSpeech: (speech: "formal" | "casual") => void;
  askAI: (question: string) => Promise<void>;
  playMessage: (message: Message) => Promise<void>;
  stopMessage: (message: Message) => void;
}

export const teachers = ["Nanami", "Naoki"];

export const useAITeacher = create<AITeacherState>((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null;
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,
  furigana: true,
  setFurigana: (furigana) => {
    set(() => ({
      furigana,
    }));
  },
  english: true,
  setEnglish: (english) => {
    set(() => ({
      english,
    }));
  },
  speech: "formal",
  setSpeech: (speech) => {
    set(() => ({
      speech,
    }));
  },
  askAI: async (question) => {
    if (!question) {
      return;
    }
    const message = {
      question,
      id: get().messages.length,
      answer: null,
      speech: get().speech,
    };
    set(() => ({
      loading: true,
    }));

    const speech = get().speech;

    // Ask AI
    const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
    const data = await res.json();
    message.answer = data;
    message.speech = speech;

    set(() => ({
      currentMessage: message,
    }));

    set((state) => ({
      messages: [...state.messages, message],
      loading: false,
    }));
    get().playMessage(message);
  },
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));
      // Get TTS
      const audioRes = await fetch(
        `/api/tts?teacher=${get().teacher}&text=${message.answer.japanese
          .map((word : any) => word.word)
          .join(" ")}`
      );
      const audio = await audioRes.blob();
      const visemes = JSON.parse(audioRes.headers.get("visemes")!);
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      message.visemes = visemes;
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({
          currentMessage: null,
        }));
      };
      set(() => ({
        loading: false,
        messages: get().messages.map((m) => {
          if (m.id === message.id) {
            return message;
          }
          return m;
        }),
      }));
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },
  stopMessage: (message) => {
    message.audioPlayer.pause();
    set(() => ({
      currentMessage: null,
    }));
  },
}));
