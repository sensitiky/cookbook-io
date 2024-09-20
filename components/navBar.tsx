import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const ICON_SIZE = 24;

interface NavItemProps {
  label: string;
  icon: string;
  activeIcon: string;
  onPress: () => void;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  activeIcon,
  onPress,
  isActive,
}) => (
  <Pressable
    onPress={onPress}
    style={styles.navItem}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Icon
      name={isActive ? activeIcon : icon}
      size={ICON_SIZE}
      color={isActive ? '#007AFF' : '#8E8E93'}
    />
    <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
      {label}
    </Text>
  </Pressable>
);

export default function ModernNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/(home)/home',
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'search-outline',
      activeIcon: 'search',
      route: '/(main)/main',
    },
    {
      id: 'profile',
      label: 'Settings',
      icon: 'settings-outline',
      activeIcon: 'person',
      route: '/(settings)/settings',
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            activeIcon={item.activeIcon}
            onPress={() => handleNavigation(item.route)}
            isActive={pathname.includes(item.route)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F2F2F7',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#8E8E93',
  },
  activeNavLabel: {
    color: '#007AFF',
  },
});
