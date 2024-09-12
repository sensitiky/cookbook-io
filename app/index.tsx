import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useContext';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={['hsla(186, 33%, 94%, 1)', 'hsla(216, 41%, 79%, 1)']}
      >
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          style={styles.input}
          textContentType="emailAddress"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          style={styles.input}
          secureTextEntry
        />
        <Pressable testID="Login" onPress={handleLogin}>
          Login
        </Pressable>
        <Pressable
          style={styles.switchToRegister}
          testID="Don't have an account?"
        >
          Don't have an account? <br />
          Register
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderRadius: 20,
    height: 40,
    width: 100,
    margin: 12,
    padding: 10,
    color: '#fff',
    backgroundColor: '#000',
  },
  switchToRegister: {
    color: '#',
    flexDirection: 'column',
    textAlign: 'center',
  },
});
