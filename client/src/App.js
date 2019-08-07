import React from 'react';
import logo from './logo.svg';
import './App.css';

let FetchWithHeaders = async function(verb, url, data){
    const request = {
            method: verb,
            headers: {
                'Authorization': `Bearer ${data['jwt']}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
        };

    if (data)    {
        request.body = JSON.stringify(data);
    }

    const responseObj = await fetch(url, request)
        .then(function(response){
            return response
        })
        .catch(function(e){
            console.log(e);
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

    login(){
     FetchWithHeaders('POST', 'http://localhost:8000/login/', this.state)
               .then(rsp=> rsp.json())
               .then((rsp)=> {
                    var data = rsp;
                    console.log('This is the parsed json', data);
                    console.log(data['jwt']);
                    this.setState({jwt: data['jwt']});
                });
    }

    loginStatus(){
        FetchWithHeaders('POST', 'http://localhost:8000/login-test/', this.state)
        .then((rsp) => rsp.json())
        .then((rsp) => console.log(rsp))
     }

    render(){
        return (
            <div className="App">
              <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
              <button type="submit" onClick={()=>this.login()} value="submit">submit</button>
              <button type="submit" onClick={()=>this.loginStatus()} value="submit">submit</button>

            </div>

        )
      }
}

export default App;
