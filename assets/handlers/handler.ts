import { UserType } from "@/constants/interfaces";
import { useAuth } from "@/hooks/useContext";

export const useHandlers = () => {
  const {
    login,
    logout,
    register,
    updateAndFetchUser,
    getUser,
    isAuthenticated,
  } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login failed", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleUser = async () => {
    try {
      return await getUser();
    } catch (error: any) {
      console.error("Error fetching user data");
      alert(`Session failed, ${error.message}`);
      throw error;
    }
  };

  const handleUpdateUser = async () => {
    try {
      return await getUser();
    } catch (error: any) {
      console.error("Error updating user data");
      alert(`Update failed, ${error.message}`);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Logout failed", error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const handleRegister = async (
    name: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    try {
      await register(name, lastName, email, password);
    } catch (error: any) {
      console.error("Registration failed", error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleRecipe = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=4f2632d6&app_key=3fc27f1a9f42619acb225ed195898e5d&field=image&field=label&field=calories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();

      const recipes = data.hits.map((hit: any) => ({
        image: hit.recipe.image,
        label: hit.recipe.label,
        calories: Math.round(hit.recipe.calories),
        ingredients: hit.recipe.ingredientLines,
        nutrients: hit.recipe.totalNutrients,
        recipe: hit.recipe.url,
      }));
      return recipes;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  return {
    handleLogin,
    handleLogout,
    handleRegister,
    handleUser,
    handleUpdateUser,
    handleRecipe,
    isAuthenticated,
  };
};
