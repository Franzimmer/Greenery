import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tiptap from "../../components/TextEditor/Tiptap";
import { OperationBtn } from "../Profile/cards/CardsGrid";
import { Link } from "react-router-dom";
import { firebase } from "../../utils/firebase";
import { Post } from "./ForumPost";
import parse from "html-react-parser";
const ForumSectionWrapper = styled.div`
  width: 60vw;
  padding: 10px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-itms: center;
`;
const ForumSection = styled.div`
  margin-right: 10px;
`;
const ForumPostPage = styled.div`
  width: 80%;
  height: 100px;
  border: 1px solid #000;
`;
const ForumPostPageInfo = styled(Link)``;

const ForumHomePage = () => {
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [postList, setPostList] = useState<Post[]>([]);

  function addNewPost() {
    setInitTitle("");
    setInitContent("");
    setTextEditorDisplay(true);
  }

  useEffect(() => {
    async function getPosts() {
      let postList: Post[] = [];
      let posts = await firebase.getPosts();
      posts.forEach((post) => {
        postList.push(post.data());
      });
      setPostList(postList);
    }
    getPosts();
  }, []);
  return (
    <>
      <h1>Forum Home Page!</h1>
      <ForumSectionWrapper>
        <ForumSection>討論區</ForumSection>
        <ForumSection>交易區</ForumSection>
      </ForumSectionWrapper>
      {postList.length &&
        postList.map((post) => {
          return (
            <ForumPostPage key={post.postId}>
              <ForumPostPageInfo to={post.postId}>
                {parse(post.title)}
              </ForumPostPageInfo>
              <p>{post.type}</p>
            </ForumPostPage>
          );
        })}
      <OperationBtn onClick={addNewPost}>Add Post</OperationBtn>
      {textEditorDisplay && (
        <Tiptap
          editorMode={"post"}
          setTextEditorDisplay={setTextEditorDisplay}
        ></Tiptap>
      )}
    </>
  );
};

export default ForumHomePage;
