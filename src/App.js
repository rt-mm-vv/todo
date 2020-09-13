import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { API, graphqlOperation } from "aws-amplify";
import {listTodos} from './graphql/queries'
import { createTodo } from './graphql/mutations';
import {onCreateTodo} from './graphql/subscriptions'

class App extends Component{
  state = {
    posts: [],
    title: "",
    content: ""
  }

  async componentDidMount() {
    try{
      const list = await API.graphql(graphqlOperation(listTodos))
      console.log(list)
      this.setState({ posts: list.data.listPosts.items })
    } catch(e) {
      console.log(e)
    }
  }


  createTodo = async () => {
    if(this.state.title === '' || this.state.content === '') return

    const createPostInput = {
      title: this.state.title,
      content: this.state.content
    }

    try{
      const posts = [...this.state.posts, createPostInput]
      this.setState({ posts: posts, title: "", content: "" })
      await API.graphql(graphqlOperation(createTodo, { input: createPostInput }))
      console.log('createPostInput: ', createPostInput)
    }catch (e) {
      console.log(e)
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div className="App">
        <div>
          タイトル
        <input value={this.state.title} name="title" onChange={this.onChange}></input>
        </div>
        <div>
          内容
        <input value={this.state.content} name="content" onChange={this.onChange}></input>
        </div>
        <button onClick={this.createTodo}>追加</button>
      </div>
    )
  }
}

export default App;
