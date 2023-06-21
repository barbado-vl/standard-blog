import React from "react";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from '../axios'

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

  const [comments, setComments] = React.useState();
  const [isCommentsLoading, setIsCommentsLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setIsLoading(false);
    }).catch(err => {
      console.warn(err);
      alert("Ошибка при получении статьи")
    });

    axios.get(`/comments/${id}`).then(res => {
      setComments(res.data);
      setIsCommentsLoading(false);
    }).catch(err => {
      console.warn(err);
      alert("Ошибка получения комментариев по статье!")
    });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>
  };

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={isCommentsLoading}>
        <Index />
      </CommentsBlock>
    </>
  );
};
