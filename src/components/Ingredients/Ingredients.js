import React, { useState, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => console.log("Rendered useEffect"));

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://startreacthooks-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // JSON.stringify to convert the JS object into a JSON object to store in the database
        body: JSON.stringify(ingredient),
      }
    )
      // .json() use to extract the body of the API request and convert it from a JSON into a normal JS object
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        return setIngredients(() => [
          ...ingredients,
          // responseData.name is the id or element record in firebase not called id
          { id: responseData.name, ...ingredient },
        ]);
      })
      .catch((error) => {
        setErrorMessage("something went wrong!");
      });
  };

  // when we render the component and functions will create again, but when we wrap a function with a useCallback it cache it a function and prevent it from re-create again when the component re-render
  const filteredIngredientHandler = useCallback(
    (filteredIngredientList) => setIngredients(filteredIngredientList),
    []
  );

  const deleteIngredient = useCallback(
    (id) => {
      setIsLoading(true);
      fetch(
        `https://startreacthooks-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          setIsLoading(false);
          const updatedIngredientList = ingredients.filter(
            (ingredient) => ingredient.id !== id
          );
          setIngredients(updatedIngredientList);
        })
        .catch((error) => {
          setErrorMessage("something went wrong!");
        });
    },
    [ingredients]
  );

  const clearError = useCallback(() => {
    setErrorMessage(null);
    setIsLoading(false);
  }, []);

  // useMemo when don't want to recalculate a bunch of code whenever the component renders but really only recalculate when you'd need to recalculate it (array of dependencies)
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={(id) => deleteIngredient(id)}
      />
    );
  }, [ingredients, deleteIngredient]);

  return (
    <div className="App">
      {errorMessage && (
        <ErrorModal onClose={clearError}>{errorMessage}</ErrorModal>
      )}
      <IngredientForm onIngredientForm={addIngredientHandler} />
      <section>
        <Search onLoadedIngredients={filteredIngredientHandler} />
        {isLoading ? <LoadingIndicator /> : ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
