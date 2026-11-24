const urunlerUrl = 'https://dummyjson.com/products';

function urunuDonustur(veri) {
  return {
    id: String(veri.id),
    ad: veri.title,
    fiyat: veri.price,
    indirimOrani: veri.discountPercentage ?? 0,
    stok: veri.stock,
    gorsel: veri.thumbnail || veri.images?.[0],
    alternatifGorsel: veri.images?.[0],
    kategori: veri.category,
    puan: veri.rating,
    aciklama: veri.description,
  };
}

export async function urunleriGetir(signal, sorgu = '') {
  const url = sorgu
    ? `${urunlerUrl}/search?q=${encodeURIComponent(sorgu)}`
    : `${urunlerUrl}?limit=20`;
  const cevap = await fetch(url, { signal });
  if (!cevap.ok) throw new Error('Ürün listesi alınamadı.');
  const veri = await cevap.json();
  return veri.products.map(urunuDonustur);
}

export async function urunGetir(id, signal) {
  if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
    throw new Error('Geçersiz ürün numarası.');
  }
  const cevap = await fetch(`${urunlerUrl}/${id}`, { signal });
  if (!cevap.ok) {
    throw new Error(cevap.status === 404 ? 'Ürün bulunamadı.' : 'Ürün bilgisi alınamadı.');
  }
  return urunuDonustur(await cevap.json());
}
