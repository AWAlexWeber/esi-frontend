// Loading the react components
import React from 'react';

// Loading the load screen component
import LoadingScreen from 'react-loading-screen';

// Class that handles all of the authentication
import queryString from 'query-string';

// Exporting the base API url
const baseURL = "http://165.22.131.96:5000/";

export default class AuthHandler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authText: 'Authenticating...',
            callback: false
        }
    }

    performCallback(json) {
        this.props.auth_callback(json)
    }

    componentDidMount() {

        console.log("Beginning authentication process!");
        console.log(this.state.callback);
        console.log(this.state.authText);

        // Ignoring if we have already made the callback
        if (this.state.callback) {
            return;
        }

        // Grabbing the authentication URL...
        let url = this.props.location.search;
        let params = queryString.parse(url);

        let ref = this;

        // Taking the params and saving the new code and state...
        fetch(baseURL+"auth/code", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log(myJson);

            // Interpreting the response
            if (myJson['code'] != 200) {
                // Some sort of error...
                let setAuthText = myJson['reason'];
                console.log("SETTING STATE TO TRUE!");
                ref.setState({authText: setAuthText, callback: true});

                setTimeout(function() {
                    ref.props.history.push('/home')
                }, 2000);
            }
            else {
                // Grabbing the state and code from the search terms
                // Letes redirect back to home, indicating a successful authentication
                let setAuthText = "Success!";
                console.log("SETTING STATE TO TRUE!");

                ref.setState({authText: setAuthText, callback: true});
            
                // Setting the login callback for auth and character

                setTimeout(function() {
                    ref.props.history.push('/home');
                    ref.performCallback(myJson);
                }, 20000);

                return;
            }

            // Now waiting an loading home page
        });

    }

    render() {
        
        return (
            <LoadingScreen
                class="loading"
                loading={true}
                bgColor='#262626'
                spinnerColor='#E2B248'
                textColor='white'
                logoSrc={require("../assets/img/naphe_logo.png")}
                text={this.state.authText}
            /> 
        )
    }
}
