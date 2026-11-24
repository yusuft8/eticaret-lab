import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import AdetSecici from '../../components/AdetSecici';
import { useSepet } from '../../context/SepetContext';
import { colors, formatFiyat } from '../../utils/tema';
import { urunGetir } from '../../utils/urunler';

export default function UrunDetayScreen() {
  const { id } = useLocalSearchParams();
  return <UrunDetay key={String(id)} id={id} />;
}

function UrunDetay({ id }) {
  const router = useRouter();
  const { sepet, sepeteEkle } = useSepet();
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [adet, setAdet] = useState(1);

  useEffect(() => {
    const istek = new AbortController();
    async function yukle() {
      try {
        const veri = await urunGetir(id, istek.signal);
        if (!istek.signal.aborted) setUrun(veri);
      } catch (error) {
        if (!istek.signal.aborted) {
          setHata(error instanceof TypeError ? 'Bağlantı kurulamadı.' : error.message);
        }
      } finally {
        if (!istek.signal.aborted) setYukleniyor(false);
      }
    }
    yukle();
    return () => istek.abort();
  }, [id]);

  const sepettekiAdet = sepet.find((satir) => satir.id === id)?.adet ?? 0;
  const kalan = Math.max(0, (urun?.stok ?? 0) - sepettekiAdet);
  const secilen = Math.min(adet, kalan);

  return (
    <>
      <Stack.Screen options={{ title: urun?.ad ?? 'Ürün Detayı' }} />
      <SafeAreaView style={styles.alan} edges={['bottom', 'left', 'right']}>
        {yukleniyor ? (
          <ActivityIndicator style={styles.yukleme} size="large" color={colors.accent} />
        ) : hata || !urun ? (
          <Text style={styles.hata}>{hata || 'Ürün bilgisi bulunamadı.'}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.icerik}>
            <Image source={{ uri: urun.gorsel }} style={styles.gorsel} resizeMode="contain" />
            <Text style={styles.baslik}>{urun.ad}</Text>
            <Text style={styles.fiyat}>{formatFiyat(urun.fiyat)}</Text>
            <Text style={styles.metin}>İndirim: %{urun.indirimOrani}</Text>
            <Text style={styles.altBaslik}>
              İndirimli fiyat: {formatFiyat(urun.fiyat * (1 - urun.indirimOrani / 100))}
            </Text>
            <Text style={styles.metin}>Kategori: {urun.kategori}</Text>
            <Text style={styles.metin}>Puan: {urun.puan}</Text>
            <Text style={styles.altBaslik}>Ürün Açıklaması</Text>
            <Text style={styles.metin}>{urun.aciklama}</Text>
            <Text style={styles.metin}>Stokta {urun.stok} adet</Text>
            <AdetSecici
              urunAdi={urun.ad}
              adet={secilen}
              eksiKapali={secilen <= 1}
              artiKapali={secilen >= kalan}
              onAzalt={() => setAdet(Math.max(1, secilen - 1))}
              onArtir={() => setAdet(Math.min(kalan, secilen + 1))}
            />
            <Pressable
              disabled={!kalan}
              accessibilityRole="button"
              accessibilityState={{ disabled: !kalan }}
              style={({ pressed }) => [styles.dugme, (!kalan || pressed) && styles.soluk]}
              onPress={() => {
                sepeteEkle(urun, secilen);
                router.push('/sepet');
              }}
            >
              <Text style={styles.dugmeYazi}>
                {kalan ? 'Sepete Ekle' : urun.stok ? 'Stok sınırına ulaşıldı' : 'Stokta yok'}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  alan: { flex: 1, backgroundColor: colors.background },
  yukleme: { flex: 1 },
  icerik: { padding: 20, paddingBottom: 35, gap: 12 },
  gorsel: { width: '100%', height: 240 },
  baslik: { fontSize: 22, fontWeight: '700', color: colors.text },
  fiyat: { fontSize: 22, fontWeight: '800', color: colors.accent },
  altBaslik: { fontSize: 17, fontWeight: '700', color: colors.text },
  metin: { fontSize: 15, lineHeight: 23, color: colors.muted },
  hata: { margin: 24, textAlign: 'center', color: colors.danger },
  dugme: {
    minHeight: 48, borderRadius: 12, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  soluk: { opacity: 0.65 },
  dugmeYazi: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
