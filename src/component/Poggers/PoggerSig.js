// Notes container
// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css";
import "../../css/pogger_sig.css";
import 'font-awesome/css/font-awesome.min.css';

// MU
import TextField from '@material-ui/core/TextField';
import Popup from "reactjs-popup";
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

// External
import AutoComplete from "../AutoComplete";

// Exporting the base API url
const baseURL = "http://13.57.164.44:5000/";

export default class PoggerSig extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.setNewSig = this.setNewSig.bind(this);
        this.onWormholeTypeAutocompleteChange = this.onWormholeTypeAutocompleteChange.bind(this);
        this.onAutocompleteMenuClick = this.onAutocompleteMenuClick.bind(this);
        this.onWormholeDestinationAutocompleteChange = this.onWormholeDestinationAutocompleteChange.bind(this);
    }

    setNewSig(type, value) {
        value = value.target.value;
        this.props.updateNewSig(type,value);
    }

    addSig() {
        this.props.addNewSig();
        this.props.displayPoggerPopup(false, "");
    }

    // Functions for dealing with the automcomplete
    onWormholeTypeAutocompleteChange(event) {
        this.setNewSig("newSigWormholeType", event);
    }

    // Functions for dealing with the automcomplete
    onWormholeDestinationAutocompleteChange(event) {
        this.setNewSig("newSigWormholeDestination", event);
    }

    onAutocompleteMenuClick(value) {

        // Got a complete value...
        let wormhole_value = this.props.wormhole_all_types_index[value];
        console.log(wormhole_value);
        console.log(wormhole_value['lifetime_hours']);
        this.props.updateNewSig("newSigWormholeLifeHours", wormhole_value['lifetime_hours'])
        this.props.updateNewSig("newSigWormholeType",value);
    }

    render() {

        // Building the auto sig select from our wormhole_all_types data
        let wormhole_types = this.props.wormhole_all_types;
        let elementDisplayList = [];
        let elementFilterList = [];
        if (wormhole_types !== null && wormhole_types !== undefined) {
            // Alright, lets build our list
            for (let entry in wormhole_types) {
                let entry_value = wormhole_types[entry];

                let destination = entry_value['destination'];
                if (destination === "Nullsec") {
                    destination = "NS";
                }
                if (destination === "Lowsec") {
                    destination = "LS";
                }
                if (destination === "Highsec") {
                    destination = "HS";
                }
                if (destination === "Unknown") {
                    destination = "???";
                }

                let destination_style = destination+"_style_display"

                let elementDisplay =
                <div className = "AC_wormhole_holder">
                    <div className = "AC_wormhole_name_holder">
                        <div className = "AC_wormhole_name">{entry_value['name']}</div>

                        <div className = {"AC_wormhole_destination " + destination_style}>{destination}</div>
                        <div className ="AC_wormhole_name_title">{entry_value['respawn']}</div>

                    </div>

                    <div className = "AC_wormhole_info">

                    </div>

                </div>
                elementDisplayList.push(elementDisplay);

                elementFilterList.push(entry_value['name']);
            }
        }

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
        let text_name_field = <div className = "popupSigData"><div className = "popupSigData_id_title">Name:</div><TextField value = {this.props.newSigName} onChange={(v) => {this.setNewSig('name', v)}} className = "popupSigData_name" placeholder = "Name"/></div>

        if ((this.props.popupType == "add" || this.props.popupType == "edit") && this.props.newSigGroup == "Wormhole") {
            text_name_field = null;
            wormhole_display = 
            <div className = "popupSigEdit">
                <div className = "wormhole_type_data_holder">
                    <div className = "popupSigData_wh_type_title">Type:</div>
                    <AutoComplete
                        holderClassName = "popupSigData_wh_type_holder"
                        maxLength = "4"
                        inputClassName = "popupSigData_wh_type"
                        placeholder = "Wormhole Type"
                        value = {this.props.newSigWormholeType}
                        onChange={this.onWormholeTypeAutocompleteChange}
                        elementDisplayList = {elementDisplayList}
                        elementFilterList = {elementFilterList}
                        onMenuClick = {this.onAutocompleteMenuClick}
                    />
                    <div className = "popupSigData_wh_lifespan_title">Life:</div>
                        <TextField value = {this.props.newSigWormholeLifeHours} disabled maxLength = "4" className = "popupSigData_wh_life" placeholder = "Life"/>
                    <div className = "popupSigData_wh_lifespan_info">hours</div>
                </div>

                <div className = "popupSigData_wh_destionation_holder">
                    <div className = "popupSigData_wh_type_title">Destination:</div>
                    <AutoComplete
                        holderClassName = "popupSigData_wh_destionation_input_holder"
                        inputClassName = "popupSigData_wh_destionation_input"
                        placeholder = "Destination"
                        value = {this.props.newSigWormholeDestination}
                        onChange={this.onWormholeDestinationAutocompleteChange}
                        elementDisplayList = {null}
                        elementFilterList = {null}
                        onMenuClick = {this.onAutocompleteMenuClick}
                    />
                </div>
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

                        {text_name_field}

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