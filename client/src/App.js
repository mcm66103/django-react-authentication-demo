import React from 'react';

import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'


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
            console.log(response.ok)
            return response;
        })
        .catch(function(e){
            console.log(e);
        });

    return responseObj;
};


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
          <input type="text" name="username" value={this.props.formValues.username} onChange={this.props.handleChange}/>
              <input type="password" name="password" value={this.props.formValues.password} onChange={this.props.handleChange} />
              {console.log(this.props)}
              <button type="submit" onClick={()=>this.props.loginFunction()} value="submit">submit</button>
      </div>
    )
  }
}

const Public = () => <h3>Public</h3>

const Protected = () => <h3>Protected</h3>

const PrivateRoute = ({ component: Component, ...parentProps }) => {
return (
  <Route {...parentProps} render={(props) => {
    console.log("am i working",  props)
    if ( parentProps.logged_in === true) {
        return <Component {...props} />;
    } else {
        return <Redirect to='/login' />
    };
  }} />
)}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        username: 'mav',
        password: 'test',
        jwt: '',
        logged_in: false,
    };

    this.handleChange = this.handleChange.bind(this);

  }

  authenticate(){
    this.setState({logged_in: true})
  }

  unauthenticate(){
    this.setState({logged_in: false})
  }

  handleChange(event){
    console.log(this.state  );
    this.setState({[event.target.name]: event.target.value});
  }

    login(){
    console.log(this.state)
     FetchWithHeaders('POST', 'http://localhost:8000/login/', this.state)
        .then((rsp) => {
            if (rsp) {
                rsp.json().then((rsp)=> {
                var data = rsp;
                console.log('This is the parsed json', data);
                console.log(data['jwt']);
                this.setState({jwt: data['jwt']});
                this.authenticate()
                })
            };
        })
    }

    logout(){
        this.setState({
            jwt: '',
            logged_in: false,
        })
    }

    loginStatus(){
        FetchWithHeaders('POST', 'http://localhost:8000/login-test/', this.state)
        .then(function(rsp) {
        console.log(rsp);
            if (rsp.ok) {
                rsp.json();
            } else if (rsp.status === 403){
                window.location.replace('/login')
            };
        })
//        .catch(function(e){
//            console.log(e);
//        });
     }

    render(){
        return (

            <div className="App">
              <button type="submit" onClick={()=>this.loginStatus()} value="submit">submit</button>
                <hr />
                <Router>
                  <div>
                    <ul>
                      <li><Link to="/public">Public Page</Link></li>
                      <li><Link to="/protected">Protected Page</Link></li>
                    </ul>
                    <Route path="/public" component={Public}/>
                    <Route path="/login" component={() => <Login  formValues={this.state} loginFunction={() => this.login()} handleChange={ this.handleChange }/>}/>
                    <PrivateRoute path='/protected' component={Protected} logged_in={this.state.logged_in}/>
                  </div>
                </Router>
            </div>

        )
      }
}

export default App;
