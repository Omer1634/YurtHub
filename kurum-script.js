let secilenRenk1 = null;
let secilenRenk2 = null;

// Renk butonlarını seçme işlemi
document.querySelectorAll('.color-options').forEach((container, index) => {
    container.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Aynı gruptaki diğer butonlardan selected sınıfını kaldır
            container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            // Tıklanan butona selected sınıfını ekle
            btn.classList.add('selected');
            
            // Hangi renk grubuna tıklandığını kontrol et
            if (index === 0) {
                secilenRenk1 = btn.getAttribute('data-color');
            } else {
                secilenRenk2 = btn.getAttribute('data-color');
            }
        });
    });
});

function kaydetVeUygula() {
    const kurumAdi = document.getElementById('kurumAdi').value;
    
    if (!kurumAdi) {
        alert('Lütfen kurum adını giriniz!');
        return;
    }
    
    if (!secilenRenk1 || !secilenRenk2) {
        alert('Lütfen her iki rengi de seçiniz!');
        return;
    }

    // Ayarları local storage'a kaydet
    const kurumAyarlari = {
        kurumAdi: kurumAdi,
        renk1: secilenRenk1,
        renk2: secilenRenk2
    };
    
    localStorage.setItem('kurumAyarlari', JSON.stringify(kurumAyarlari));
    
    // CSS değişkenlerini güncelle
    document.documentElement.style.setProperty('--primary-color', secilenRenk1);
    document.documentElement.style.setProperty('--secondary-color', secilenRenk2);
    
    alert('Ayarlar başarıyla kaydedildi!');
    window.location.href = 'yetkili-panel.html';
}

function geriDon() {
    window.location.href = 'yetkili-panel.html';
}

// Sayfa yüklendiğinde mevcut ayarları yükle
window.onload = function() {
    const kayitliAyarlar = localStorage.getItem('kurumAyarlari');
    if (kayitliAyarlar) {
        const ayarlar = JSON.parse(kayitliAyarlar);
        document.getElementById('kurumAdi').value = ayarlar.kurumAdi;
        
        // Kayıtlı renkleri seç
        document.querySelectorAll('.color-options').forEach((container, index) => {
            container.querySelectorAll('.color-btn').forEach(btn => {
                const renk = btn.getAttribute('data-color');
                if ((index === 0 && renk === ayarlar.renk1) || 
                    (index === 1 && renk === ayarlar.renk2)) {
                    btn.classList.add('selected');
                    if (index === 0) secilenRenk1 = renk;
                    else secilenRenk2 = renk;
                }
            });
        });
    }
};