"use client";

import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../../components/AuthHeader";
import { Button } from "../../components/ui/button";

export default function KayitOlPage() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nickname = String(data.get("nickname") ?? "").trim();
    const yas = String(data.get("yaş") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "").trim();

    if (nickname === "" || yas === "" || email === "" || password === "") {
      alert(" Lütfen tüm alanları eksiksiz doldurunuz!");
      return;
    }

    if (parseInt(yas, 10) < 18) {
      alert(" Kayıt olabilmek için 18 yaşından büyük olmalısınız!");
      return;
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
      alert("Lütfen geçerli bir e-posta adresi giriniz. (Örn: isim@mail.com)");
      return;
    }

    if (password.length < 4 || password.length > 6) {
      alert(" Şifreniz minimum 4, maksimum 6 haneli olmalıdır!");
      return;
    }

    alert("Tebrikler " + nickname + " Kayıt işleminiz başarıyla tamamlandı.");
    form.reset();
    router.push("/");
  }

  return (
    <>
      <AuthHeader />
      <div className="flex min-h-[calc(100vh-130px)] w-full items-center justify-center px-[15px]">
        <div className="w-full max-w-[380px] rounded-xl bg-white p-[30px] shadow-[0_10px_25px_rgba(0,0,0,0.5)] max-[768px]:max-w-full max-[768px]:p-[25px] max-[480px]:px-[15px] max-[480px]:py-5">
          <form id="KayıtForm" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="nickname">Kullanıcı Adı:</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="text" id="nickname" name="nickname" placeholder="nickname" />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="yaş">Yaş:</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="number" id="yaş" min={18} name="yaş" placeholder="yaş" />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="email">Email:</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="email" id="email" name="email" placeholder="email" />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="password">Şifre:</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="password" id="password" name="password" placeholder="password" />
            </div>
            <Button type="submit" variant="secondary" size="none">
              Kayıt Ol
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
