import styled from "styled-components";

export const OperationBtn = styled.button`
  cursor: pointer;
  font-size: 16px;
  line-height: 10px;
  height: 30px;
  padding: 10px;
  border-radius: 15px;
  &:hover {
    background: #fddba9;
    color: #6a5125;
  }
`;

export const CloseBtn = styled.button`
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 16px;
  border-radius: 50%;
  font-weight: 700;
  color: #fff;
  background-color: #5c836f;
  border: 1px solid #5c836f;
  &:hover {
    background-color: #7bc09a;
    border: 1px solid #7bc09a;
  }
`;
