import styled from "styled-components";

export const OperationBtn = styled.button`
  cursor: pointer;
  font-size: 16px;
  line-height: 10px;
  height: 30px;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid ${(props) => props.theme.colors.main};
  background: ${(props) => props.theme.colors.main};
  color: #fff;
`;

export const CloseBtn = styled.button`
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 16px;
  border-radius: 50%;
  font-weight: 500;
  color: #fff;
  background-color: ${(props) => props.theme.colors.main};
  border: 1px solid ${(props) => props.theme.colors.main};
`;

export const IconButton = styled.label`
  cursor: pointer;
  width: 26px;
  height: 26px;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
`;
