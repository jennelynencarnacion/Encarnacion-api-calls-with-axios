import React from 'react';
import axios from 'axios';

const Recipe = ({ recipe }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await axios.delete(`https://serverless-encarnacion.netlify.app/.netlify/functions/api/${recipe.id}`);
                alert('Recipe deleted successfully');
                // Implement logic to remove the recipe from the UI
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
            <p>{recipe.ingredients}</p>
            <p>{recipe.instructions}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default Recipe;
