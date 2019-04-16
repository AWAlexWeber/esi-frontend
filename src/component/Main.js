// Loading the react components
import React from 'react';

// Loading the load screen component
import LoadingScreen from 'react-loading-screen';

// Routing
import {
    withRouter
  } from 'react-router-dom'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Loading our other usable components
import ToolbarTop from "../component/Toolbar";
import AuthHandler from "../component/AuthHandler";
import Market from "./Market/Market";
import Home from "./Home/Home";
import Account from "./Account/Account";
import Fitting from "./Fitting/Fitting";
import Poggers from "./Poggers/Poggers";
import Pledge from "./Pledge/Pledge";
import AdminDashboard from "./Admin/AdminDashboard";

// Loading CSS
import '../css/main.css';

// Cookies!
import Cookies from 'universal-cookie';

// Exporting the base API url
export const baseURL = "http://13.57.164.44:5000/";

// Main class deals primarily with management of where we are as well as extending some important things...
export default class Main extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            auth_code: null,
            character_name: null,
            character_id: null
        }


        // Binding the index
        this.setActiveIndex = this.setActiveIndex.bind(this);
        this.loginSSO = this.loginSSO.bind(this);
        this.auth_callback = this.auth_callback.bind(this);
        this.pushLocation = this.pushLocation.bind(this);
        this.logOut = this.logOut.bind(this);
        this.checkLoggedIn = this.checkLoggedIn.bind(this);
    }

    // Callback for auth function
    auth_callback(json) {
        console.log("Recieved callback...")

        let d = new Date();
        d.setTime(d.getTime() + (14400*60*1000));

        const cookies = new Cookies();
        cookies.set("auth_code", json['auth_code'], {path: "/", expires: d});
        cookies.set("character_name", json['character_name'], {path: "/", expires: d});
        cookies.set("character_id", json['character_id'], {path: "/", expires: d});


        this.setState({auth_code: json['auth_code'], character_name: json['character_name'], character_id: json['character_id']})
    }

    componentWillMount() {
        // Getting cookies
        const cookies = new Cookies();
        let new_auth = cookies.get("auth_code");
        let character_name = cookies.get("character_name");
        let character_id = cookies.get("character_id");
        console.log("laoded cookie with " + character_id)

        this.setState({auth_code: new_auth, character_name: character_name, character_id: character_id});
    }

    // Function for setting the active index directly
    setActiveIndex(index, url_title) {
        this.setState({activeIndex: index});
    }

    // Checking logged in
    checkLoggedIn() {
        return (this.state.auth_code == null || this.state.character_name == null || this.state.character_id == null);
    }

    // Clears all cookies
    logOut() {

        let d = new Date();
        d.setTime(d.getTime() - (14400*60*1000));

        const cookies = new Cookies();

        cookies.set("auth_code", 1, {path: "/", expires: d});
        cookies.set("character_name", 1, {path: "/", expires: d});
        cookies.set("character_id", 1, {path: "/", expires: d});

        window.location.reload();
    }

    // Function for handling SSO logging in
    loginSSO() {
        console.log("Attempting SSO Login...");

        // Generating a new redirection URL from our service...
        // Fetching from our API
        fetch(baseURL + "auth/code").then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson.url);
            let redirectURL = myJson.url;
            document.location.href=redirectURL;
          });
    }

    // Function for pushing location
    pushLocation(location) {
        this.props.history.push(location)
    }

    render() {

        // Checking for routing if not logged in
        let routes =
                    
        <div className = "route_holder">
            <Route exact path="/"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/home"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/market"  render={(routerProps) => (<Market history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/fitting"  render={(routerProps) => (<Fitting character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/account"  render={(routerProps) => (<Account character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/auth" render={(routerProps) => (<AuthHandler character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path="/pogger" render={(routerProps) => (<Poggers character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path = "/pledge" render={(routerProps) => (<Pledge character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            <Route path = "/admin" render={(routerProps) => (<AdminDashboard character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        </div>

        // If we are not logged in, hide everything but home...
        if (this.checkLoggedIn()) {

            console.log("Failure to make authentication check, loading weaker routes (recieved " + this.checkLoggedIn());

            routes =
                    
            <div className = "route_holder">
                <Route exact path="/"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
                <Route path="/(home|market|pogger|pledge|fitting|account)/"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
                <Route path="/auth" render={(routerProps) => (<AuthHandler character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            </div>
        }

        return (
            <div class = "mainBody">
                <ToolbarTop checkLoggedIn = {this.checkLoggedIn} logOut = {this.logOut} className = "toolbar_top" pushLocation = {this.pushLocation} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} activeIndex = {this.state.activeIndex} setActiveIndex = {this.setActiveIndex}/>
                
                {routes}

            </div>
        );
    }
}
