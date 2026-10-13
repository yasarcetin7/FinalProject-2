"use client";

import { useRouter } from "next/navigation";
import emblem from "../../money amblem.png";

export default function AuthHeader() {
  const router = useRouter();

  return (
    <header className="mb-5 flex items-center justify-between border-b border-line bg-panel px-[30px] py-[15px] max-[768px]:px-[15px]">
      <div className="flex items-center gap-[15px]">
        <div className="flex size-[45px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand max-[480px]:size-[35px]">
          <img
            className="block size-full rounded-full object-cover"
            src={emblem.src}
            alt="MoneyLiveArea amblemi"
          />
        </div>
        <h2 className="m-0 text-2xl text-white max-[768px]:text-[1.3rem]">MoneyLiveArea</h2>
      </div>
      <button
        type="button"
        className="cursor-pointer rounded-lg border-0 bg-brand px-5 py-2.5 text-base font-bold text-black transition-colors duration-300 hover:bg-[#a4db4b] motion-reduce:transition-none"
        onClick={() => router.push("/")}
      >
        Ana Sayfa
      </button>
    </header>
  );
}
