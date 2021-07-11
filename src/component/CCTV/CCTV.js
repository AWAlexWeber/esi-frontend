// Loading the react components
import React from 'react';

// CSS
import "../../css/CCTV/cctv.css"

const baseURL = "http://vs-eve.com:5000/";

export default class CCTV extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    CCTV";
    }

    // Getting all of the tokens
    getAllTokens() {
            let ref = this;
    
            // Getting the players most up-to-date location information
            let params = {
                character_id: this.props.character_id,
                character_auth_code: this.props.auth_code
            };
    
            fetch(baseURL+"/stream/token/getall", {
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
                ref.setState({cctv_token_list: myJson['data']})
            });
        }

    render() {

        return (
            <div className = "cctv">
                <div className = "cctv_left_holder">
                    <div className = "cctv_left_title">
                        All CCTV Streams
                    </div>
                </div>

                <CCTVScreen />
            </div>
        )
    }
}

class CCTVScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "cctv_view_holder">

            </div>
        )
    }
}