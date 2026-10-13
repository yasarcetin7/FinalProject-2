/* =========================================================
   KAYIT FORMU KONTROLÜ (DOĞRULAMA / VALIDATION)
   ========================================================= */

const kayitFormu = document.getElementById('KayıtForm');

if (kayitFormu) {
    kayitFormu.addEventListener('submit', function(event) {
        
        event.preventDefault(); 

        
        const nickname = document.getElementById('nickname').value.trim();
        const yas = document.getElementById('yaş').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        
        if (nickname === '' || yas === '' || email === '' || password === '') {
            alert(" Lütfen tüm alanları eksiksiz doldurunuz!");
            return; 
        }

      
        if (parseInt(yas) < 18) {
            alert(" Kayıt olabilmek için 18 yaşından büyük olmalısınız!");
            return;
        }

        
        if (!email.includes('@') || !email.endsWith('.com')) {
            alert("Lütfen geçerli bir e-posta adresi giriniz. (Örn: isim@mail.com)");
            return;
        }

        
        if (password.length < 4 || password.length > 6) {
            alert(" Şifreniz minimum 4, maksimum 6 haneli olmalıdır!");
            return;
        }

        
        alert("✅ Tebrikler " + nickname + " Kayıt işleminiz başarıyla tamamlandı.");
        
     
        kayitFormu.reset(); 
        window.location.href = "../index.html";
        });
}