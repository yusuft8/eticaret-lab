import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/tema';

export default function AdetSecici({
  adet,
  onArtir,
  onAzalt,
  eksiKapali = false,
  artiKapali = false,
  urunAdi = 'Ürün',
}) {
  return (
    <View style={styles.kapsayici}>
      <Pressable
        onPress={onAzalt}
        disabled={eksiKapali}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${urunAdi} adedini azalt`}
        accessibilityState={{ disabled: eksiKapali }}
        style={({ pressed }) => [
          styles.dugme,
          eksiKapali && styles.dugmeKapali,
          pressed && !eksiKapali && styles.dugmeBasili,
        ]}
      >
        <Text style={[styles.dugmeYazi, eksiKapali && styles.yaziKapali]}>
          −
        </Text>
      </Pressable>

      <Text
        style={styles.adet}
        accessibilityLabel={`${urunAdi} seçili adet ${adet}`}
      >
        {adet}
      </Text>

      <Pressable
        onPress={onArtir}
        disabled={artiKapali}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${urunAdi} adedini artır`}
        accessibilityState={{ disabled: artiKapali }}
        style={({ pressed }) => [
          styles.dugme,
          artiKapali && styles.dugmeKapali,
          pressed && !artiKapali && styles.dugmeBasili,
        ]}
      >
        <Text style={[styles.dugmeYazi, artiKapali && styles.yaziKapali]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kapsayici: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 3,
    backgroundColor: colors.card,
  },
  dugme: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dugmeKapali: {
    backgroundColor: colors.disabled,
  },
  dugmeBasili: {
    backgroundColor: '#D3E6DA',
  },
  dugmeYazi: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.accent,
  },
  yaziKapali: {
    color: colors.disabledText,
  },
  adet: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});