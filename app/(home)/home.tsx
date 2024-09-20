import {
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { stylesHome } from '@/assets/styles/styles';
import { UserType } from '@/constants/interfaces';
import { useHandlers } from '@/assets/handlers/handler';
import NavBar from '@/components/navBar';
import GradientBackground from '@/components/gradientBg';
import * as Location from 'expo-location';

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  const scrollTimer = 2000;
  const { handleUser, handleRecipe } = useHandlers();

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
    const fetchRecipes = async () => {
      try {
        const location = await getLocation();
        const query = generateQuery(location);
        const recipeData: any = await handleRecipe(query);
        if (Array.isArray(recipeData)) {
          setRecipes(recipeData);
        } else {
          console.error('No recipe data returned');
        }
      } catch (error) {
        console.error('Error setting the recipes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: index * (width * 0.8 + 10),
          animated: true,
        });
        index = (index + 1) % recipes.length;
      }
    }, scrollTimer);

    return () => clearInterval(intervalId);
  }, [recipes]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  const generateQuery = (location: Location.LocationObject | null) => {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    let mealType = '';

    if (hours >= 5 && hours < 11) {
      mealType = 'breakfast';
    } else if (hours >= 11 && hours < 17) {
      mealType = 'lunch';
    } else if (hours >= 17 && hours < 22) {
      mealType = 'dinner';
    } else {
      mealType = 'snack';
    }

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayOfWeek = daysOfWeek[day];

    const locationQuery = location
      ? `&location=${location.coords.latitude},${location.coords.longitude}`
      : '';

    return `${mealType} ${dayOfWeek}${locationQuery}`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GradientBackground>
      <View style={stylesHome.container}>
        <View style={stylesHome.cardContainer}>
          <View style={stylesHome.profileBox}>
            <Image
              style={stylesHome.avatar}
              source={{
                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
              }}
            />
            <Text style={stylesHome.nameText}>Welcome {user?.name}!</Text>
          </View>
          <Text style={stylesHome.timeText}>
            For your current time: {currentTime}
          </Text>
          <View style={stylesHome.recipeBox}>
            <Text style={stylesHome.recipeTitle}>We recommend:</Text>
            <Text style={stylesHome.recipeTitle}>Today's Recipes</Text>
            <ScrollView
              horizontal
              ref={scrollViewRef}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {recipes?.map((recipe, index) => (
                <View key={index} style={stylesHome.recipeItem}>
                  <Image
                    source={{ uri: recipe.image }}
                    style={stylesHome.recipeImage}
                  />
                  <Text style={stylesHome.recipeLabel}>{recipe.label}</Text>
                  <Text style={stylesHome.recipeCalories}>
                    Calories: {recipe.calories}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
      <NavBar />
    </GradientBackground>
  );
}
