import React from "react";
import { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { Reset } from "styled-reset";
import { Provider } from "react-redux";
import store from "./store";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: 1px solid black;
  }
  body {
    width: 100%;
    height: 100%;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Provider store={store}>
        <Outlet />
      </Provider>
    </>
  );
}

export default App;
