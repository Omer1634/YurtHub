// Sınıf verilerini localStorage'da saklayacağız
let siniflar = JSON.parse(localStorage.getItem('siniflar')) || [];
let aktifSinifId = null;

// Sayfa yüklendiğinde sınıf listesini göster
window.onload = function() {
    sinifListesiniGuncelle();
    
    // Kurum ayarlarını uygula
    const kayitliAyarlar = localStorage.getItem('kurumAyarlari');
    if (kayitliAyarlar) {
        const ayarlar = JSON.parse(kayitliAyarlar);
        document.documentElement.style.setProperty('--primary-color', ayarlar.renk1);
        document.documentElement.style.setProperty('--secondary-color', ayarlar.renk2);
        document.querySelector('h1').textContent = ayarlar.kurumAdi + ' - Sınıf İşlemleri';
    }

    // Modal kapatma işlemleri
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            closeBtn.closest('.modal').style.display = 'none';
        }
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
};

function sinifEkle() {
    const sinifAdi = document.getElementById('sinifAdi').value.trim();
    
    if (!sinifAdi) {
        alert('Lütfen sınıf adını giriniz!');
        return;
    }

    // Sınıf adının benzersiz olduğunu kontrol et
    if (siniflar.some(sinif => sinif.ad.toLowerCase() === sinifAdi.toLowerCase())) {
        alert('Bu sınıf adı zaten kullanılıyor!');
        return;
    }

    const yeniSinif = {
        id: Date.now(), // Benzersiz ID
        ad: sinifAdi,
        ogrenciler: []
    };

    siniflar.push(yeniSinif);
    localStorage.setItem('siniflar', JSON.stringify(siniflar));
    
    document.getElementById('sinifAdi').value = '';
    sinifListesiniGuncelle();
    
    alert('Sınıf başarıyla eklendi!');
}

