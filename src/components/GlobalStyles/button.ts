import styled from "styled-components";

export const OperationBtn = styled.button`
  font-size: 16px;
  line-height: 10px;
  height: 30px;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  &:hover {
    background: #fddba9;
    color: #6a5125;
  }
`;

export const CloseBtn = styled.div`
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 14px;
  border-radius: 50%;
  font-weight: 700;
  background: #5c836f;
  color: #fff;
  &:hover {
    background: #7bc09a;
  }
`;
