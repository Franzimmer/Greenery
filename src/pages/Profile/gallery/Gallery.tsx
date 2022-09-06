import React, { useRef, useState } from "react";
import styled from "styled-components";

const Gallery = () => {
  const [media, setMedia] = useState();

  return (
    <>
      <input type="file" accept="audio/*"></input>
    </>
  );
};

export default Gallery;
