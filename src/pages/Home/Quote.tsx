import React from "react";
import styled from "styled-components";

const QuoteSection = styled.div`
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #224229;
  border-bottom: 1px solid #224229;
  margin: 0 0 60px 0;
  @media (max-width: 1200px) {
    padding: 36px 24px;
  }
`;
const QuoteText = styled.div`
  font-size: 26px;
  letter-spacing: 2px;
  color: #224229;
  padding: 8px;
  font-style: italic;
  @media (max-width: 700px) {
    font-size: 18px;
    letter-spacing: 1px;
  }
`;
const QuoteAutorText = styled(QuoteText)`
  font-size: 20px;
  align-self: flex-end;
  padding: 8px 72px 0 0;
  @media (max-width: 700px) {
    font-size: 14px;
  }
`;

const Quote = () => {
  return (
    <QuoteSection>
      <QuoteText>To plant a garden is to believe in tomorrow.</QuoteText>
      <QuoteAutorText>~ Audrey Hepburn</QuoteAutorText>
    </QuoteSection>
  );
};
export default Quote;
