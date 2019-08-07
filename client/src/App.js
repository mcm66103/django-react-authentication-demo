import React from 'react';
import logo from './logo.svg';
import './App.css';

let FetchWithHeaders = async function(verb, url, data){
    const request = {
            method: verb,
            headers: { 'X-Auth-Token': data['jwt'] },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
        };

    if (data)    {
        request.body = JSON.stringify(data);
    }

    const responseObj = await fetch(url, request)
        .then(function(response){
            return response
        });

    return responseObj;
};

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        username: '',
        password: '',
        jwt: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    console.log(this.state);
    this.setState({[event.target.name]: event.target.value});
  }

    async login(){
            var rsp = await FetchWithHeaders('POST', 'http://localhost:8000/login/', this.state);
            console.log(rsp)
            rsp.json().then((parsedJson) => {
                console.log('This is the parsed json', parsedJson);
                console.log(parsedJson['jwt']);
                this.setState({jwt: parsedJson['jwt']});
                localStorage.setItem("jwt", parsedJson['jwt']);
              });


    }

    render(){
        return (
            <div className="App">
              <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
              <button type="submit" onClick={()=>this.login()} value="submit">submit</button>
            </div>
        )
      }
}

export default App;
