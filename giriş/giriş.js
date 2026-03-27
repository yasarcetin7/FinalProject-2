const girisFormu = document.getElementById('GirişForm');

if (girisFormu) {
    girisFormu.addEventListener('submit', function(event) {
        
        event.preventDefault(); 

        // Kullanıcının girdiği email ve şifreyi alıyoruz
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email === '' || password === '') {
            alert(" Lütfen e-posta ve şifre alanlarını boş bırakmayınız!");
            return;
        }
        if (!email.includes('@') || !email.endsWith('.com')) {
            alert(" Lütfen kayıtlı, geçerli bir e-posta adresi giriniz.");
            return;
        }
        if (password.length < 4 || password.length > 6) {
            alert(" Hatalı şifre! Şifreniz 4 ile 6 karakter arasında olmalıdır.");
            return;
        }

        alert(" Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...");
        girisFormu.reset(); 
        
        window.location.href = "./index.html";
    });
}