import React from 'react';


export default function RemovePost(props) {

  const { post, removePost } = props;

  function remove(post) { removePost(post); }

  return(
    <div className="removePost">
      <button className="button" onClick={ () => remove(post) }>*DELETE POST*</button>
    </div>
  )
}