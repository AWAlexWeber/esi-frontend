// Notes container
// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css"
import 'font-awesome/css/font-awesome.min.css';

// MU
import TextField from '@material-ui/core/TextField';
import Popup from "reactjs-popup";
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

// Exporting the base API url
const baseURL = "http://13.57.164.44:5000/";

export default class PoggerSig extends React.Component {
    constructor(props) {
        super(props);
    }

    setNewSig(type, value) {
        value = value.target.value;
        this.props.updateNewSig(type,value);
    }

    addSig() {

        // First, lets make the call to submit this into our system...
        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        // Appending our extra information
        params['sig_id_num'] = this.props.newSigNum;
        params['sig_id_letter'] = this.props.newSigID;

        fetch(baseURL+"sig/add", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 5) {
                return;
            }
            return response.json();
        }).then(function(myJson) {

        });

        this.props.displayPoggerPopup(false, "");
    }

    render() {

        let add_button = null;
        // Checking if we can give the add button...
        if (this.props.newSigID.length == 3 && this.props.newSigNum.length == 3 && this.props.newSigGroup.length > 0) {
            add_button = <Button onClick = {() => {this.addSig()}} className = "popupButtonsButton">Add</Button>;
        }

        let title = ""
        if (this.props.popupType == "add")
            title = "Adding Signature to " + this.props.selected_system

        // Determining to display wormhole data or not
        let wormhole_display = null;
        if ((this.props.popupType == "add" || this.props.popupType == "edit") && this.props.newSigGroup == "Wormhole") {
            wormhole_display = 
            <div className = "popupSigEdit">
            </div>
        }

        if (this.props.displayPopup && this.props.popupType == "add") {
            return (
                <div className = "popup_sig_bacgkround" >
                    <Paper className = "popup_sig" elevation={8}>
                        <div className = "popup_close">
                            <i className={"fa fa-close close_icon"} onClick = {() => {this.props.displayPoggerPopup(false, null)}}/>
                        </div>

                        <div className = "popupTitle">
                            {title}
                        </div>

                        <div className = "popupSigData">
                            <div className = "popupSigData_id_title">ID:</div>
                            <TextField maxLength = "3" value = {this.props.newSigID} onChange={(v) => {this.setNewSig('letter', v)}} className = "popupSigData_letter" placeholder = "---"/>
                            <TextField maxLength = "3" value = {this.props.newSigNum} onChange={(v) => {this.setNewSig('number', v)}} className = "popupSigData_number" placeholder = "###"/>

                            <div className = "popupSigTypeDropdown">
                                <Select className = "popupSigTypeSelect"
                                    value={this.props.newSigGroup}
                                    onChange={(v) => {this.setNewSig('group', v)}}
                                >
                                    <MenuItem value={"Unknown"}>Unknown</MenuItem>
                                    <MenuItem value={"Combat"}>Combat</MenuItem>
                                    <MenuItem value={"Wormhole"}>Wormhole</MenuItem>
                                    <MenuItem value={"Relic"}>Relic</MenuItem>
                                    <MenuItem value={"Data"}>Data</MenuItem>
                                    <MenuItem value={"Ore"}>Ore</MenuItem>
                                    <MenuItem value={"Gas"}>Gas</MenuItem>
                                </Select>
                            </div>
                        </div>

                        <div className = "break" />

                        <div className = "popupSigData">
                            <div className = "popupSigData_id_title">Name:</div>
                            <TextField value = {this.props.newSigName} onChange={(v) => {this.setNewSig('name', v)}} className = "popupSigData_name" placeholder = "Name"/>
                        </div>

                        {wormhole_display}

                        <div className = "popupButtons">
                            {add_button}
                            <Button onClick = {() => {this.props.displayPoggerPopup(false, null)}} className = "popupButtonsButton">Close</Button>
                        </div>
                    </Paper>
                </div>
            )
        }
        return (
            <div>

            </div>
        )
    }
}