"use client";

import { useRouter } from "next/navigation";
import emblem from "../../money amblem.png";
import { Button } from "./ui/button";

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
      <Button
        type="button"
        variant="destructive"
        size="none"
        onClick={() => router.push("/")}
      >
        Ana Sayfa
      </Button>
    </header>
  );
}
