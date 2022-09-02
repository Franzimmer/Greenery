import React from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { Reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Outlet />
    </>
  );
}

export default App;
