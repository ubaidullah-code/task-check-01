import React, { useState } from "react";

const Todocheck = () => {
  const [firstInput, setFirstInput] = useState("");
  const [firstTodo, setFirstTodo] = useState([]);
  const [secondInput, setSecondInput] = useState("");
  const [secondTodo, setSecondTodo] = useState([]);

  const firstCheck = (e) => {
    e.preventDefault();
    if (firstInput.trim() !== "") {
      setFirstTodo([...firstTodo, firstInput]);
      setFirstInput("");
    }
  };

  const secondCheck = (e) => {
    e.preventDefault();
    if (secondInput.trim() !== "") {
      setSecondTodo([...secondTodo, secondInput]);
      setSecondInput("");
    }
  };

  const transferCheck = () => {
    setSecondTodo([...secondTodo, ...firstTodo]);
    setFirstTodo([]);
  };

  const secondTransferCheck = () => {
    setFirstTodo([...firstTodo, ...secondTodo]);
    setSecondTodo([]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        gap: "20px",
      }}
    >
      <form
        onSubmit={firstCheck}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "2px solid black",
          padding: "20px",
        }}
      >
        <input
          type="text"
          value={firstInput}
          onChange={(e) => setFirstInput(e.target.value)}
        />
        <button type="submit">Submit</button>
        <ul>
          {firstTodo.map((ele, index) => (
            <li key={index}>{ele}</li>
          ))}
        </ul>
        {firstTodo.length > 0 && (
          <button type="button" onClick={transferCheck}>
            Transfer to Second List
          </button>
        )}
      </form>

      <form
        onSubmit={secondCheck}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "2px solid black",
          padding: "20px",
        }}
      >
        <input
          type="text"
          value={secondInput}
          onChange={(e) => setSecondInput(e.target.value)}
        />
        <button type="submit">Submit</button>
        <ul>
          {secondTodo.map((ele, index) => (
            <li key={index}>{ele}</li>
          ))}
        </ul>
        {secondTodo.length > 0 && (
          <button type="button" onClick={secondTransferCheck}>
            Transfer to First List
          </button>
        )}
      </form>
    </div>
  );
};

export default Todocheck;
