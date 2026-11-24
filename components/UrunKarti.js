import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, formatFiyat } from '../utils/tema';

export default function UrunKarti({
  urun,
  onPress,
  onSepeteEkle,
  sepettekiAdet = 0,
}) {
  const stokta = urun.stok > 0;
  const sinirDoldu = sepettekiAdet >= urun.stok;
  const eklenemez = !stokta || sinirDoldu;

  let eklemeYazisi = 'Sepete ekle';
  if (!stokta) eklemeYazisi = 'Stok yok';
  else if (sinirDoldu) eklemeYazisi = 'Stok sınırı';

  // Görsel source'u network URL' veya local require olabilir
  const gorselSource =
    typeof urun.gorsel === 'string' && urun.gorsel.startsWith('http')
      ? { uri: urun.gorsel }
      : urun.gorsel;

  return (
    <View style={styles.kart}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${urun.ad} ürününün detayını aç`}
        style={({ pressed }) => [styles.gorselAlan, pressed && styles.basili]}
      >
        <Image source={gorselSource} style={styles.gorsel} resizeMode="contain" />
      </Pressable>

      <View style={styles.bilgi}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${urun.ad} ürününün detayını aç`}
        >
          <Text style={styles.ad} numberOfLines={2}>
            {urun.ad}
          </Text>
          <Text style={styles.fiyat}>{formatFiyat(urun.fiyat)}</Text>
        </Pressable>

        <Text style={styles.ayrinti}>Puan: {urun.puan}</Text>
        <Text style={[styles.ayrinti, !stokta && styles.stokYok]}>
          {stokta ? `Stokta ${urun.stok} adet` : 'Stokta yok'}
        </Text>

        {sepettekiAdet > 0 ? (
          <Text style={styles.sepette}>Sepetinizde {sepettekiAdet} adet</Text>
        ) : null}

        <View style={styles.eylemler}>
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${urun.ad} detay`}
            style={({ pressed }) => [
              styles.dugme,
              styles.dugmeIkincil,
              pressed && styles.dugmeBasili,
            ]}
          >
            <Text style={styles.dugmeYaziIkincil}>Detay</Text>
          </Pressable>

          <Pressable
            onPress={onSepeteEkle}
            disabled={eklenemez}
            accessibilityRole="button"
            accessibilityLabel={`${urun.ad} ürününü sepete ekle`}
            accessibilityState={{ disabled: eklenemez }}
            style={({ pressed }) => [
              styles.dugme,
              styles.dugmeBirincil,
              eklenemez && styles.dugmeKapali,
              pressed && !eklenemez && styles.dugmeBasili,
            ]}
          >
            <Text
              style={[
                styles.dugmeYaziBirincil,
                eklenemez && styles.dugmeYaziKapali,
              ]}
            >
              {eklemeYazisi}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#0F2418',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  gorselAlan: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  basili: {
    opacity: 0.85,
  },
  gorsel: {
    width: 104,
    height: 104,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  bilgi: {
    flex: 1,
    gap: 4,
  },
  ad: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  fiyat: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.accent,
    marginTop: 2,
  },
  ayrinti: {
    fontSize: 13,
    color: colors.muted,
  },
  stokYok: {
    color: colors.danger,
    fontWeight: '600',
  },
  sepette: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  eylemler: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  dugme: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dugmeBirincil: {
    backgroundColor: colors.accent,
    flexGrow: 1,
  },
  dugmeIkincil: {
    backgroundColor: colors.accentSoft,
  },
  dugmeKapali: {
    backgroundColor: colors.disabled,
  },
  dugmeBasili: {
    opacity: 0.8,
  },
  dugmeYaziBirincil: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dugmeYaziIkincil: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  dugmeYaziKapali: {
    color: colors.disabledText,
  },
});
