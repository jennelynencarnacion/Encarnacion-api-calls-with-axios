import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecipeForm() {
    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [error, setError] = useState(null);
    const [editRecipe, setEditRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        axios.get('https://serverless-encarnacion.netlify.app/.netlify/functions/api/')
            .then(response => {
                setRecipes(response.data);
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !cuisine || !ingredients) {
            setError('Name, cuisine, and ingredients are required');
            return;
        }

        const url = editRecipe ? `https://serverless-encarnacion.netlify.app/.netlify/functions/api/${editRecipe.id}` : 'https://serverless-encarnacion.netlify.app/.netlify/functions/api/';
        const method = editRecipe ? 'put' : 'post';
        const newRecipe = { name, cuisine, ingredients: ingredients.split(',') };

        axios[method](url, newRecipe)
            .then(response => {
                if (editRecipe) {
                    setRecipes(recipes.map(recipe => recipe.id === editRecipe.id ? response.data : recipe));
                } else {
                    setRecipes([...recipes, response.data]);
                }
                setName('');
                setCuisine('');
                setIngredients('');
                setEditRecipe(null);
                setError(null);
            })
            .catch(error => {
                console.error('Error saving recipe:', error);
            });
    };

    const handleEdit = (recipe) => {
        setEditRecipe(recipe);
        setName(recipe.name);
        setCuisine(recipe.cuisine);
        setIngredients(recipe.ingredients.join(', '));
    };

    const handleDelete = (id) => {
        axios.delete(`https://serverless-encarnacion.netlify.app/.netlify/functions/api/${id}`)
            .then(() => {
                setRecipes(recipes.filter(recipe => recipe.id !== id));
            })
            .catch(error => {
                console.error('Error deleting recipe:', error);
            });
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            axios.get(`https://serverless-encarnacion.netlify.app/.netlify/functions/api/search?query=${searchQuery}`)
                .then(response => {
                    setRecipes(response.data);
                })
                .catch(error => {
                    console.error('Error searching recipes:', error);
                });
        } else {
            fetchRecipes();
        }
    };

    const handleFavorite = (id) => {
        const recipe = recipes.find(recipe => recipe.id === id);
        if (favoriteRecipes.some(recipe => recipe.id === id)) {
            setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== id));
        } else {
            setFavoriteRecipes([...favoriteRecipes, recipe]);
        }
    };

    return (
        <div>
            <h1>Recipe Book</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
                <input type='text' value={cuisine} onChange={e => setCuisine(e.target.value)} placeholder='Cuisine' />
                <input type='text' value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder='Ingredients (comma-separated)' />
                <button type='submit'>{editRecipe ? 'Update Recipe' : 'Add Recipe'}</button>
            </form>
            {error && <p>{error}</p>}
            <div>
                <input type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder='Search by ingredients' />
                <button onClick={handleSearch}>Search</button>
            </div>
            <h2>Recipes</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <div>
                            <strong>{recipe.name}</strong> - {recipe.cuisine}
                        </div>
                        <div>Ingredients: {recipe.ingredients.join(', ')}</div>
                        <button onClick={() => handleEdit(recipe)}>Edit</button>
                        <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                        <button onClick={() => handleFavorite(recipe.id)}>
                            {favoriteRecipes.some(favorite => favorite.id === recipe.id) ? 'Unfavorite' : 'Favorite'}
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Favorite Recipes</h2>
            <ul>
                {favoriteRecipes.map(recipe => (
                    <li key={recipe.id}>
                        <div>
                            <strong>{recipe.name}</strong> - {recipe.cuisine}
                        </div>
                        <div>Ingredients: {recipe.ingredients.join(', ')}</div>
                        <button onClick={() => handleFavorite(recipe.id)}>Unfavorite</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecipeForm;
