"use client";

import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../../components/AuthHeader";
import { Button } from "../../components/ui/button";
export default function GirisPage() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "").trim();

    if (email === "" || password === "") {
      alert(" Lütfen e-posta ve şifre alanlarını boş bırakmayınız!");
      return;
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
      alert(" Lütfen kayıtlı, geçerli bir e-posta adresi giriniz.");
      return;
    }

    if (password.length < 4 || password.length > 6) {
      alert(" Hatalı şifre! Şifreniz 4 ile 6 karakter arasında olmalıdır.");
      return;
    }

    alert(" Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...");
    form.reset();
    router.push("/");
  }

  return (
    <>
      <AuthHeader />
      <div className="flex min-h-[calc(100vh-130px)] w-full items-center justify-center px-[15px]">
        <div className="w-full max-w-[380px] rounded-xl bg-white p-[30px] shadow-[0_10px_25px_rgba(0,0,0,0.5)] max-[768px]:max-w-full max-[768px]:p-[25px] max-[480px]:px-[15px] max-[480px]:py-5">
          <form id="girisForm" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="email">E-mail</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="email" id="email" name="email" placeholder="e-mail" />
            </div>
            <div className="mb-5">
              <label className="mb-2 block font-bold text-[#333]" htmlFor="password">Şifre:</label>
              <input className="w-full rounded-lg border border-[#ccc] bg-[#f9f9f9] px-3 py-3 text-base text-[#555] outline-none focus:border-brand focus:shadow-[0_0_5px_rgba(197,251,110,0.5)] max-[480px]:px-2.5 max-[480px]:py-2.5 max-[480px]:text-[15px]" type="password" id="password" name="password" placeholder="şifre" />
            </div>
            <Button type="submit" variant="secondary" size="none">
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
