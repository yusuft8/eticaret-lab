# E-Ticaret Lab

React Native ve Expo ile geliştirilmiş üç ekranlı bir mobil mağaza uygulaması. Ürün kataloğu DummyJSON’dan gelir. Kullanıcı ürün arayabilir, seçtiği ürünün puanını ve indirimli fiyatını inceleyebilir, stok sınırı içinde sepete ürün ekleyebilir.

## Kurulum

Node.js 22.13 veya daha güncel bir 22.x sürümü, npm ve telefonda Expo SDK 58 ile uyumlu Expo Go gerekir.

```sh
git clone https://github.com/yusuft8/eticaret-lab.git
cd eticaret-lab
npm ci --legacy-peer-deps
npx expo start --go
```

Kurulum komutu `package-lock.json` içindeki sürümleri kullanır. `--legacy-peer-deps` seçeneği, mevcut kilit dosyasındaki React ve React DOM eş bağımlılık uyarısını aşmak içindir.

Telefonu ve bilgisayarı aynı ağa bağla. Terminaldeki QR kodu iOS’ta Kamera, Android’de Expo Go ile okut. Katalog ve ürün fotoğrafları için internet bağlantısı gerekir.

## Uygulama akışı

| Ekran | Yapılabilecekler |
| --- | --- |
| Ürünler | İlk 20 ürünü görüntüle. Ürün adını yazarak tüm katalogda ara. Karttan ürünün puanını, fiyatını ve stok durumunu gör. |
| Ürün detayı | Fotoğrafı, açıklamayı, kategoriyi, puanı ve indirim oranını incele. Adedi seçip ürünü sepete ekle. |
| Sepet | Ürün görsellerini, adetleri, satır tutarlarını ve genel toplamı gör. Adet değiştir, ürün kaldır veya alışverişe devam et. |

**Fiyat ve adet hesabı.** Detay ekranı indirimli fiyatı `fiyat × (1 − indirimOranı / 100)` ile hesaplar. Sepet toplamında normal birim fiyat kullanılır. Aynı üründen üç tane eklendiğinde tek sepet satırı oluşur ve ana sayfadaki düğme **Sepetim (3)** olarak güncellenir.

**Sepetin ömrü.** Sepet, React Context ile uygulama belleğinde tutulur. Uygulama tamamen kapatılıp yeniden başlatıldığında boş açılır.

## Kodda nereden başlamalı?

- [Ana ekran](app/index.js) ürünleri listeler, arama isteğini başlatır ve yüklenme, hata ve boş sonuç durumlarını gösterir.
- [Ürün kartı](components/UrunKarti.js) ürün verisini ve düğmelerin işlemlerini props üzerinden alır.
- [Dinamik detay ekranı](app/urun/%5Bid%5D.js) rota parametresindeki ürün kimliğiyle tek ürün getirir.
- [Sepet sağlayıcısı](context/SepetContext.js) adetleri ve toplamları yönetir. [Sepet ekranı](app/sepet.js) bu verilere `useSepet()` ile erişir.
- [API işlemleri](utils/urunler.js) liste, arama ve detay isteklerini yürütür. Veri kaynağı için [DummyJSON ürün belgelerine](https://dummyjson.com/docs/products) bakabilirsin.

## Hızlı kontrol

1. Ana sayfada `phone` ara. Bir sonucu açıp karttaki puanı detay ekranındaki puanla karşılaştır.
2. Stokta en az iki adet olan bir üründen iki tane ekle. Sepette tek satır, iki adet ve normal birim fiyatın iki katı tutar görünmeli.
3. **Alışverişe Devam Et** ile listeye dön. **Sepetim (2)** düğmesini kontrol et. Sepete dönüp ürünü kaldırdığında boş sepet ekranı açılmalı.

## Lisans

Proje [MIT Lisansı](LICENSE) ile sunulur.
