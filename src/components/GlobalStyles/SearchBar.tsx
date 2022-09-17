import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchInput = styled.input`
  border: 1px solid #aaa;
  width: 200px;
  height: 40px;
  border-radius: 18px;
  background-color: #fff;
  padding-left: 15px;
  padding-right: 25px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #aaa;
  background-color: #fff;
  cursor: pointer;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 10px;
`;
const StyleWrapper = styled.div`
  position: relative;
`;

const SearchBar = () => {
  return (
    <StyleWrapper>
      <SearchInput />
      <StyledFontAwesomeIcon icon={faMagnifyingGlass} />
    </StyleWrapper>
  );
};

export default SearchBar;
