import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recipe from './Recipe';

const RecipeList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://serverless-encarnacion.netlify.app/.netlify/functions/api/', {
                    params: { search: searchQuery }
                });
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <input type="text" value={searchQuery} onChange={handleSearch} />
            {loading && <p>Loading...</p>}
            {recipes.map(recipe => (
                <Recipe key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
};

export default RecipeList;
