import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

// React.memo to avoid unnecessary re-renders by render the component only when the props changed and not when the parent component changed
const IngredientForm = React.memo((props) => {
  // All react hooks should use on the root level of the component, not inside a function or a if-statement
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  console.log("testtest");

  const submitHandler = (event) => {
    event.preventDefault();
    props.onIngredientForm({ title: title, amount: amount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
