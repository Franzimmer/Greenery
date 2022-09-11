import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { UserInfo } from "../../types/userInfoType";
import { OperationBtn } from "../Profile/cards/CardsGrid";
import Tiptap from "../../components/TextEditor/Tiptap";

const PostWrapper = styled.div`
  display: flex;
  border: 1px solid #000;
  width: 80vw;
`;
const AuthorInfo = styled.div`
  width: 20%;
  border-right: 2px solid red;
  font-size: 10px;
`;
const AuthorPhoto = styled.img`
  border-radius: 50%;
  height: auto;
  width: 100px;
`;
const AuthorName = styled.p`
  width: 100%;
  text-align: center;
`;
const Content = styled.div`
  padding: 8px;

  & > * + * {
    margin-top: 0.75em;
  }

  & h1,
  h2,
  h3 {
    line-height: 1.1;
  }

  & ul,
  ol {
    padding: 0 1rem;
  }
`;
const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export interface Post {
  postId: string;
  authorId: string;
  createdTime: number;
  type: string;
  title: string;
  content: string;
  comments?: Comment[];
}
interface Comment {
  authorId: string;
  createdTime: number;
  content: string;
}
const ForumPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [authorInfo, setAuthorInfo] = useState<UserInfo>();
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<string>("");

  function addComment() {
    setEditorMode("Comment");
    setTextEditorDisplay(true);
    setInitContent("");
  }

  useEffect(() => {
    async function getPost() {
      if (id) {
        let postData = await firebase.getPostData(id);
        let userInfo = await firebase.getUserInfo(postData.data()!.authorId);
        setPost(postData.data());
        setInitTitle(postData.data()!.title);
        setInitContent(postData.data()!.content);
        setAuthorInfo(userInfo.data());
      }
    }
    getPost();
  }, []);
  return (
    <>
      {post?.title && parse(post.title)}
      <p>{post?.type}</p>
      <PostWrapper>
        <AuthorInfo>
          <AuthorPhoto src={authorInfo?.photoUrl} />
          <AuthorName>{authorInfo?.userName}</AuthorName>
        </AuthorInfo>
        <Content>{post?.content && parse(post.content)}</Content>
        <BtnWrapper>
          <OperationBtn onClick={() => setTextEditorDisplay(true)}>
            Edit
          </OperationBtn>
          <OperationBtn>Delete</OperationBtn>
        </BtnWrapper>
      </PostWrapper>
      <OperationBtn onClick={addComment}>Comment</OperationBtn>
      {textEditorDisplay && (
        <Tiptap
          editorMode={editorMode}
          initContent={initContent}
          initTitle={initTitle}
          post={post}
          setPost={setPost}
          setEditorMode={setEditorMode}
          setTextEditorDisplay={setTextEditorDisplay}
        />
      )}
    </>
  );
};

export default ForumPost;
