// Öğrenci verilerini localStorage'da saklayacağız
let ogrenciler = JSON.parse(localStorage.getItem('ogrenciler')) || [];
let sonNumara = parseInt(localStorage.getItem('sonNumara')) || 1000;

// Sayfa yüklendiğinde öğrenci listesini göster
window.onload = function() {
    ogrenciListesiniGuncelle();
    
    // Kurum ayarlarını uygula
    const kayitliAyarlar = localStorage.getItem('kurumAyarlari');
    if (kayitliAyarlar) {
        const ayarlar = JSON.parse(kayitliAyarlar);
        document.documentElement.style.setProperty('--primary-color', ayarlar.renk1);
        document.documentElement.style.setProperty('--secondary-color', ayarlar.renk2);
        document.querySelector('h1').textContent = ayarlar.kurumAdi + ' - Öğrenci İşlemleri';
    }
};

function ogrenciEkle() {
    // Form verilerini al
    const ad = document.getElementById('ogrenciAd').value.trim();
    const yas = document.getElementById('ogrenciYas').value;
    const sinif = document.getElementById('ogrenciSinif').value;

    // Form validasyonu
    if (!ad || !yas || !sinif) {
        alert('Lütfen tüm alanları doldurunuz!');
        return;
    }

    // Yeni öğrenci numarası oluştur
    sonNumara++;
    
    // Yeni öğrenci objesi oluştur
    const yeniOgrenci = {
        numara: sonNumara,
        ad: ad,
        yas: parseInt(yas),
        sinif: parseInt(sinif)
    };

    // Öğrenciyi listeye ekle
    ogrenciler.push(yeniOgrenci);
    
    // LocalStorage'ı güncelle
    localStorage.setItem('ogrenciler', JSON.stringify(ogrenciler));
    localStorage.setItem('sonNumara', sonNumara.toString());

    // Formu temizle
    document.getElementById('ogrenciAd').value = '';
    document.getElementById('ogrenciYas').value = '';
    document.getElementById('ogrenciSinif').value = '';

    // Listeyi güncelle
    ogrenciListesiniGuncelle();
    
    alert('Öğrenci başarıyla eklendi!\nÖğrenci Numarası: ' + sonNumara);
}

function ogrenciSil(numara) {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
        ogrenciler = ogrenciler.filter(ogrenci => ogrenci.numara !== numara);
        localStorage.setItem('ogrenciler', JSON.stringify(ogrenciler));
        ogrenciListesiniGuncelle();
    }
}

function ogrenciListesiniGuncelle() {
    const tabloDiv = document.getElementById('ogrenciTablosu');
    
    if (ogrenciler.length === 0) {
        tabloDiv.innerHTML = '<p>Henüz kayıtlı öğrenci bulunmamaktadır.</p>';
        return;
    }

    let tablo = `
        <table class="ogrenci-tablo">
            <thead>
                <tr>
                    <th>Öğrenci No</th>
                    <th>Ad Soyad</th>
                    <th>Yaş</th>
                    <th>Sınıf</th>
                    <th>İşlem</th>
                </tr>
            </thead>
            <tbody>
    `;

    ogrenciler.sort((a, b) => a.numara - b.numara).forEach(ogrenci => {
        tablo += `
            <tr>
                <td>${ogrenci.numara}</td>
                <td>${ogrenci.ad}</td>
                <td>${ogrenci.yas}</td>
                <td>${ogrenci.sinif}. Sınıf</td>
                <td>
                    <button onclick="ogrenciSil(${ogrenci.numara})" class="btn sil">Sil</button>
                </td>
            </tr>
        `;
    });

    tablo += '</tbody></table>';
    tabloDiv.innerHTML = tablo;
}

function geriDon() {
    window.location.href = 'yetkili-panel.html';
}