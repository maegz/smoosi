import React from 'react';
import EditPost from './EditPost';
import RemovePost from './RemovePost';
import RatePost from './RatePost';

export default function PostWall(props) {

  const {
    isAdmin, 
    currentUser,
    removePost, 
    editPost,
    posts, 
    vote,
    text } = props;
    
  const allPosts = posts.map(post =>
    <div key={ post.key }>
      <h3>{ post.text }</h3>
      { currentUser.uid === post.madeBy || isAdmin === true
        ? <div>
            <EditPost post={ post } editPost={ editPost } value={ text }/>
            <RemovePost post={ post } removePost={ removePost } />
          </div>
        : null 
      }
      <RatePost post={ post } currentUser={ currentUser } vote={ vote } />
    </div>
  )
  
  return(
    <div className="postWall">
      { allPosts }
    </div>
  )
}
