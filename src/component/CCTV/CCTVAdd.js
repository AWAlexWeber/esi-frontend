// Loading the react components
import React from 'react';

// MU
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// CSS
import "../../css/CCTV/cctv.css"
import "../../css/CCTV/cctv_add.css"


const baseURL = "http://165.22.131.96:5000/";

export default class CCTVAdd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            new_cctv_token: ""
        }

        this.generateNewToken = this.generateNewToken.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    componentDidMount() {
        document.title = "ＶＳ -    CCTV";
    }

    // Function for copying to clipboard
    copyToClipboard(type) {
        if (type === "token") {
            this.textToken.select();
            document.execCommand('copy');
        }
        else if (type === "id") {
            this.textID.select();
            document.execCommand('copy');
        }
    }

    generateNewToken() {
        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        fetch(baseURL+"stream/auth/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 0) {
                return;
            }
            return response.json();
        }).then(function(myJson) {
            // Okay lets get the data value
            console.log(myJson);

            ref.setState({new_cctv_token: myJson['data']})
        });
    }

    render() {

        let add_cctv_info_holder = null;
        let generate_token_button =
        <Button
            className = "button_cctv_add"
            color="primary"
            variant="filled"
            onClick = {() => { this.generateNewToken() }}
        >
            Generate Token
        </Button>;

        if (this.state.new_cctv_token.length > 0) {
            generate_token_button = null;
            add_cctv_info_holder =
                <Paper elevation={20} className = "cctv_info_holder">

                    <div className = "cctv_info_row">
                        <div className = "cctv_id_title">
                            Your ID:
                        </div>

                        <textarea ref={(textarea) => this.textID = textarea} spellcheck="false" value = {this.props.character_id} className = "cctv_add_token_title">

                        </textarea>

                        <i
                            className = "fa fa-copy cctv_add_copy_icon"
                            style = {{float: "left", marginLeft: 5, marginRight: 25, fontSize: 32, color: "white"}}
                            onClick = {() => {this.copyToClipboard("id")}}
                        />
                    </div>

                    <div className = "cctv_info_row">
                        <div className = "cctv_token_title">
                            Token:
                        </div>

                        <textarea ref={(textarea) => this.textToken = textarea} spellcheck="false" value = {this.state.new_cctv_token} className = "cctv_add_token_title">

                        </textarea>

                        <i
                            className = "fa fa-copy cctv_add_copy_icon"
                            style = {{float: "left", marginLeft: 5, marginRight: 25, fontSize: 32, color: "white"}}
                            onClick = {() => {this.copyToClipboard("token")}}
                        />
                    </div>
                </Paper>;
        }

        return (
            <div className = "cctv">
                <div className = "cctv_add_title">
                    Create a New CCTV
                </div>

                <div className = "cctv_add_info">
                    Before creating a new CCTV stream, please ensure that you have the software installed and ready to begin capture. All generated tokens will only be available for 5 minutes before they will be deleted and unusable.
                </div>

                {generate_token_button}

                {add_cctv_info_holder}
            </div>
        )
    }
}