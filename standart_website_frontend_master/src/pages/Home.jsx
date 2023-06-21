import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);
  const comments = useSelector(state => state.comments);

  const [tabValue, setTabValue] = React.useState('1');
  const [tagTarget, setTagTarget] = React.useState('');

  const isPostsLoading = posts.status === 'loading';
  const isTagssLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  const sortedPosts = [];

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  /* Фильтр и сортировка статей на вывод */
  const handleTabsChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const clickTag = (event) => {
    if (event.target.innerText === "Все") {
      setTagTarget('');  
    } else {
      setTagTarget(event.target.innerText);
    };
  }

  const sortAndFilteredPosts = () => {
    let sortedArray = [];

    if (tabValue === "1") {
      for(let i = posts.items.length - 1; i >= 0; i--) {
        sortedArray.push(posts.items[i]);
      }
    }

    if (tabValue === "2") {
      sortedArray = posts.items.reduce((acc, curr) => {
        const insertIndex = acc.findIndex(item => item.viewsCount < curr.viewsCount);
        if(insertIndex === -1) {
          acc.push(curr);
        } else {
          acc.splice(insertIndex, 0, curr);
        }
        return acc;
      }, []);
    }

    return tagTarget !== '' ? sortedArray.filter(item => item.tags.includes(tagTarget))
                            : sortedArray;
  }
  
  const renderPosts = () => {
    let tempArray;
    
    if (isPostsLoading) {
      tempArray = [...Array(5)];
      for (let i = 0; i < tempArray.length; i++) {
        sortedPosts.push(
          <Post key={i} isLoading={true} />);
      }
    } else {
      tempArray = sortAndFilteredPosts();

      for (let i = 0; i < tempArray.length; i++) {
        let obj = tempArray[i];
        sortedPosts.push(
          <Post
            id={obj._id}
            title={obj.title}
            imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
            user={obj.user}
            createdAt={obj.createdAt}
            viewsCount={obj.viewsCount}
            commentsCount={3}
            tags={obj.tags}
            isEditable={userData?._id === obj.user._id}
          />);
      }
    }
    return sortedPosts;
  };

  /* ------------Render-------------- */
  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabValue}
        aria-label="basic tabs example"
        onChange={handleTabsChange}>
        <Tab label="Новые" value="1"/>
        <Tab label="Популярные" value="2"/>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>          
          { renderPosts() }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} homeHandleListClick={clickTag} isLoading={isTagssLoading}/>
          <CommentsBlock items={comments.items} isLoading={isCommentsLoading}/>
        </Grid>
      </Grid>
    </>
  );
};
