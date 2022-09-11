import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { UserInfo } from "../../types/userInfoType";

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
  & > * + * {
    margin-top: 0.75em;
  }
  & h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }
  & ul,
  ol {
    padding: 0 1rem;
  }
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

  useEffect(() => {
    async function getPost() {
      if (id) {
        let postData = await firebase.getPostData(id);
        let userInfo = await firebase.getUserInfo(postData.data()!.authorId);
        setPost(postData.data());
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
      </PostWrapper>
    </>
  );
};

export default ForumPost;
