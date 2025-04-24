function kurumOzellestir() {
    window.location.href = 'kurum-ozellestir.html';
}

function ogrenciEkle() {
    window.location.href = 'ogrenci-islemleri.html';
}

function yoklamaAl() {
    window.location.href = 'yoklama.html';
}

function sinifOzellestir() {
    window.location.href = 'sinif-islemleri.html';
}

function geriDon() {
    window.location.href = 'index.html';
}

// Sayfa yüklendiğinde renk temalarını uygula
window.onload = function() {
    const kayitliAyarlar = localStorage.getItem('kurumAyarlari');
    if (kayitliAyarlar) {
        const ayarlar = JSON.parse(kayitliAyarlar);
        
        // CSS değişkenlerini güncelle
        document.documentElement.style.setProperty('--primary-color', ayarlar.renk1);
        document.documentElement.style.setProperty('--secondary-color', ayarlar.renk2);
        
        // Başlığı güncelle
        document.querySelector('h1').textContent = ayarlar.kurumAdi + ' - Yetkili Paneli';
    }
};