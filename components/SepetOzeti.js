import { StyleSheet, Text, View } from 'react-native';
import { formatFiyat, colors } from '../utils/tema';

export default function SepetOzeti({ toplamAdet, toplamTutar }) {
  return (
    <View style={styles.kapsayici}>
      <View style={styles.satir}>
        <Text style={styles.etiket}>Toplam adet</Text>
        <Text
          style={styles.deger}
          accessibilityLabel={`Sepette toplam ${toplamAdet} adet ürün var`}
        >
          {toplamAdet}
        </Text>
      </View>

      <View style={styles.ayrac} />

      <View style={styles.satir}>
        <Text style={styles.etiket}>Toplam tutar</Text>
        <Text
          style={styles.tutar}
          accessibilityLabel={`Sepet toplam tutarı ${formatFiyat(toplamTutar)}`}
        >
          {formatFiyat(toplamTutar)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kapsayici: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ayrac: {
    height: 1,
    backgroundColor: colors.border,
  },
  etiket: {
    fontSize: 15,
    color: colors.muted,
  },
  deger: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  tutar: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.accent,
  },
});