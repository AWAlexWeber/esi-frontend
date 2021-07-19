// Loading the react components
import React from 'react';

// Material UI
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';      
import { withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

// CSS
import "../../css/CCTV/cctv.css"
import "../../css/CCTV/cctv_tokens.css"

const baseURL = "http://vs-eve.com:5000/";

const OrangeCheckbox = withStyles({
    root: {
      color: orange[400],
      '&$checked': {
        color: orange[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

export default class CCTVTokens extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cctv_token_list: [],
            delete_set: new Set()
        }
    }

    toggleDeleteSet(token_id) {
        let currentDeleteSet = this.state.delete_set;
        if (currentDeleteSet.has(token_id)) {
            currentDeleteSet.delete(token_id);
        }
        else {
            currentDeleteSet.add(token_id);
        }
        this.setState({delete_set: currentDeleteSet});
    }

    deleteSelectedSet() {
        let ref = this;
        let deleteArray = Array.from(this.state.delete_set);
        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            token_delete_array: deleteArray
        };

        fetch(baseURL+"/stream/token/delete", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 0) {
                return;
            }
            return response.json();
        }).then(function(myJson) {
            // Okay lets get the data value
            ref.setState({cctv_token_list: myJson['data'], delete_set: new Set()})
        });
    }

    componentDidMount() {
        document.title = "ＶＳ -    CCTV";
        this.getAllTokens();
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
            ref.setState({cctv_token_list: myJson['data']})
        });
    }

    render() {

        let cctv_token_list = [];

        let cctv_header =
        <div className = "cctv_list_row_header">
            <div className = "cctv_list_row_element_select">Select</div>
            <div className = "cctv_list_row_element_title">Code</div>
            <div className = "cctv_list_row_element_title">Frames Logged</div>
            <div className = "cctv_list_row_element_title">Character ID</div>
            <div className = "cctv_list_row_element_title">Token Status</div>
            <div className = "cctv_list_row_element_title">Creation</div>
            <div className = "cctv_list_row_element_title">Last Frame</div>
            <div className = "cctv_list_row_element_title">Control</div>
        </div>;

        cctv_token_list.push(cctv_header);

        this.state.cctv_token_list.slice().reverse().forEach(element => {
            let new_list_element = 
            <div className = "cctv_list_element">
                <div className = "cctv_list_row_element_select"><OrangeCheckbox checked = {this.state.delete_set.has(element[0])} onClick={() => {this.toggleDeleteSet(element[0])}} className = "cctv_orange_checkbox"/></div>
                <div className = "cctv_list_row_element">{element[1]}</div>
                <div className = "cctv_list_row_element">{element[5]}</div>
                <div className = "cctv_list_row_element">{element[2]}</div>
                <div className = "cctv_list_row_element">{element[4]}</div>
                <div className = "cctv_list_row_element">{element[3]}</div>
                <div className = "cctv_list_row_element">{element[6]}</div>
                <div className = "cctv_list_row_element"><Button onClick={() => this.props.history.push("/cctv?token="+element[1])} disabled={element[4] != "Active"} className = "cctv_view_button" variant="contained">View</Button></div>
            </div>
            cctv_token_list.push(new_list_element);
        });

        return (
            <div className = "cctv_token">
                <div className = "cctv_left_holder">
                    <div className = "cctv_left_title">
                        All CCTV Tokens
                    </div>
                    <div className = "cctv_left_button_holder">
                        <Button disabled={this.state.delete_set.size <= 0} onClick={() => {this.deleteSelectedSet()}} className = "cctv_button" variant="contained">Delete Selected</Button>
                    </div>
                </div>
                <div className = "cctv_list">
                    <br />
                    <div className = "cctv_token_list_container">
                        {cctv_token_list}
                    </div>
                </div>
            </div>
        )
    }
}