import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSepet } from '../context/SepetContext';
import { formatFiyat, colors } from '../utils/tema';
import SepetOzeti from '../components/SepetOzeti';
import AdetSecici from '../components/AdetSecici';

function SepetGorseli({ urun }) {
  const [hataliAdres, setHataliAdres] = useState('');
  const adres = urun.gorsel === hataliAdres ? urun.alternatifGorsel : urun.gorsel;
  if (!adres) return null;
  return (
    <Image
      source={{ uri: adres }}
      resizeMode="contain"
      style={styles.gorsel}
      accessibilityLabel={urun.ad}
      onError={() => setHataliAdres(urun.gorsel)}
    />
  );
}

export default function SepetScreen() {
  const { sepet, toplamAdet, toplamTutar, adetArtir, adetAzalt, urunKaldir, sepetiBosalt } = useSepet();

  if (sepet.length === 0) {
    return (
      <SafeAreaView
        style={styles.guvenliAlan}
        edges={['bottom', 'left', 'right']}
      >
        <View style={styles.bosAlan}>
          <Text style={styles.bosBaslik}>Sepetiniz boş</Text>
          <Text style={styles.bosAciklama}>Toplam ürün adedi: {toplamAdet}</Text>
          <Text style={styles.bosAciklama}>
            Ürün listesinden beğendiğiniz ürünleri sepete ekleyebilirsiniz.
          </Text>
          <Pressable
            onPress={() => router.navigate('/')}
            accessibilityRole="button"
            accessibilityLabel="Ürün listesine dön"
            style={({ pressed }) => [
              styles.birincilDugme,
              pressed && styles.basili,
            ]}
          >
            <Text style={styles.birincilDugmeYazi}>Ürünlere dön</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.guvenliAlan} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={sepet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        renderItem={({ item }) => {
          return (
            <View style={styles.satir}>
              <View style={styles.satirBasligi}>
                <SepetGorseli urun={item} />
                <Text style={styles.urunAdi} numberOfLines={2}>
                  {item.ad}
                </Text>
                <Pressable
                  onPress={() => urunKaldir(item.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.ad} ürününü sepetten kaldır`}
                  style={({ pressed }) => [
                    styles.kaldirDugmesi,
                    pressed && styles.basili,
                  ]}
                >
                  <Text style={styles.kaldirYazi}>Kaldır</Text>
                </Pressable>
              </View>

              <Text style={styles.birimFiyat}>
                {formatFiyat(item.fiyat)} / adet
              </Text>

              <View style={styles.satirAlt}>
                <AdetSecici
                  adet={item.adet}
                  urunAdi={item.ad}
                  onArtir={() => adetArtir(item.id)}
                  onAzalt={() => adetAzalt(item.id)}
                  eksiKapali={item.adet <= 1}
                  artiKapali={item.adet >= item.stok}
                />
                <Text
                  style={styles.satirTutar}
                  accessibilityLabel={`${item.ad} satır toplamı ${formatFiyat(
                    item.fiyat * item.adet
                  )}`}
                >
                  {formatFiyat(item.fiyat * item.adet)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.altAlan}>
        <SepetOzeti toplamAdet={toplamAdet} toplamTutar={toplamTutar} />

        <Pressable
          onPress={() => router.navigate('/')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.birincilDugme, pressed && styles.basili]}
        >
          <Text style={styles.birincilDugmeYazi}>Alışverişe Devam Et</Text>
        </Pressable>

        <Pressable
          onPress={sepetiBosalt}
          accessibilityRole="button"
          accessibilityLabel="Sepeti boşalt"
          style={({ pressed }) => [
            styles.bosaltDugmesi,
            pressed && styles.basili,
          ]}
        >
          <Text style={styles.bosaltYazi}>Sepeti boşalt</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  guvenliAlan: {
    flex: 1,
    backgroundColor: colors.background,
  },
  liste: {
    padding: 16,
    paddingBottom: 8,
  },
  satir: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    gap: 4,
  },
  satirBasligi: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  gorsel: {
    width: 90,
    height: 90,
  },
  urunAdi: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  kaldirDugmesi: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FBEAEA',
  },
  kaldirYazi: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
  birimFiyat: {
    fontSize: 13,
    color: colors.muted,
  },
  satirAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  satirTutar: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  altAlan: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  bosaltDugmesi: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bosaltYazi: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
  },
  bosAlan: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  bosBaslik: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  bosAciklama: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 6,
  },
  birincilDugme: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  birincilDugmeYazi: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  basili: {
    opacity: 0.8,
  },
});
