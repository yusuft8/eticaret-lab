import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const SepetContext = createContext(null);

export function SepetProvider({ children }) {
  const [sepet, setSepet] = useState([]);

  const eksikGorselleriTamamla = useCallback((urunler) => {
    setSepet((onceki) => {
      if (!onceki.some((satir) => !satir.gorsel)) return onceki;
      return onceki.map((satir) => {
        if (satir.gorsel) return satir;
        const urun = urunler.find((item) => String(item.id) === String(satir.id));
        return urun?.gorsel
          ? { ...satir, gorsel: urun.gorsel, alternatifGorsel: urun.alternatifGorsel }
          : satir;
      });
    });
  }, []);

  const sepeteEkle = useCallback((urun, adet = 1) => {
    if (urun.stok <= 0 || adet <= 0) return;
    setSepet((onceki) => {
      const mevcut = onceki.find((satir) => satir.id === urun.id);

      if (mevcut) {
        const yeniAdet = Math.min(mevcut.adet + adet, urun.stok);
        if (yeniAdet === mevcut.adet && mevcut.gorsel === urun.gorsel) return onceki;

        return onceki.map((satir) =>
          satir.id === urun.id ? { ...satir, ...urun, adet: yeniAdet } : satir
        );
      }

      return [
        ...onceki,
        {
          ...urun,
          adet: Math.min(adet, urun.stok),
        },
      ];
    });
  }, []);

  const adetArtir = useCallback((id) => {
    setSepet((onceki) =>
      onceki.map((satir) => {
        if (satir.id !== id || satir.adet >= satir.stok) return satir;

        return { ...satir, adet: satir.adet + 1 };
      })
    );
  }, []);

  const adetAzalt = useCallback((id) => {
    setSepet((onceki) =>
      onceki.map((satir) =>
        satir.id === id
          ? { ...satir, adet: Math.max(1, satir.adet - 1) }
          : satir
      )
    );
  }, []);

  const urunKaldir = useCallback((id) => {
    setSepet((onceki) => onceki.filter((satir) => satir.id !== id));
  }, []);

  const sepetiBosalt = useCallback(() => {
    setSepet([]);
  }, []);

  const deger = useMemo(
    () => ({
      sepet,
      toplamAdet: sepet.reduce((toplam, satir) => toplam + satir.adet, 0),
      toplamTutar: sepet.reduce((toplam, satir) => toplam + satir.fiyat * satir.adet, 0),
      sepeteEkle,
      eksikGorselleriTamamla,
      adetArtir,
      adetAzalt,
      urunKaldir,
      sepetiBosalt,
    }),
    [sepet, sepeteEkle, eksikGorselleriTamamla, adetArtir, adetAzalt, urunKaldir, sepetiBosalt]
  );

  return (
    <SepetContext.Provider value={deger}>{children}</SepetContext.Provider>
  );
}

export function useSepet() {
  const deger = useContext(SepetContext);

  if (!deger) {
    throw new Error('useSepet yalnızca SepetProvider içinde kullanılabilir.');
  }

  return deger;
}
