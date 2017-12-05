import React, { Component } from 'react';
import firebase from '../firebase';

export default class RatePost extends Component {
  
  state = {
    isClickedUp: false,
    isClickedDown: false
  }
  
  componentWillMount() {
    firebase.database().ref(`users/${this.props.currentUser.uid}/votes/${this.props.post.key}`)
      .on("value", post => {
        if (post.val() ===    1) { this.setState({ isClickedUp: true,  isClickedDown: false }) }
        if (post.val() ===   -1) { this.setState({ isClickedUp: false, isClickedDown: true  }) }
        if (post.val() === null) { this.setState({ isClickedUp: false, isClickedDown: false }) }
      });
  }
  
  incrementVote = (post) => { this.props.vote(post, 1, this.props.currentUser) };
  decrementVote = (post) => { this.props.vote(post, -1, this.props.currentUser) };
  
  render() {
    const { currentUser, post } = this.props;
    const { isClickedUp, isClickedDown } = this.state;
    
    const buttonUpIsClicked = isClickedUp === true ? { background: "green" } : { background: "gray" };
    const buttonDownIsClicked = isClickedDown === true ? { background: "red" } : { background: "gray" };
    
    return(
      <div className="ratePost">
      { currentUser.uid === post.madeBy 
      ? <div>{ post.votes }</div> 
      : <div>
          <button style={ buttonUpIsClicked } className="button" onClick={ () => this.incrementVote(post) }>
            <span className="glyphicon glyphicon-thumbs-up"></span>
          </button>
          { post.votes }
          <button style={ buttonDownIsClicked } className="button" onClick={ () => this.decrementVote(post) }>
            <span className="glyphicon glyphicon-thumbs-down"></span>
          </button>
        </div>
      }
    </div>
    )
  } 
}