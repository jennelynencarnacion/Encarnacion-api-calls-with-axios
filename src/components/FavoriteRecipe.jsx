// components/FavoriteRecipes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recipe from './Recipe';

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const response = await axios.get('https://your-api-url.com/favorites');
        setFavoriteRecipes(response.data);
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  return (
    <div>
      <h1>Favorite Recipes</h1>
      <div>
        {favoriteRecipes.map(recipe => (
          <Recipe key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
