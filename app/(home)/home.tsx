import { Text, View, StyleSheet, Image } from "react-native";
import { userType, User } from "@/constants/User";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<userType | null>(null);

  useEffect(() => {
    setUser(User[0]);
  });
  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Image
          style={styles.avatar}
          source={require("../../assets/images/favicon.png")}
        />
        <Text style={styles.avatarText}>
          User: <br />
          {user?.User}
        </Text>
        <Text style={styles.avatarText}>
          Name: <br />
          {user?.Name}
        </Text>
        <Text style={styles.avatarText}>Email: {user?.Email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignContent: "center",
  },
  profileBox: {
    alignItems: "center",
  },
  avatar: {
    padding: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: "#fff",
    flexDirection: "column",
  },
});
