import styled from "styled-components";

export const NoDataSection = styled.div`
  width: 80vw;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px dashed #aaa;
  color: #aaa;
`;
export const NoDataText = styled.p`
  letter-spacing: 1px;
  text-align: center;
  @media (max-width: 500px) {
    font-size: 14px;
    letter-spacing: 0px;
  }
`;
export const NoDataBtn = styled.label`
  margin-top: 12px;
  padding: 8px;
  border-radius: 8px;
  background: #aaa;
  border: 1px solid #aaa;
  color: #fff;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.25s;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    letter-spacing: 0px;
  }
`;
