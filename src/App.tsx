import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { Reset } from "styled-reset";

import { addANewUser, getUserData, addANewPlantCard } from "./utils/firebase";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const TestBtn = styled.button``;

function App() {
  const fakeUserData = {
    userId: "1jdj9sm2k230osisa",
    userName: "userttt",
    email: "test@email.com",
    photoUrl: "image2.jpeg",
    gallery: [],
    followList: [],
    favoritePlants: [],
    favoritePosts: [],
  };
  const fakePlantCardData = {
    cardId: "2223343",
    ownerId: "237897283",
    plantName: "Plannnn",
    species: "flowwowwow",
  };
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Outlet />
      <TestBtn onClick={() => addANewUser(fakeUserData)}>
        Add A New User
      </TestBtn>
      <TestBtn onClick={() => getUserData("1jdj9sm2k230osisa")}>
        Get User's Data
      </TestBtn>
      <TestBtn onClick={() => addANewPlantCard(fakePlantCardData)}>
        Add A New Card
      </TestBtn>
    </>
  );
}

export default App;
