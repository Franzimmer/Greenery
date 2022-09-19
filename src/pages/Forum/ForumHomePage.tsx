import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextEditor from "../../components/TextEditor/TextEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { OperationBtn } from "../Profile/cards/Cards";
import { Link } from "react-router-dom";
import { firebase } from "../../utils/firebase";
import { Post } from "./ForumPost";
import parse from "html-react-parser";
import discuss from "./discuss.jpeg";
import all from "./all.jpeg";
import trade from "./trade.jpeg";
const ForumSectionWrapper = styled.div`
  width: 78vw;
  display: flex;
  justify-content: center;
  align-itms: center;
  margin: 150px auto 50px;
`;
interface ForumPostPageProps {
  show: boolean;
}
export const ForumPostPage = styled.div<ForumPostPageProps>`
  width: 78vw;
  height: 100px;
  border: 1px solid #5c836f;
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0px auto;
`;
export const ForumPostPageInfo = styled(Link)`
  text-decoration: none;
  color: #5c836f;
  transition: 0.25s;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  ${ForumPostPage}:hover & {
    transform: translateX(10px);
    transition: 0.25s;
  }
`;
const TypeText = styled.p`
  color: #5c836f;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  width: 120px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border: 1px solid #5c836f;
  border-radius: 10px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: block;
  color: #5c836f;
  width: 26px;
  height: 26px;
  background: none;
  margin-left: 12px;
`;
const PostTypeBtn = styled.div`
  width: 26vw;
  height: 125px;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`;
const PostMask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: 0.1s;
  ${PostTypeBtn}:hover & {
    background-color: rgba(0, 0, 0, 0.6);
    transition: 0.1s;
  }
`;
const PostTypeText = styled.p`
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
`;
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
      <ForumSectionWrapper>
        <PostTypeBtn
          style={{ backgroundImage: `url(${all})` }}
          onClick={() => setFilter("any")}
        >
          <PostMask />
          <PostTypeText>All</PostTypeText>
        </PostTypeBtn>
        <PostTypeBtn
          style={{ backgroundImage: `url(${discuss})` }}
          onClick={() => setFilter("discussion")}
        >
          <PostMask />
          <PostTypeText>Discuss</PostTypeText>
        </PostTypeBtn>
        <PostTypeBtn
          style={{ backgroundImage: `url(${trade})` }}
          onClick={() => setFilter("trade")}
        >
          <PostMask />
          <PostTypeText>Trade</PostTypeText>
        </PostTypeBtn>
      </ForumSectionWrapper>
      {postList.length &&
        postList.map((post) => {
          return (
            <ForumPostPage
              key={post.postId}
              show={post.type === filter || filter === "any"}
            >
              <FlexWrapper>
                <ForumPostPageInfo to={post.postId}>
                  {parse(post.title)}
                </ForumPostPageInfo>
                <StyledFontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </FlexWrapper>
              <TypeText>{post.type}</TypeText>
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
