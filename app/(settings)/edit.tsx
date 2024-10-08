import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { useHandlers } from "@/assets/handlers/handler";
import { UserType } from "@/constants/interfaces";
import { useRouter } from "expo-router";
import GradientBackground from "@/components/gradientBg";
import { stylesEdit, stylesSettings } from "@/assets/styles/styles";
import FeatherIcon from "react-native-vector-icons/Feather";

export default function Edit() {
  const [user, setUser] = useState<UserType>({} as UserType);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { handleUser, handleUpdateUser } = useHandlers();
  const navigation = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await handleUser();
        setUser(userData);
        setFormData({
          name: userData.name,
          lastName: userData.lastName,
          email: userData.Email,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    const { name, lastName, email, password, confirmPassword } = formData;

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const newUserData = await handleUpdateUser();
      setUser(newUserData);
      setFormData((prevData) => ({
        ...prevData,
        password: "",
        confirmPassword: "",
      }));
      setModalVisible(false);
      alert("User information updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={stylesEdit.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={stylesEdit.container}>
        <View style={stylesSettings.header}>
          <View style={stylesSettings.headerAction}>
            <TouchableOpacity
              onPress={() => {
                navigation.push("/(settings)/settings");
              }}
            >
              <FeatherIcon color="#000" name="arrow-left" size={24} />
            </TouchableOpacity>
          </View>

          <Text numberOfLines={1} style={stylesSettings.headerTitle}>
            Settings
          </Text>

          <View
            style={[stylesSettings.headerAction, { alignItems: "flex-end" }]}
          >
            <TouchableOpacity onPress={() => {}}>
              <FeatherIcon color="#000" name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={stylesEdit.content}>
          <View style={stylesEdit.form}>
            <View style={stylesEdit.avatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
                }}
                style={stylesEdit.avatar}
              />
              <TouchableOpacity>
                <Text style={{ color: "#007aff" }}>Change Avatar</Text>
              </TouchableOpacity>
            </View>

            <Text style={stylesEdit.label}>Name</Text>
            <TextInput
              style={stylesEdit.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text style={stylesEdit.label}>Last Name</Text>
            <TextInput
              style={stylesEdit.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
            />

            <Text style={stylesEdit.label}>Email</Text>
            <TextInput
              style={stylesEdit.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />

            <Text style={stylesEdit.label}>Password</Text>
            <TextInput
              style={stylesEdit.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
            />

            <Text style={stylesEdit.label}>Confirm Password</Text>
            <TextInput
              style={stylesEdit.input}
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              secureTextEntry
            />

            <TouchableOpacity
              style={stylesEdit.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={stylesEdit.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={stylesEdit.modalContainer}>
            <View style={stylesEdit.modalContent}>
              <Text style={stylesEdit.modalText}>Confirm changes?</Text>
              <View style={stylesEdit.modalButtonContainer}>
                <TouchableOpacity
                  style={[
                    stylesEdit.modalButton,
                    stylesEdit.modalButtonConfirm,
                  ]}
                  onPress={handleSave}
                >
                  <Text style={stylesEdit.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[stylesEdit.modalButton, stylesEdit.modalButtonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={stylesEdit.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
}
