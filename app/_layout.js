import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SepetProvider } from '../context/SepetContext';
import { colors } from '../utils/tema';

export default function RootLayout() {
  return (
    <SepetProvider>
      <StatusBar style="dark" />
      <Stack
        id="magaza"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'E-Ticaret Mağazam' }} />
        <Stack.Screen name="urun/[id]" options={{ title: 'Ürün detayı' }} />
        <Stack.Screen name="sepet" options={{ title: 'Sepetim' }} />
      </Stack>
    </SepetProvider>
  );
}
