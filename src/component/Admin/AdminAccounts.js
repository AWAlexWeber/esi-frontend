// Loading the react components
import React from 'react';

// CSS
import "../../css/admin.css"

// Class that handles all of the authentication
import queryString from 'query-string';

// Components
import AdminAccountsList from "../Admin/AdminAccounts/AdminAccountsList.js";

const baseURL = "http://165.22.131.96:5000/";

export default class AdminAccounts extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}

        // Loading administration information from API
        console.error("Loading administration information");
        this.setCharacterAccountGroup = this.setCharacterAccountGroup.bind(this);
        this.loadAdministrationInfo()
    }

    loadAdministrationInfo() {

        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        let ref = this;

        // Taking the params and saving the new code and state...
        fetch(baseURL+"admin/accounts", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log("Loading administration account info")
            console.log(myJson);

            ref.setState({all_accounts: myJson})
        });
    }

    setCharacterAccountGroup(new_target_character, new_character_type) {
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            target_character: new_target_character,
            character_type: new_character_type
        };

        let ref = this;

        // Taking the params and saving the new code and state...
        fetch(baseURL+"admin/set_character_type", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log("Set character type")

            // Reloading display
            ref.loadAdministrationInfo();
        });
    }

    render() {
        return (
            <div className = "admin_holder">

                <AdminAccountsList all_accounts = {this.state.all_accounts} setCharacterAccountGroup = {this.setCharacterAccountGroup}/>
            </div>
        )
    }
}