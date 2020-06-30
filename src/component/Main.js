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
import BottomBar from "../component/BottomBar";

import AuthHandler from "../component/AuthHandler";
import Market from "./Market/Market";
import Home from "./Home/Home";
import Account from "./Account/Account";
import Fitting from "./Fitting/Fitting";
import PoggersManager from "./Poggers/PoggersManager";
import Pledge from "./Pledge/Pledge";
import AdminDashboard from "./Admin/AdminDashboard";
import Buyback from "./Buyback/Buyback";
import CCTVManager from "./CCTV/CCTVManager"

// Loading CSS
import '../css/main.css';

// Cookies!
import Cookies from 'universal-cookie';

// Exporting the base API url
const baseURL = "http://165.22.131.96:5000/";

// Main class deals primarily with management of where we are as well as extending some important things...
export default class Main extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            auth_code: null,
            character_name: null,
            character_id: null,

            character_data: null
        }


        // Binding the index
        this.setActiveIndex = this.setActiveIndex.bind(this);
        this.loginSSO = this.loginSSO.bind(this);
        this.auth_callback = this.auth_callback.bind(this);
        this.pushLocation = this.pushLocation.bind(this);
        this.logOut = this.logOut.bind(this);
        this.checkLoggedIn = this.checkLoggedIn.bind(this);
    }

    // Function for loading user data (such as permissions, etc)
    loadUserData(character_id, auth_code) {

        //Loading user data
        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: character_id,
            character_auth_code: auth_code,
        };

        fetch(baseURL+"character/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let data = myJson['data'];
                console.log("Loaded character data of " + data);
                ref.setState({character_data: data});
            }
        });
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

        this.loadUserData(json['character_id'], json['auth_code']);


        this.setState({auth_code: json['auth_code'], character_name: json['character_name'], character_id: json['character_id']})
    }

    componentWillMount() {
        // Getting cookies
        document.title = "VS";

        const cookies = new Cookies();
        let new_auth = cookies.get("auth_code");
        let character_name = cookies.get("character_name");
        let character_id = cookies.get("character_id");

        // Checking if we get to load or not
        if (new_auth !== undefined && character_name !== undefined && character_id !== undefined)
            this.loadUserData(character_id, new_auth);

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

    // Function for authenticating different routes
    authRoute(route) {

        // Always displaying home
        if (route === "home")
            return true;

        ///////////////////////////
        // Grabbing the variable //
        ///////////////////////////

        if (this.state.character_data == null || this.state.character_data['character_permission_set'] == null)
            return false;

        let permission_set = JSON.parse(this.state.character_data['character_permission_set']);
        let display_array = permission_set['display_array'];
        console.log(display_array);

        // Okay, checking first for some specific use-cases...

        if (route === "admin" && display_array.includes('admin'))
            return true;

        // Checking if it contains all...
        if (route !== "admin" && display_array.includes('all'))
            return true;

        if (route === "account")
            return true;

        ///////////////////
        // Case Handling //
        ///////////////////
        return (display_array.includes(route))

    }

    render() {

        // Checking for routing if not logged in
        // Dynamically building routes based off of our users credentials...

        // Checking for admin
        let admin = null;
        let buyback, pledge, pogger, account, fitting, market, home, cctv = null;
        let replaceRouterPath = ""

        if (this.authRoute('admin'))
            admin = <Route path = "/(admin)/" render={(routerProps) => (<AdminDashboard character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "admin|";
        if (this.authRoute('pledge'))
            pledge = <Route path = "/(pledge)" render={(routerProps) => (<Pledge character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "pledge|";
        if (this.authRoute('pogger'))
            pogger = <Route path="/pogger" render={(routerProps) => (<PoggersManager character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "pogger|";
        if (this.authRoute('account'))
            account = <Route path="/account"  render={(routerProps) => (<Account character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "account|";
        if (this.authRoute('fitting'))
            fitting = <Route path="/fitting"  render={(routerProps) => (<Fitting character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "fitting|";
        if (this.authRoute('market'))
            market = <Route path="/market"  render={(routerProps) => (<Market history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "market|";
        if (this.authRoute('home'))
            home = <Route path="/home"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "home|";
        if (this.authRoute('buyback'))
            buyback = <Route path="/buyback"  render={(routerProps) => (<Buyback character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "buyback|";
        if (this.authRoute('cctv'))
            buyback = <Route path="/cctv"  render={(routerProps) => (<CCTVManager character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        else
            replaceRouterPath = replaceRouterPath + "cctv|";


        // Modifying the replaceRouterPath
        if (replaceRouterPath.length > 1) {
            replaceRouterPath = replaceRouterPath.substring(0, replaceRouterPath.length - 1)
            console.log(replaceRouterPath)
        }

        let routes =
                    
        <div className = "route_holder">
            <Route path="/auth" render={(routerProps) => (<AuthHandler character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            {home}
            {pogger}
            {account}
            {fitting}
            {market}
            {pledge}
            {buyback}
            {cctv}
            {admin}
            <Route path={"/(" + replaceRouterPath + ")/"} render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_data = {this.state.character_data} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
        </div>

        // If we are not logged in, hide everything but home...
        if (this.checkLoggedIn()) {

            console.log("Failure to make authentication check, loading weaker routes (recieved " + this.checkLoggedIn());

            routes =
                    
            <div className = "route_holder">
                <Route exact path="/"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
                <Route path="/(home|market|pogger|pledge|fitting|account|admin|buyback)/"  render={(routerProps) => (<Home loginSSO = {this.loginSSO} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
                <Route path="/auth" render={(routerProps) => (<AuthHandler character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} history = {routerProps.history} location = {routerProps.location} auth_callback = {this.auth_callback} />)} />
            </div>
        }

        return (
            <div class = "mainBody">
                <ToolbarTop character_data = {this.state.character_data} checkLoggedIn = {this.checkLoggedIn} logOut = {this.logOut} className = "toolbar_top" pushLocation = {this.pushLocation} character_id = {this.state.character_id} character_name = {this.state.character_name} auth_code = {this.state.auth_code} loginSSO = {this.loginSSO} activeIndex = {this.state.activeIndex} setActiveIndex = {this.setActiveIndex}/>
                
                {routes}

            </div>
        );
    }
}
