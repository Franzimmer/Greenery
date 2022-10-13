import React, { useEffect, useState } from "react";
import styled from "styled-components";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/reducer/index";
import { PopUpActions } from "../../store/actions/popUpActions";
import { firebase } from "../../utils/firebase";
import TextEditor from "../../components/TextEditor/TextEditor";
import PageLoader from "../../components/GlobalStyles/PageLoader";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { Post } from "./ForumPost/ForumPost";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../components/GlobalStyles/noDataLayout";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import discuss from "./discuss.jpeg";
import all from "./all.jpeg";
import trade from "./trade.jpeg";
interface WrapperProps {
  $isLoading: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.$isLoading ? "none" : "block")};
  margin: 150px auto 50px;
  width: 80vw;
`;
const ForumSectionWrapper = styled.div`
  width: 80vw;
  display: flex;
  justify-content: center;
  align-itms: center;
  margin: 0px auto 50px;
`;
interface ForumPostPageProps {
  $show: boolean;
}
export const ForumPostPage = styled.div<ForumPostPageProps>`
  width: 80vw;
  border: 1px solid ${(props) => props.theme.colors.button};
  display: ${(props) => (props.$show ? "flex" : "none")};
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0px auto;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: ceenter;
    padding: 16px 8px;
  }
`;
export const ForumPostPageInfo = styled.div`
  padding: 12px;
  font-size: 20px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.button};
  transition: 0.25s;
  ${ForumPostPage}:hover & {
    text-decoration: underline;
    transition: 0.25s;
  }
  @media (max-width: 900px) {
    font-size: 16px;
  }
  @media (max-width: 800px) {
    padding: 8px 0;
  }
  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 18px;
  }
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  transition: 0.25s;
  ${ForumPostPage}:hover & {
    transform: translateX(10px);
    transition: 0.25s;
  }
`;
export const TypeText = styled.p`
  color: ${(props) => props.theme.colors.button};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  width: 120px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border: 1px solid ${(props) => props.theme.colors.button};
  border-radius: 10px;
  @media (max-width: 600px) {
    font-size: 10px;
    width: 80px;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: none;
  color: ${(props) => props.theme.colors.button};
  width: 26px;
  height: 26px;
  background: none;
  margin-left: 12px;
  ${ForumPostPage}:hover & {
    display: block;
    transition: 0.25s;
  }
`;
const PostTypeBtn = styled.div`
  width: calc(80vw / 3);
  height: 125px;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  @media (max-width: 530px) {
    height: 75px;
  }
`;
const PostMask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: 0.5s;
  ${PostTypeBtn}:hover & {
    background-color: rgba(0, 0, 0, 0.3);
    transition: 0.5s;
  }
`;
const PostTypeText = styled.p`
  font-size: 36px;
  font-weight: 200;
  letter-spacing: 12px;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
  @media (max-width: 930px) {
    font-size: 30px;
    letter-spacing: 8px;
  }
  @media (max-width: 700px) {
    font-size: 26px;
    letter-spacing: 6px;
  }
  @media (max-width: 530px) {
    font-size: 20px;
    letter-spacing: 4px;
  }
  @media (max-width: 400px) {
    font-size: 16px;
    letter-spacing: 2px;
  }
`;
const AddPostBtn = styled(OperationBtn)`
  width: 100px;
  display: block;
  margin: 10px 0 20px auto;
  background: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  transition: 0.25s;
  &:hover {
    transform: scale(1.2);
    transition: 0.25s;
  }
  @media (max-width: 500px) {
    width: 80px;
    font-size: 14px;
    padding: 4px;
  }
`;

const ForumHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: RootState) => state.authority);
  const [initContent, setInitContent] = useState<string>("");
  const [initTitle, setInitTitle] = useState<string>("");
  const [textEditorDisplay, setTextEditorDisplay] = useState<boolean>(false);
  const [postList, setPostList] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"discussion" | "trade" | "any">("any");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  function addNewPost() {
    setInitTitle("");
    setInitContent("");
    setTextEditorDisplay(true);
    dispatch({
      type: PopUpActions.SHOW_MASK,
    });
  }
  useEffect(() => {
    async function getPosts() {
      const postList: Post[] = [];
      const posts = await firebase.getPosts();
      posts.forEach((post) => {
        postList.push(post.data());
      });
      setPostList(postList);
      setTimeout(() => setIsLoading(false), 1000);
    }
    getPosts();
  }, []);
  return (
    <>
      {isLoading && <PageLoader />}
      <Wrapper $isLoading={isLoading}>
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
        {isLoggedIn && postList.length !== 0 && (
          <AddPostBtn onClick={addNewPost}>Add Post</AddPostBtn>
        )}
        {postList.length !== 0 &&
          postList.map((post) => {
            return (
              <ForumPostPage
                key={post.postId}
                $show={post.type === filter || filter === "any"}
                onClick={() => navigate(`/forum/${post.postId}`)}
              >
                <FlexWrapper>
                  <ForumPostPageInfo>{parse(post.title)}</ForumPostPageInfo>
                  <StyledFontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </FlexWrapper>
                <TypeText>{post.type}</TypeText>
              </ForumPostPage>
            );
          })}
        {postList.length === 0 && (
          <NoDataSection>
            {isLoggedIn && (
              <>
                <NoDataText>
                  There's no posts in forum now. Share your ideas with everyone
                  !
                </NoDataText>
                <NoDataBtn onClick={addNewPost}>Add Post</NoDataBtn>
              </>
            )}
            {!isLoggedIn && (
              <>
                <NoDataText>
                  There's no post in forum now. Log In and share your ideas with
                  everyone !
                </NoDataText>
                <NoDataBtn onClick={() => navigate("/login")}>
                  Head to Log In
                </NoDataBtn>
              </>
            )}
          </NoDataSection>
        )}
        {textEditorDisplay && (
          <TextEditor
            initContent={initContent}
            initTitle={initTitle}
            editorMode={"AddPost"}
            setTextEditorDisplay={setTextEditorDisplay}
            postList={postList}
            setPostList={setPostList}
          ></TextEditor>
        )}
      </Wrapper>
    </>
  );
};

export default ForumHomePage;