function sinifListesiniGuncelle() {
    const tabloDiv = document.getElementById('siniflarTablosu');
    
    if (siniflar.length === 0) {
        tabloDiv.innerHTML = '<p>Henüz sınıf bulunmamaktadır.</p>';
        return;
    }

    let tablo = `
        <table class="ogrenci-tablo">
            <thead>
                <tr>
                    <th>Sınıf Adı</th>
                    <th>Öğrenci Sayısı</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;

    siniflar.sort((a, b) => a.ad.localeCompare(b.ad)).forEach(sinif => {
        tablo += `
            <tr>
                <td>${sinif.ad}</td>
                <td>${sinif.ogrenciler.length}</td>
                <td>
                    <button onclick="ogrenciModalAc(${sinif.id})" class="btn duzenle">Öğrenci Ekle/Çıkar</button>
                    <button onclick="sinifSil(${sinif.id})" class="btn sil">Sınıfı Sil</button>
                </td>
            </tr>
        `;
    });

    tablo += '</tbody></table>';
    tabloDiv.innerHTML = tablo;
}

function ogrenciModalAc(sinifId) {
    aktifSinifId = sinifId;
    const sinif = siniflar.find(s => s.id === sinifId);
    const tumOgrenciler = JSON.parse(localStorage.getItem('ogrenciler')) || [];
    
    document.getElementById('modalBaslik').textContent = `${sinif.ad} - Öğrenci Ekle/Çıkar`;
    
    // Sınıfta olmayan öğrencileri listele
    const mevcutDiv = document.getElementById('mevcutOgrenciler');
    const siniftakiDiv = document.getElementById('sinifOgrencileri');
    
    // Sınıfta olmayan öğrencileri göster
    const siniftaOlmayanlar = tumOgrenciler.filter(ogrenci => 
        !sinif.ogrenciler.includes(ogrenci.numara)
    );
    
    mevcutDiv.innerHTML = siniftaOlmayanlar.map(ogrenci => `
        <div class="ogrenci-item" data-numara="${ogrenci.numara}">
            ${ogrenci.numara} - ${ogrenci.ad}
        </div>
    `).join('');
    
    // Sınıftaki öğrencileri göster
    const siniftakiOgrenciler = tumOgrenciler.filter(ogrenci => 
        sinif.ogrenciler.includes(ogrenci.numara)
    );
    
    siniftakiDiv.innerHTML = siniftakiOgrenciler.map(ogrenci => `
        <div class="ogrenci-item" data-numara="${ogrenci.numara}">
            ${ogrenci.numara} - ${ogrenci.ad}
        </div>
    `).join('');

    document.getElementById('ogrenciModal').style.display = 'block';
}

function ogrenciEkle(yon) {
    const sinif = siniflar.find(s => s.id === aktifSinifId);
    
    if (yon === '→') {
        const seciliOgrenciler = document.querySelectorAll('#mevcutOgrenciler .ogrenci-item.selected');
        seciliOgrenciler.forEach(item => {
            const numara = parseInt(item.dataset.numara);
            if (!sinif.ogrenciler.includes(numara)) {
                sinif.ogrenciler.push(numara);
            }
            item.classList.remove('selected');
            document.getElementById('sinifOgrencileri').appendChild(item);
        });
    } else {
        const seciliOgrenciler = document.querySelectorAll('#sinifOgrencileri .ogrenci-item.selected');
        seciliOgrenciler.forEach(item => {
            const numara = parseInt(item.dataset.numara);
            sinif.ogrenciler = sinif.ogrenciler.filter(n => n !== numara);
            item.classList.remove('selected');
            document.getElementById('mevcutOgrenciler').appendChild(item);
        });
    }
}

function sinifKaydet() {
    localStorage.setItem('siniflar', JSON.stringify(siniflar));
    sinifListesiniGuncelle();
    modalKapat();
    alert('Değişiklikler kaydedildi!');
}

function sinifSil(sinifId) {
    if (confirm('Bu sınıfı silmek istediğinizden emin misiniz?')) {
        siniflar = siniflar.filter(sinif => sinif.id !== sinifId);
        localStorage.setItem('siniflar', JSON.stringify(siniflar));
        sinifListesiniGuncelle();
    }
}

function modalKapat() {
    document.getElementById('ogrenciModal').style.display = 'none';
    aktifSinifId = null;
}

// Öğrenci transfer işlemleri
function transferModalAc() {
    const kaynakSelect = document.getElementById('kaynakSinif');
    const hedefSelect = document.getElementById('hedefSinif');
    
    // Select'leri doldur
    const sinifOptions = siniflar.map(sinif => 
        `<option value="${sinif.id}">${sinif.ad}</option>`
    ).join('');
    
    kaynakSelect.innerHTML = '<option value="">Sınıf Seçiniz</option>' + sinifOptions;
    hedefSelect.innerHTML = '<option value="">Sınıf Seçiniz</option>' + sinifOptions;
    
    document.getElementById('transferModal').style.display = 'block';
}

function kaynakSinifDegisti() {
    const kaynakId = parseInt(document.getElementById('kaynakSinif').value);
    const kaynakSinif = siniflar.find(s => s.id === kaynakId);
    const tumOgrenciler = JSON.parse(localStorage.getItem('ogrenciler')) || [];
    
    if (!kaynakSinif) {
        document.getElementById('transferKaynakOgrenciler').innerHTML = '';
        return;
    }
    
    // Kaynak sınıftaki öğrencileri göster
    const kaynakOgrenciler = tumOgrenciler.filter(ogrenci => 
        kaynakSinif.ogrenciler.includes(ogrenci.numara)
    );
    
    document.getElementById('transferKaynakOgrenciler').innerHTML = kaynakOgrenciler.map(ogrenci => `
        <div class="ogrenci-item" data-numara="${ogrenci.numara}">
            ${ogrenci.numara} - ${ogrenci.ad}
        </div>
    `).join('');
}

function ogrenciTransferEt(yon) {
    if (yon === '→') {
        const seciliOgrenciler = document.querySelectorAll('#transferKaynakOgrenciler .ogrenci-item.selected');
        seciliOgrenciler.forEach(item => {
            item.classList.remove('selected');
            document.getElementById('transferHedefOgrenciler').appendChild(item);
        });
    } else {
        const seciliOgrenciler = document.querySelectorAll('#transferHedefOgrenciler .ogrenci-item.selected');
        seciliOgrenciler.forEach(item => {
            item.classList.remove('selected');
            document.getElementById('transferKaynakOgrenciler').appendChild(item);
        });
    }
}

function transferKaydet() {
    const kaynakId = parseInt(document.getElementById('kaynakSinif').value);
    const hedefId = parseInt(document.getElementById('hedefSinif').value);
    
    if (!kaynakId || !hedefId) {
        alert('Lütfen kaynak ve hedef sınıfları seçiniz!');
        return;
    }
    
    if (kaynakId === hedefId) {
        alert('Kaynak ve hedef sınıf aynı olamaz!');
        return;
    }
    
    const kaynakSinif = siniflar.find(s => s.id === kaynakId);
    const hedefSinif = siniflar.find(s => s.id === hedefId);
    
    // Transfer edilecek öğrencilerin numaralarını al
    const transferEdilecekler = Array.from(document.querySelectorAll('#transferHedefOgrenciler .ogrenci-item'))
        .map(item => parseInt(item.dataset.numara));
    
    // Öğrencileri kaynak sınıftan çıkar
    kaynakSinif.ogrenciler = kaynakSinif.ogrenciler.filter(numara => 
        !transferEdilecekler.includes(numara)
    );
    
    // Öğrencileri hedef sınıfa ekle
    transferEdilecekler.forEach(numara => {
        if (!hedefSinif.ogrenciler.includes(numara)) {
            hedefSinif.ogrenciler.push(numara);
        }
    });
    
    localStorage.setItem('siniflar', JSON.stringify(siniflar));
    sinifListesiniGuncelle();
    transferModalKapat();
    alert('Öğrenci transferi başarıyla tamamlandı!');
}

function transferModalKapat() {
    document.getElementById('transferModal').style.display = 'none';
    document.getElementById('transferKaynakOgrenciler').innerHTML = '';
    document.getElementById('transferHedefOgrenciler').innerHTML = '';
}

// Öğrenci seçme işlemleri için event listener'lar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ogrenci-item')) {
        e.target.classList.toggle('selected');
    }
});

function geriDon() {
    window.location.href = 'yetkili-panel.html';
}