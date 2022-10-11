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
  margin: 110vh 0 60px 0;
`;
const QuoteText = styled.div`
  font-size: 26px;
  letter-spacing: 2px;
  color: #224229;
  padding: 8px;
  font-style: italic;
`;
const QuoteAutorText = styled(QuoteText)`
  font-size: 20px;
  align-self: flex-end;
  padding: 8px 72px 0 0;
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
