import styled from "styled-components";

export const CheckBox = styled.span`
  height: 25px;
  width: 25px;
  background-color: #eee;
  border: 1px solid #6a5125;
  &.:after {
    content: "";
    position: absolute;
    display: none;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
  &:hover {
    background-color: #ccc;
  }
  &:checked {
    background-color: #6a5125;
    &:after {
      display: block;
    }
  }
`;
