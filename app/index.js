import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UrunKarti from '../components/UrunKarti';
import { useRouter } from 'expo-router';
import { useSepet } from '../context/SepetContext';
import { colors } from '../utils/tema';
import { urunleriGetir } from '../utils/urunler';

export default function UrunlerScreen() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [deneme, setDeneme] = useState(0);
  const [urunler, setUrunler] = useState([]);
  const [arama, setArama] = useState('');
  const { sepet, sepeteEkle, toplamAdet, eksikGorselleriTamamla } = useSepet();
  const sorgu = arama.trim();

  useEffect(() => {
    const istek = new AbortController();
    async function yukle() {
      setYukleniyor(true);
      setHata('');
      try {
        const liste = await urunleriGetir(istek.signal, sorgu);
        if (!istek.signal.aborted) {
          setUrunler(liste);
          eksikGorselleriTamamla(liste);
        }
      } catch {
        if (!istek.signal.aborted) setHata('Ürünler yüklenemedi. Bağlantınızı kontrol edin.');
      } finally {
        if (!istek.signal.aborted) setYukleniyor(false);
      }
    }
    const zamanlayici = setTimeout(yukle, sorgu ? 300 : 0);
    return () => {
      clearTimeout(zamanlayici);
      istek.abort();
    };
  }, [deneme, sorgu, eksikGorselleriTamamla]);

  return (
    <SafeAreaView style={styles.guvenliAlan} edges={['bottom', 'left', 'right']}>
      <View style={styles.icerik}>
        <View style={styles.ustBar}>
          <View style={styles.aramaAlani}>
            <TextInput
              value={arama}
              onChangeText={setArama}
              placeholder="Ürün ara"
              placeholderTextColor={colors.disabledText}
              style={styles.aramaGirdisi}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              accessibilityLabel="Ürün adına göre ara"
            />
            {arama.length > 0 ? (
              <Pressable
                onPress={() => setArama('')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Aramayı temizle"
                style={({ pressed }) => [
                  styles.temizle,
                  pressed && styles.basili,
                ]}
              >
                <Text style={styles.temizleYazi}>×</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={() => router.push('/sepet')}
            accessibilityRole="button"
            accessibilityLabel={`Sepete git, sepette ${toplamAdet} adet ürün var`}
            style={({ pressed }) => [styles.sepetDugmesi, pressed && styles.basili]}
          >
            <Text style={styles.sepetYazi}>Sepetim ({toplamAdet})</Text>
          </Pressable>
        </View>

        {yukleniyor ? (
          <ActivityIndicator size="large" color={colors.accent} style={styles.yukleme} />
        ) : hata ? (
          <View style={styles.bosAlan}>
            <Text style={styles.bosBaslik}>{hata}</Text>
            <Pressable
              style={styles.sepetDugmesi}
              accessibilityRole="button"
              onPress={() => setDeneme((onceki) => onceki + 1)}
            >
              <Text style={styles.sepetYazi}>Tekrar Dene</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={urunler}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const satir = sepet.find((sepetSatiri) => sepetSatiri.id === item.id);

              return (
                <UrunKarti
                  urun={item}
                  sepettekiAdet={satir ? satir.adet : 0}
                  onPress={() =>
                    router.push({
                      pathname: '/urun/[id]',
                      params: { id: item.id },
                    })
                  }
                  onSepeteEkle={() => sepeteEkle(item, 1)}
                />
              );
            }}
            contentContainerStyle={styles.liste}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.bosAlan}>
                <Text style={styles.bosBaslik}>
                  {arama.trim() ? 'Aramanıza uygun ürün bulunamadı.' : 'Gösterilecek ürün bulunamadı.'}
                </Text>
                {arama.trim() ? (
                  <Text style={styles.bosAciklama}>Farklı bir kelime deneyin veya aramayı temizleyin.</Text>
                ) : null}
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  guvenliAlan: {
    flex: 1,
    backgroundColor: colors.background,
  },
  icerik: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  ustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  aramaAlani: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  aramaGirdisi: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: colors.text,
  },
  temizle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  temizleYazi: {
    fontSize: 18,
    lineHeight: 20,
    color: colors.muted,
  },
  sepetDugmesi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  sepetYazi: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liste: {
    paddingBottom: 24,
  },
  yukleme: { flex: 1 },
  bosAlan: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  bosBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  bosAciklama: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  basili: {
    opacity: 0.8,
  },
});
