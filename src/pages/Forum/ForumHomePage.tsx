import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextEditor from "../../components/TextEditor/TextEditor";
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
interface ForumPostPageProps {
  show: boolean;
}
export const ForumPostPage = styled.div<ForumPostPageProps>`
  width: 80%;
  height: 100px;
  border: 1px solid #000;
  display: ${(props) => (props.show ? "block" : "none")};
`;
export const ForumPostPageInfo = styled(Link)``;

const ForumHomePage = () => {
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [postList, setPostList] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"discussion" | "trade" | "any">("any");

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
        <OperationBtn onClick={() => setFilter("any")}>All</OperationBtn>
        <OperationBtn onClick={() => setFilter("discussion")}>
          討論區
        </OperationBtn>
        <OperationBtn onClick={() => setFilter("trade")}>交易區</OperationBtn>
      </ForumSectionWrapper>
      {postList.length &&
        postList.map((post) => {
          return (
            <ForumPostPage
              key={post.postId}
              show={post.type === filter || filter === "any"}
            >
              <ForumPostPageInfo to={post.postId}>
                {parse(post.title)}
              </ForumPostPageInfo>
              <p>{post.type}</p>
            </ForumPostPage>
          );
        })}
      <OperationBtn onClick={addNewPost}>Add Post</OperationBtn>
      {textEditorDisplay && (
        <TextEditor
          initContent={initContent}
          initTitle={initTitle}
          editorMode={"post"}
          setTextEditorDisplay={setTextEditorDisplay}
          postList={postList}
          setPostList={setPostList}
        ></TextEditor>
      )}
    </>
  );
};

export default ForumHomePage;
