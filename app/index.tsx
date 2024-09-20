import { Pressable, TextInput, View, Text, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useHandlers } from '@/assets/handlers/handler';
import { styles } from '@/assets/styles/styles';
import { useRouter } from 'expo-router';

export default function Index() {
  const { handleLogin, handleRegister } = useHandlers();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#f0f4f7', '#d9e2ec']}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        {showRegister ? (
          <>
            <TextInput
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="Name"
              style={styles.input}
              textContentType="emailAddress"
              placeholderTextColor="#8e8e93"
            />
            <TextInput
              onChangeText={(text) => setLastName(text)}
              value={lastName}
              placeholder="Last Name"
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#8e8e93"
            />
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Email"
              style={styles.input}
              textContentType="emailAddress"
              placeholderTextColor="#8e8e93"
            />
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#8e8e93"
            />
            <Pressable
              testID="Register"
              onPress={() => handleRegister(name, lastName, email, password)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Email"
              style={styles.input}
              textContentType="emailAddress"
              placeholderTextColor="#8e8e93"
            />
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#8e8e93"
            />
            <Pressable
              testID="Login"
              onPress={() => handleLogin(email, password)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </>
        )}
        <Pressable
          style={styles.switchToRegister}
          testID="SwitchForm"
          onPress={() => setShowRegister(!showRegister)}
        >
          <Text style={styles.switchText}>
            {showRegister
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Text style={styles.registerText}>
              {showRegister ? 'Login' : 'Register'}
            </Text>
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
