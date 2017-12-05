import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }from 'redux';
import * as actions from '../actions/actions';
import MainPage from './MainPage';
import '../styles/App.css';

class App extends Component {
  
  state ={ loading: true };

  componentDidMount() {
    setTimeout(() => { this.setState({ loading: false }) }, 1000);
    this.props.addPostListener();
    this.props.changePostListener();
    this.props.removePostListener();
    this.props.userChanged();
  }
  
  render() {
    return (
      <div className="App">
        { this.state.loading ? <div>Loading....</div> : <MainPage { ...this.props } /> }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)    
}

function mapStateToProps(state){
  return {
    posts: state.posts,
    user: state.user,
    error: state.error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);