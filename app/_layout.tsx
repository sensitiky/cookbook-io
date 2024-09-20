import { Stack } from 'expo-router';
import { useHandlers } from '@/assets/handlers/handler';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated } = useHandlers();
  const navigation = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          navigation.back('/');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        navigation.replace('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(home)/home"
        options={{ headerTitle: '', headerShown: false }}
      />
      <Stack.Screen
        name="(main)/main"
        options={{ headerTitle: '', headerShown: false }}
      />
      <Stack.Screen
        name="(settings)/settings"
        options={{ headerTitle: '', headerShown: false }}
      />
      <Stack.Screen
        name="(settings)/edit"
        options={{ headerTitle: '', headerShown: false }}
      />
    </Stack>
  );
}
