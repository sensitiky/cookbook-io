import { useHandlers } from '@/assets/handlers/handler';
import { UserType } from '@/constants/interfaces';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { stylesSettings } from '@/assets/styles/styles';
import * as Location from 'expo-location';
import NavBar from '@/components/navBar';
import { useRouter } from 'expo-router';
import GradientBackground from '@/components/gradientBg';
import axios from 'axios';

export default function Settings() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const [city, setCity] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string>();
  const { handleLogout, handleUser, handleUpdateUser } = useHandlers();
  const navigation = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await handleUser();
        setUser(userData);
      } catch (error) {
        console.error('Error setting user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      try {
        if (user) {
          const userData = await handleUpdateUser(user);
          setUser(userData);
        }
      } catch (error: any) {
        console.error('Error setting user data:', error);
      }
    };
    updateUser();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        await getCityName(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    };

    const getCityName = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const city =
          response.data.address.city ||
          response.data.address.town ||
          response.data.address.village;
        setCity(city);
      } catch (error) {
        console.error('Error getting city name:', error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={stylesSettings.header}>
          <View style={stylesSettings.headerAction}>
            <TouchableOpacity
              onPress={() => {
                navigation.push('/(home)/home');
              }}
            >
              <FeatherIcon color="#000" name="arrow-left" size={24} />
            </TouchableOpacity>
          </View>

          <Text numberOfLines={1} style={stylesSettings.headerTitle}>
            Settings
          </Text>

          <View
            style={[stylesSettings.headerAction, { alignItems: 'flex-end' }]}
          >
            <TouchableOpacity onPress={() => {}}>
              <FeatherIcon color="#000" name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={stylesSettings.content}>
          <View style={[stylesSettings.section, { paddingTop: 4 }]}>
            <Text style={stylesSettings.sectionTitle}>Account</Text>

            <View style={stylesSettings.sectionBody}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push('/edit');
                }}
                style={stylesSettings.profile}
              >
                <Image
                  alt=""
                  source={{
                    uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
                  }}
                  style={stylesSettings.profileAvatar}
                />

                <View style={stylesSettings.profileBody}>
                  <Text style={stylesSettings.profileName}>{user?.name}</Text>

                  <Text style={stylesSettings.profileHandle}>
                    {user?.Email}
                  </Text>
                </View>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={stylesSettings.section}>
            <Text style={stylesSettings.sectionTitle}>Preferences</Text>

            <View style={stylesSettings.sectionBody}>
              <View
                style={[stylesSettings.rowWrapper, stylesSettings.rowFirst]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Language</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <Text style={stylesSettings.rowValue}>English</Text>

                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>

              <View style={stylesSettings.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Location</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <Text style={stylesSettings.rowValue}>City: {city}</Text>
                </TouchableOpacity>
              </View>

              <View style={stylesSettings.rowWrapper}>
                <View style={stylesSettings.row}>
                  <Text style={stylesSettings.rowLabel}>
                    Email Notifications
                  </Text>

                  <View style={stylesSettings.rowSpacer} />

                  <Switch
                    onValueChange={(emailNotifications) =>
                      setForm({ ...form, emailNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.emailNotifications}
                  />
                </View>
              </View>

              <View style={[stylesSettings.rowWrapper, stylesSettings.rowLast]}>
                <View style={stylesSettings.row}>
                  <Text style={stylesSettings.rowLabel}>
                    Push Notifications
                  </Text>

                  <View style={stylesSettings.rowSpacer} />

                  <Switch
                    onValueChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.pushNotifications}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={stylesSettings.section}>
            <Text style={stylesSettings.sectionTitle}>Resources</Text>

            <View style={stylesSettings.sectionBody}>
              <View
                style={[stylesSettings.rowWrapper, stylesSettings.rowFirst]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Contact Us</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>

              <View style={stylesSettings.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Report Bug</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>

              <View style={stylesSettings.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Rate in App Store</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>

              <View style={[stylesSettings.rowWrapper, stylesSettings.rowLast]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={stylesSettings.row}
                >
                  <Text style={stylesSettings.rowLabel}>Terms and Privacy</Text>

                  <View style={stylesSettings.rowSpacer} />

                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={stylesSettings.section}>
            <View style={stylesSettings.sectionBody}>
              <View
                style={[
                  stylesSettings.rowWrapper,
                  stylesSettings.rowFirst,
                  stylesSettings.rowLast,
                  { alignItems: 'center' },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleLogout();
                  }}
                  style={stylesSettings.row}
                >
                  <Text
                    style={[
                      stylesSettings.rowLabel,
                      stylesSettings.rowLabelLogout,
                    ]}
                  >
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={stylesSettings.contentFooter}>
            Cookbook-io Version 0.1 #1
          </Text>
        </ScrollView>
        <NavBar />
      </SafeAreaView>
    </GradientBackground>
  );
}
