import React from 'react';

export default function EditPost(props) {

  const { post, editPost, value } = props;

  function edit(post) {
    const editedPost = Object.assign({}, post, { text: value});
    editPost(editedPost);
  }

  return(
    <div className="editPost">
      <button className="button" onClick={ () => edit(post) }>*EDIT POST*</button>
    </div>
  )
}