import React from 'react';
import RecipeBook from './components/RecipeBook';
import RecipeList from './components/RecipeList';

const App = () => {
    return (
        <div>
            <h1>My Recipe Book</h1>
            <RecipeForm />
            <h2>Recipes</h2>
            <RecipeList />
        </div>
    );
};

export default App;
