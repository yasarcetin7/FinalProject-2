"use client";

import { useRouter } from "next/navigation";
import emblem from "../../money amblem.png";

const headerClass =
  "mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-line bg-panel px-[clamp(12px,3vw,30px)] py-[15px] max-[960px]:grid max-[960px]:grid-cols-[minmax(0,1fr)_auto] max-[960px]:[grid-template-areas:'brand_actions'_'search_search'] max-[640px]:grid-cols-1 max-[640px]:[grid-template-areas:'brand'_'search'_'actions']";
const brandClass = "flex min-w-0 items-center gap-3 max-[960px]:[grid-area:brand]";
const searchClass =
  "relative mx-[clamp(0px,2vw,20px)] min-w-0 max-w-[500px] flex-[1_1_256px] max-[960px]:mx-0 max-[960px]:w-full max-[960px]:max-w-none max-[960px]:[grid-area:search]";
const actionsClass =
  "ms-auto flex flex-wrap gap-2.5 max-[960px]:ms-0 max-[960px]:[grid-area:actions] max-[640px]:w-full";
const successButtonClass =
  "cursor-pointer rounded-lg border-2 border-brand-edge bg-brand px-5 py-2.5 text-center text-base font-bold text-black transition-colors hover:bg-brand-deep hover:text-white motion-reduce:transition-none max-[640px]:flex-[1_1_128px] max-[480px]:px-3";

export default function Header() {
  const router = useRouter();

  return (
    <header className={headerClass}>
      <div className={brandClass}>
        <div className="flex size-[45px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand">
          <img className="block size-full object-cover" src={emblem.src} alt="MoneyLiveArea amblemi" />
        </div>
        <h2 className="m-0 text-lg md:text-xl lg:text-2xl text-white break-words">
          MoneyLiveArea
        </h2>
      </div>

      <div className={searchClass}>
        <input
          className="w-full rounded-lg border-2 border-line bg-panel p-4 text-base text-white outline-none transition-colors duration-300 focus:border-brand-edge"
          type="text"
          id="crypto-search-input"
          placeholder="Arama Yap"
          autoComplete="off"
        />
        <div
          id="crypto-search-results"
          className="absolute top-full left-0 z-50 hidden max-h-64 w-full overflow-y-auto rounded-b-lg border border-t-0 border-line bg-dropdown shadow-xl shadow-black/50"
        />
      </div>

      <div className={actionsClass}>
        <button type="button" className={successButtonClass} onClick={() => router.push("/user/giris")}>
          Giriş Yap
        </button>
        <button type="button" className={successButtonClass} onClick={() => router.push("/user/kayitol")}>
          Kayıt Ol
        </button>
      </div>
    </header>
  );
}
