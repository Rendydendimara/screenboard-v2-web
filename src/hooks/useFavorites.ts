import { ScreenPublic } from "@/pages/Index";
import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<ScreenPublic[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteScreens");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing favorites:", error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: ScreenPublic[]) => {
    localStorage.setItem("favoriteScreens", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addToFavorites = (screen: ScreenPublic) => {
    const exists = favorites.find((fav) => fav.id === screen.id);
    if (!exists) {
      const newFavorites = [...favorites, screen];
      saveFavorites(newFavorites);
      return true;
    }
    return false;
  };

  const removeFromFavorites = (screenId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== screenId);
    saveFavorites(newFavorites);
  };

  const isFavorite = (screenId: string) => {
    return favorites.some((fav) => fav.id === screenId);
  };

  const toggleFavorite = (screen: ScreenPublic) => {
    if (isFavorite(screen.id)) {
      removeFromFavorites(screen.id);
      return false;
    } else {
      addToFavorites(screen);
      return true;
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};
