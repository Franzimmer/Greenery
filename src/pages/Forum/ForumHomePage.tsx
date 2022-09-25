import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducer/index";
import { popUpActions } from "../../reducer/popUpReducer";
import { OperationBtn } from "../../components/GlobalStyles/button";
import { Post } from "./ForumPost";
import { firebase } from "../../utils/firebase";
import {
  NoDataSection,
  NoDataText,
  NoDataBtn,
} from "../../components/GlobalStyles/NoDataLayout";
import TextEditor from "../../components/TextEditor/TextEditor";
import PageLoader from "../../components/GlobalStyles/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import discuss from "./discuss.jpeg";
import all from "./all.jpeg";
import trade from "./trade.jpeg";
const Wrapper = styled.div`
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
  show: boolean;
}
export const ForumPostPage = styled.div<ForumPostPageProps>`
  width: 80vw;
  height: 100px;
  border: 1px solid #6a5125;
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  margin: 0px auto;
`;
export const ForumPostPageInfo = styled.div`
  font-size: 26px;
  text-decoration: none;
  color: #6a5125;
  transition: 0.25s;
  ${ForumPostPage}:hover & {
    text-decoration: underline;
    transition: 0.25s;
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
  color: #6a5125;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  width: 120px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border: 1px solid #6a5125;
  border-radius: 10px;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: none;
  color: #6a5125;
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
`;
const AddPostBtn = styled(OperationBtn)`
  width: 100px;
  display: block;
  margin: 10px 0 20px auto;
  background: #6a5125;
  border: 1px solid #6a5125;
  transition: 0.25s;
  &:hover {
    transform: scale(1.2);
    transition: 0.25s;
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
      type: popUpActions.SHOW_MASK,
    });
  }
  useEffect(() => {
    async function getPosts() {
      let postList: Post[] = [];
      let posts = await firebase.getPosts();
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
      <Wrapper>
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
                show={post.type === filter || filter === "any"}
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
