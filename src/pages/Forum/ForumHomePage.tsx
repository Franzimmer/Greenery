import React from "react";
import styled from "styled-components";
import Tiptap from "./Tiptap";
const ForumSectionWrapper = styled.div`
  width: 60vw;
  padding: 10px;
  border: 1px solid #000;
  display: flex;
`;
const ForumSection = styled.div`
  display: flex;
  justify-content: center;
  align-itms: center;
`;
const ForumHomePage = () => {
  return (
    <>
      <h1>Forum Home Page!</h1>
      <ForumSectionWrapper>
        <ForumSection>討論區</ForumSection>
        <ForumSection>交易區</ForumSection>
      </ForumSectionWrapper>
      <Tiptap />
    </>
  );
};

export default ForumHomePage;
