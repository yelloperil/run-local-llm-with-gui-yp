import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import PromptResponse from "./components/PromptResponse";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background-color: #010201;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <PromptResponse />
    </>
  );
};

export default App;
