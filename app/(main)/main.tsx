import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { stylesMain, stylesSettings } from '@/assets/styles/styles';
import { UserType } from '@/constants/interfaces';
import { useHandlers } from '@/assets/handlers/handler';
import NavBar from '@/components/navBar';
import GradientBackground from '@/components/gradientBg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function Main() {
  const [user, setUser] = useState<UserType | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useRouter();

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
        const recipeData: any = await handleRecipe(searchQuery);
        if (Array.isArray(recipeData)) {
          setRecipes(recipeData);
        } else {
          console.error('No recipe data returned');
        }
      } catch (error) {
        console.error('Error setting the recipes', error);
      }
    };
    fetchRecipes();
  }, [searchQuery]);

  const handleRecipePress = (recipe: any) => {
    setSelectedRecipe(recipe);
  };

  const handleBackPress = () => {
    setSelectedRecipe(null);
  };
  return (
    <GradientBackground>
      <View style={stylesSettings.header}>
        <View style={stylesSettings.headerAction}>
          <TouchableOpacity
            onPress={() => {
              navigation.back();
            }}
          >
            <FeatherIcon color="#000" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={stylesSettings.headerTitle}>
          Recipe
        </Text>

        <View style={[stylesSettings.headerAction, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <FeatherIcon color="#000" name="more-vertical" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={stylesMain.container}>
        <Text style={stylesMain.searchTitle}>Look for fun recipes</Text>
        <TextInput
          style={stylesMain.searchInput}
          placeholder="Search.."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {selectedRecipe ? (
          <ScrollView style={stylesMain.recipeDetailContainer}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={stylesMain.backButton}
            >
              <FeatherIcon color="#000" name="arrow-left" size={24} />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedRecipe.image }}
              style={stylesMain.recipeDetailImage}
            />
            <Text style={stylesMain.recipeDetailLabel}>
              {selectedRecipe.label}
            </Text>
            <Text style={stylesMain.recipeDetailSectionTitle}>
              Ingredients:
            </Text>
            {selectedRecipe.ingredients?.map(
              (ingredient: string, index: number) => (
                <Text key={index} style={stylesMain.recipeDetailText}>
                  {ingredient}
                </Text>
              )
            )}
            <Text style={stylesMain.recipeDetailSectionTitle}>Recipe:</Text>
            <Text style={stylesMain.recipeDetailText}>
              <Text
                style={stylesMain.recipeDetailLink}
                onPress={() => Linking.openURL(selectedRecipe.recipe)}
              >
                View full recipe
              </Text>
            </Text>
            <Text style={stylesMain.recipeDetailSectionTitle}>Nutrients:</Text>
            {selectedRecipe.nutrients &&
              Object.entries(selectedRecipe.nutrients).map(
                ([key, value], index) => (
                  <Text
                    key={index}
                    style={stylesMain.recipeDetailText}
                  >{`${key}: ${
                    (value as { quantity: number; unit: string }).quantity
                  } ${
                    (value as { quantity: number; unit: string }).unit
                  }`}</Text>
                )
              )}
          </ScrollView>
        ) : (
          <ScrollView style={stylesMain.scrollView}>
            <View style={stylesMain.cardContainer}>
              <View style={stylesMain.recipeBox}>
                <Text style={stylesMain.recipeTitle}>
                  What's gonna be today?
                </Text>
                {recipes?.map((recipe, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecipePress(recipe)}
                    style={stylesMain.recipeItem}
                  >
                    <Image
                      source={{ uri: recipe.image }}
                      style={stylesMain.recipeImage}
                    />
                    <Text style={stylesMain.recipeLabel}>{recipe.label}</Text>
                    <Text style={stylesMain.recipeCalories}>
                      Calories: {recipe.calories}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
        <NavBar />
      </View>
    </GradientBackground>
  );
}
