import React, { Component } from 'react';
import LoginOrRegister from './LoginOrRegister';
import AddPost from './AddPost';
import UserSettings from './UserSettings';
import PostWall from './PostWall';
import firebase from '../firebase';


export default class MainPage extends Component {

  state = {
    email: "",
    password: "",
    value: "",
    isUserAdmin: ""
  }

  componentDidMount() {
    this.getUserAdminValue();
  }

  componentWillReceiveProps() {
    this.getUserAdminValue();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value})

  signOut = () => {
    firebase.auth().signOut();
  }

  getUserAdminValue = () => {
    if (firebase.auth().currentUser) {
      firebase.database().ref(`users/${firebase.auth().currentUser.uid}/isAdmin`)
        .on("value", isAdmin => {
          this.setState({ isUserAdmin: isAdmin.val() });
      });
    }
  }

  render() {

    const currentUser = firebase.auth().currentUser;

    return (
      <div className="mainPage">
        { currentUser
          ?
            <div>
              <button className="button" onClick={ this.signOut }>Sign Out</button>
              <h1>Hej { currentUser.email }!</h1>
              <AddPost  { ...this.props } text={ this.state.value } onChange={ this.onChange } />
              <PostWall { ...this.props } isAdmin={ this.state.isUserAdmin } text={ this.state.value } currentUser={ currentUser } />

              { this.state.isUserAdmin === true
                ?
                  <div>
                    <UserSettings { ...this.props }/>
                  </div>
                :
                  ""
              }
            </div>
          :
            <LoginOrRegister onChange={ this.onChange } state={ this.state } currentUser={ currentUser } />
        }
      </div>
    )
  }
}