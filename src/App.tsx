import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Outlet } from "react-router-dom";
import { Reset } from "styled-reset";

import {
  addANewUser,
  getUserData,
  addANewPlantCard,
  getUserActivities,
  addUserWateringActivity,
} from "./utils/firebase";
import { serverTimestamp } from "firebase/firestore";

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
  const fakeWateringEvent = {
    plantId: "86799",
    time: Date.now(),
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
      <TestBtn onClick={() => getUserActivities("FUkF1ospP88e49yFR5gI")}>
        Get user activity subcollection
      </TestBtn>
      <TestBtn
        onClick={() =>
          addUserWateringActivity("FUkF1ospP88e49yFR5gI", fakeWateringEvent)
        }
      >
        Add watering event
      </TestBtn>
    </>
  );
}

export default App;
