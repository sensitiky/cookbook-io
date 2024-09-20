import { UserType } from '@/constants/interfaces';
import { router } from 'expo-router';
import { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextValue {
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  getUser: () => Promise<UserType>;
  updateUser: (user: UserType) => Promise<UserType>;
  updateAndFetchUser: (user: UserType) => Promise<UserType>;
  logout: () => Promise<void>;
}

const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await fetch('http://192.168.100.59:4000/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      router.navigate('/(home)/home');
    }
  } catch (error) {
    console.error('Error in login', error);
    throw error;
  }
};

const getUser = async (): Promise<UserType> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://192.168.100.59:4000/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data');
    throw error;
  }
};

const updateUser = async (user: UserType): Promise<UserType> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    if (!user.userID) {
      throw new Error('User ID is missing');
    }
    const response = await fetch(
      `http://192.168.100.59:4000/user/${user.userID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify(user),
      }
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

const updateAndFetchUser = async (user: UserType): Promise<UserType> => {
  try {
    await updateUser(user);
    return await getUser();
  } catch (error) {
    console.error('Error updating and fetching user data:', error);
    throw error;
  }
};

const register = async (
  name: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    const response = await fetch('http://192.168.100.59:4000/register', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ name, lastName, email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      router.navigate('/(home)/home');
    }
  } catch (error) {
    console.error('Error in register', error);
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://192.168.100.59:4000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    await AsyncStorage.removeItem('token');
    router.navigate('/');
  } catch (error) {
    console.error('Error in logout', error);
    throw error;
  }
};

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication', error);
    return false;
  }
};

const defaultAuthContextValue: AuthContextValue = {
  login,
  register,
  getUser,
  updateUser,
  updateAndFetchUser,
  isAuthenticated,
  logout,
};

const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
