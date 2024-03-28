import useAITeacher from "@/libs/stores/aiJapaneseStore";
import { cn } from "@/utils/style";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const [question, setQuestion] = useState("");

  const ask = () => {
    askAI(question);
    setQuestion("");
  };

  return (
    <div className="z-10 w-[600px] max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">
          일본어 선생님한테 질문해보세요!
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="Have you ever been to Japan?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          />
          <button
            className={cn(
              "bg-[#723CD6] p-2 px-3 rounded-full text-white",
              "hover:opacity-70 transition-all duration-200"
            )}
            onClick={ask}
          >
            <IoIosSend className="text-xl" />
          </button>
        </div>
      )}
    </div>
  );
};
