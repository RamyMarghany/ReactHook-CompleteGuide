import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(({ onLoadedIngredients }) => {
  const [filteredIngredient, setFilteredIngredient] = useState("");

  // useRef to select an element in the component
  const inputRef = useRef();

  // useEffect has this name because it manages all side-effects, like HTTP requests
  // Important Note: useEffect get executes right AFTER every component render cycle.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredIngredient === inputRef.current.value) {
        // queryParam is for firebase configuration
        const queryParam =
          filteredIngredient.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${filteredIngredient}"`;
        fetch(
          "https://startreacthooks-default-rtdb.firebaseio.com/ingredients.json" +
            queryParam
        )
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadedIngredients(loadedIngredients);
          });
      }
    }, 500);
    // Cleanup function is executing right before the next render to clean everything of the previous render, it using for memory efficient, and if we have an empty dependencies array [], the cleanup function will run the component unmounted
    return () => {
      clearTimeout(timer);
    };

    // useEffect take the second paramter as a dependencies of array, and if we pass it as an empty array[] it means the useEffect will get execute ONLY ONCE after the FIRST component render cycle, but if we path an array will element then the useEffect will get execute ONLY when these element CHANGE
  }, [filteredIngredient, onLoadedIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filteredIngredient}
            onChange={(event) => setFilteredIngredient(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
