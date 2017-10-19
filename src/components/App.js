import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators }from 'redux';
import * as actions from '../actions/actions';
import firebase from '../firebase';
import '../styles/App.css';

/* Good news, the logic in the component is basically the same!
* It is the actions that need updating! We are creating our own API in our actions :)
* The only thing added here is the listeners in 'componentDidMount()'
*/

class App extends Component {
  state ={
    value: "",
    email: "",
    password: "",
    user: "",
    msg: "",
    loading: true
  }
  
  componentDidMount(){
    setTimeout(() => {this.setState({ loading: false })}, 1000)
    //One listener for every item added
    this.props.addTodoListener();
    //One listener for every change in every item, listens to ANY change
    this.props.changeTodoListener();
    //Listens to which item is being removed
    this.props.removeTodoListener();
    // Listens to userlogging
    this.props.userChanged();
  }
  
  add = () => {
    //No need for the random ID, just send these values
    if (this.state.value.length < 10) {
      return this.setState({ msg: "You have to fill in your smoosi information!" })
    }
    this.props.addTodo({
      madeBy: firebase.auth().currentUser.uid,
      text: this.state.value,
      completed: false,
      votes: 0
    })
    this.setState({ value: "", msg: "" });
  }
  
  remove = (todo) => {
    this.props.removeTodo(todo);
    this.setState({ value: "", msg: "" });
  }
  
  edit = (todo) => {
    if (this.state.value.length < 10) {
      return this.setState({ msg: "You have to fill in your smoosi information!" })
    }
    const editedTodo = Object.assign({}, todo, { text: this.state.value});
    this.props.editTodo(editedTodo);
    this.setState({ value: "", msg: "" });
  }
  
  toggleCompleted = (todo) => {
    this.props.toggleCompleted(todo);
    this.setState({ value: "", msg: "" });
  }
  
  incrementVote = (todo) => {
    const userVote = firebase.auth().currentUser;
    this.props.vote(todo, 1, userVote);
    this.setState({ value: "", msg: "" });
  }
  
  decrementVote = (todo) => {
    const userVote = firebase.auth().currentUser;    
    this.props.vote(todo, -1, userVote)
    this.setState({ value: "", msg: "" });
  }
  
  onChange = e => this.setState({ [e.target.name]: e.target.value})
  
  register = e => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password
    )
    .then(user => {
      const newUser = {
        email: user.email,
        isAdmin: false,
        uid: user.uid,
        votes: {}
      }
      this.setState({ msg: "" });
      firebase.database().ref(`users/${user.uid}`).set(newUser);
    })
    .catch(error => { this.setState({ msg: error.message }) })
  }
  
  signIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(this.setState({ msg: "" }))
    .catch(error => { this.setState({ msg: error.message }) });
  }
  
  signOut = () => {
    firebase.auth().signOut();
  }
  
  render() {
    //Both state and our functions are stored in props, redux state is synced to props
    const todoList = this.props.todos.map(todo => 
      <div key={todo.key}>
        <p>{ todo.text }</p>
        {/* <p>{ todo.completed ? "Completed" : "Not Completed" } </p> */}
        
        { this.props.user && (todo.madeBy === this.props.user.key) ?
        <div>
          <button className="button" onClick={ () => this.remove(todo) }>Remove Todo</button>
          <button className="button" onClick={ () => this.edit(todo) }>Edit Todo</button>
        </div>
        : null
      }
        {/* 
        <button className="button" onClick={() => this.toggleCompleted(todo)}> Toggle completed </button> */}
        <br/>
        <div style={{ width: "50%", marginLeft: "25%"}} >
        <button className="button" style={{ float: "left", width: "30%"}} onClick={() => this.incrementVote(todo)}>+</button>
        <p style={{ float: "left", width: "20%"}} >{ todo.votes }</p>
        <button className="button" style={{ float: "left", width: "30%"}} onClick={() => this.decrementVote(todo)}>-</button>
        </div>

        <br/><br/><br/><br/><br/><br/>
      
      </div>
    )
    
    const userGreeting = this.props.user ? (
      <div>
        <button className="button" onClick={ this.signOut }>Sign out</button>
        <div>Welcome { this.props.user.key }!</div>
        
        <br/><br/>
        <input type="text" onChange={ this.onChange } name="value" value={ this.state.value } />
        <button className="button" onClick={ this.add }> Add Todo </button>
        <br/><br/>
        { this.state.msg }
        
        { todoList }
      </div>
    ) : (
      <div>
        <div>Smoosi</div>
        <form onSubmit={ this.register }>
          <input type="text" name="email" onChange={ this.onChange } value={ this.state.email } />
          <input type="password" name="password" onChange={ this.onChange } value={ this.state.password } />
          <br/>
          <input className="button" type="submit" value="Register" onChange={ this.onChange } />
        </form>
          <button className="button" type="button" onClick={ this.signIn }>Sign in</button>
      </div>
    )
    
    return (
      <div className="App">
        { 
          this.state.loading 
        ? 
          <div>Loading...</div> 
        : 
          <div>
            { this.props.error }
            { userGreeting }
          </div>
        }

      </div>
    );
  }
}



function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)    
}


function mapStateToProps(state){
  return {
    todos: state.todos,
    user: state.user,
    error: state.error
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);