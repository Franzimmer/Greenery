import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@tiptap/core";
import "./tiptap.css";
import MenuBar from "./MenuBar";
import { OperationBtn } from "../../pages/Profile/cards/CardsGrid";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import { firebase } from "../../utils/firebase";
import { Post } from "../../pages/Forum/ForumPost";
import { UserInfo } from "../../types/userInfoType";
import { Comment } from "../../pages/Forum/ForumPost";
interface TiptapProps {
  editorMode: string;
  initContent?: string;
  initTitle?: string;
  post?: Post;
  comments?: Comment[];
  editTargetComment?: Comment;
  setEditorMode?: React.Dispatch<React.SetStateAction<string>>;
  setPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setComments?: React.Dispatch<React.SetStateAction<Comment[] | undefined>>;
  setTextEditorDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}
const Tiptap = ({
  editorMode,
  initContent,
  initTitle,
  post,
  comments,
  editTargetComment,
  setEditorMode,
  setPost,
  setComments,
  setTextEditorDisplay,
}: TiptapProps) => {
  const userInfo: UserInfo = useSelector((state: RootState) => state.userInfo);
  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: initTitle || "<h1>Title</h1>",
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content: initContent || "<h1>Hello World!</h1>",
  });

  function getPostHTML() {
    if (!titleEditor || !editor) return;
    const title = titleEditor!.getHTML();
    const content = editor!.getHTML();
    const postHtml = { title, content };
    return postHtml;
  }
  async function savePost() {
    const html = getPostHTML()!;
    const authorId = userInfo.userId;
    const data = {
      ...html,
      authorId,
    };
    await firebase.addPost(data);
    //update state
    alert("文章發表成功！");
  }
  async function editPost() {
    const html = getPostHTML()!;
    const data = {
      ...post,
      ...html,
    } as Post;
    await firebase.saveEditPost(post!.postId, data);
    if (setPost) setPost(data);
    alert("編輯成功！");
  }
  async function addComment() {
    if (!comments || !setComments) return;
    const { content } = getPostHTML()!;
    const authorId = userInfo.userId;
    const comment = {
      content,
      authorId,
      createdTime: Date.now(),
    } as Comment;
    await firebase.saveComment(post!.postId, comment);
    let newComments = [...comments];
    newComments.push(comment);
    setComments(newComments);
    console.log(newComments);
  }
  async function saveEditComment() {
    if (!comments || !setComments) return;
    let postId = post!.postId;
    let newComment = {
      authorId: editTargetComment!.authorId,
      content: getPostHTML()?.content || "",
      createdTime: Date.now(),
    };
    let targetId = comments!.findIndex(
      (comment) =>
        comment.authorId === editTargetComment?.authorId &&
        comment.createdTime === editTargetComment.createdTime
    );
    let newComments = [...comments];
    newComments[targetId] = newComment;
    console.log(newComments);
    await firebase.saveEditComment(postId, newComments);
    alert("編輯留言成功！");
    setComments(newComments);
    setTextEditorDisplay(false);
  }
  return (
    <>
      <label htmlFor="title">輸入文章標題</label>
      {editorMode !== "Comment" && (
        <EditorContent editor={titleEditor} id="title" />
      )}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <OperationBtn
        onClick={() => {
          savePost();
          setTextEditorDisplay(false);
        }}
      >
        Save
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          editPost();
          setTextEditorDisplay(false);
        }}
      >
        Save Edit
      </OperationBtn>
      <OperationBtn
        onClick={async () => {
          await addComment();
          setTextEditorDisplay(false);
        }}
      >
        Add Comment
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          saveEditComment();
        }}
      >
        Save Edit Comment
      </OperationBtn>
      <OperationBtn
        onClick={() => {
          setTextEditorDisplay(false);
        }}
      >
        Cancel
      </OperationBtn>
    </>
  );
};

export default Tiptap;
