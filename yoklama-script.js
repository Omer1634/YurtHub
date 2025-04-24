// Sayfa yüklendiğinde tarih alanını bugünün tarihine ayarla ve öğrenci listesini getir
window.onload = function() {
    // Bugünün tarihini ayarla
    const bugun = new Date().toISOString().split('T')[0];
    document.getElementById('yoklamaTarihi').value = bugun;
    
    // Kurum ayarlarını uygula
    const kayitliAyarlar = localStorage.getItem('kurumAyarlari');
    if (kayitliAyarlar) {
        const ayarlar = JSON.parse(kayitliAyarlar);
        document.documentElement.style.setProperty('--primary-color', ayarlar.renk1);
        document.documentElement.style.setProperty('--secondary-color', ayarlar.renk2);
        document.querySelector('h1').textContent = ayarlar.kurumAdi + ' - Yoklama';
    }
    
    yoklamaListesiniOlustur();
};

function yoklamaListesiniOlustur() {
    const ogrenciler = JSON.parse(localStorage.getItem('ogrenciler')) || [];
    const tbody = document.querySelector('#yoklamaListesi tbody');
    
    if (ogrenciler.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Kayıtlı öğrenci bulunmamaktadır.</td></tr>';
        return;
    }

    tbody.innerHTML = ogrenciler.sort((a, b) => a.numara - b.numara)
        .map(ogrenci => `
            <tr>
                <td>${ogrenci.numara}</td>
                <td>${ogrenci.ad}</td>
                <td>${ogrenci.sinif}. Sınıf</td>
                <td>
                    <select class="durum-secici" data-ogrenci="${ogrenci.numara}">
                        <option value="var">Var</option>
                        <option value="yok">Yok</option>
                        <option value="gec">Geç Geldi</option>
                        <option value="izinli">İzinli</option>
                    </select>
                </td>
            </tr>
        `).join('');
}

function yoklamayiKaydet() {
    const tarih = document.getElementById('yoklamaTarihi').value;
    if (!tarih) {
        alert('Lütfen tarih seçiniz!');
        return;
    }

    const yoklamaDurumlari = {};
    document.querySelectorAll('.durum-secici').forEach(select => {
        yoklamaDurumlari[select.dataset.ogrenci] = select.value;
    });

    const yoklamaKaydi = {
        tarih: tarih,
        durumlar: yoklamaDurumlari,
        timestamp: new Date().getTime()
    };

    // Geçmiş yoklamaları getir ve yenisini ekle
    const yoklamaGecmisi = JSON.parse(localStorage.getItem('yoklamaGecmisi')) || [];
    yoklamaGecmisi.push(yoklamaKaydi);
    localStorage.setItem('yoklamaGecmisi', JSON.stringify(yoklamaGecmisi));

    alert('Yoklama başarıyla kaydedildi!');
}

function yoklamaGecmisiniGoster() {
    const gecmisListesi = document.getElementById('gecmisListesi');
    const yoklamaGecmisi = JSON.parse(localStorage.getItem('yoklamaGecmisi')) || [];
    const ogrenciler = JSON.parse(localStorage.getItem('ogrenciler')) || [];
    
    if (yoklamaGecmisi.length === 0) {
        gecmisListesi.innerHTML = '<p>Henüz yoklama kaydı bulunmamaktadır.</p>';
        return;
    }

    let html = '';
    yoklamaGecmisi.sort((a, b) => new Date(b.tarih) - new Date(a.tarih))
        .forEach(kayit => {
            html += `
                <div class="gecmis-kayit">
                    <h3>${formatTarih(kayit.tarih)}</h3>
                    <table class="ogrenci-tablo">
                        <thead>
                            <tr>
                                <th>Öğrenci No</th>
                                <th>Ad Soyad</th>
                                <th>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            Object.entries(kayit.durumlar).forEach(([ogrenciNo, durum]) => {
                const ogrenci = ogrenciler.find(o => o.numara == ogrenciNo);
                if (ogrenci) {
                    html += `
                        <tr>
                            <td>${ogrenci.numara}</td>
                            <td>${ogrenci.ad}</td>
                            <td>${durumToText(durum)}</td>
                        </tr>
                    `;
                }
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        });

    gecmisListesi.innerHTML = html;
    document.getElementById('gecmisModal').style.display = 'block';
}

function durumToText(durum) {
    const durumlar = {
        'var': 'Var',
        'yok': 'Yok',
        'gec': 'Geç Geldi',
        'izinli': 'İzinli'
    };
    return durumlar[durum] || durum;
}

function formatTarih(tarih) {
    const date = new Date(tarih);
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
    });
}

function geriDon() {
    window.location.href = 'yetkili-panel.html';
}

// Modal kapatma işlemleri
document.querySelector('.close').onclick = function() {
    document.getElementById('gecmisModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('gecmisModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}