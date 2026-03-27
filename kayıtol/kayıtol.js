/* =========================================================
   KAYIT FORMU KONTROLÜ (DOĞRULAMA / VALIDATION)
   ========================================================= */

const kayitFormu = document.getElementById('KayıtForm');

if (kayitFormu) {
    kayitFormu.addEventListener('submit', function(event) {
        // Formun sayfayı otomatik yenilemesini engelliyoruz (böylece kontrolleri yapabiliriz)
        event.preventDefault(); 

        // Kullanıcının kutulara yazdığı değerleri alıyoruz
        const nickname = document.getElementById('nickname').value.trim();
        const yas = document.getElementById('yaş').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // 1. KURAL: Hiçbir alan boş bırakılamaz
        if (nickname === '' || yas === '' || email === '' || password === '') {
            alert(" Lütfen tüm alanları eksiksiz doldurunuz!");
            return; // Hata varsa işlemi durdur
        }

        // 2. KURAL: Yaş kontrolü (HTML'de min=18 dedik ama JS ile de sağlama alıyoruz)
        if (parseInt(yas) < 18) {
            alert(" Kayıt olabilmek için 18 yaşından büyük olmalısınız!");
            return;
        }

        // 3. KURAL: E-posta formatı (İçinde '@' olmalı ve '.com' ile bitmeli)
        if (!email.includes('@') || !email.endsWith('.com')) {
            alert("Lütfen geçerli bir e-posta adresi giriniz. (Örn: isim@mail.com)");
            return;
        }

        // 4. KURAL: Şifre en az 4, en fazla 6 haneli olmalı
        if (password.length < 4 || password.length > 6) {
            alert(" Şifreniz minimum 4, maksimum 6 haneli olmalıdır!");
            return;
        }

        // BÜTÜN KURALLARDAN GEÇTİYSE: Başarılı mesajı ver
        alert("✅ Tebrikler " + nickname + " Kayıt işleminiz başarıyla tamamlandı.");
        
     
        kayitFormu.reset(); 
        window.location.href = "../index.html";
        });
}