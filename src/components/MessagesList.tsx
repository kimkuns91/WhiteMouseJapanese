import useAITeacher, { Message } from "@/libs/stores/aiJapaneseStore";
import { useEffect, useRef } from "react";

import { cn } from "@/utils/style";

export const MessagesList = () => {
  const messages: Message[] = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const { currentMessage } = useAITeacher();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    container.current?.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const renderKorean = (koreanText: string) => (
    <p className="text-4xl inline-block px-2 rounded-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
      {koreanText}
    </p>
  );

  const renderJapanese = (japanese: { word: string; reading?: string }[]) => (
    <p className="text-white font-bold text-4xl mt-2 font-jp flex flex-wrap gap-1">
      {japanese.map((word, i) => (
        <span key={i} className="flex flex-col justify-end items-center">
          {word.reading && (
            <span className="text-2xl text-white/65">{word.reading}</span>
          )}
          {word.word}
        </span>
      ))}
    </p>
  );

  console.log("messages :", messages);
  return (
    <div
      className={cn(
        "w-[1288px] h-[676px]",
        "p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-8"
      )}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center gap-6">
          <h2 className="text-8xl font-bold text-white/90 italic">
            냥이 선생님과 함께하는
          </h2>
          <h2 className="text-8xl font-bold text-white/90 italic">
            즐거운 일본어 수업
          </h2>
          <h2 className="text-8xl font-bold font-jp text-red-600/90 italic">
            猫先生日本語学校
          </h2>
        </div>
      )}
      {messages.map((message, index) => (
        <div key={index}>
          <div className="flex">
            <div className="flex-grow">
              {renderJapanese(message.answer.japanese)}
            </div>
            {/* {currentMessage === message ? (
              <button
                className="text-white/65"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )} */}
          </div>
          <div className="p-5 mt-5  bg-gradient-to-br from-pink-200/20 to-pink-500/20 rounded-xl">
            <span className="pr-4 italic bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/70 text-3xl font-bold uppercase inline-block">
              문법 분해
            </span>
            {message.answer.grammarBreakdown.map((grammar: any, index: any) => (
              <div key={index} className="mt-3">
                {message.answer.grammarBreakdown.length > 1 && (
                  <>
                    {renderKorean(grammar.korean)}
                    {renderJapanese(grammar.japanese)}
                  </>
                )}

                <div className="mt-3 flex flex-wrap gap-3 items-end">
                  {grammar.chunks.map((chunk: any, index: any) => (
                    <div key={index} className="p-2 bg-black/30 rounded-md">
                      <p className="text-white/90 text-4xl font-jp">
                        {renderJapanese(chunk.japanese)}
                      </p>
                      <p className="text-pink-300/90 text-2xl">
                        {chunk.meaning}
                      </p>
                      <p className="text-blue-400/90 text-2xl">
                        {chunk.grammar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
