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
const baseURL = "http://vs-eve.com:5000/";

export default class PoggerSig extends React.Component {


    constructor(props) {
        super(props);

        this.state = {};
        this.click_ref = React.createRef();

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

    saveEditSig() {
        this.props.saveEditSig();
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
        let destination = wormhole_value['destination'];

        if (value.length <= 0) {
            destination = "";
        }

        this.props.updateNewSig("newSigWormholeLifeHours", wormhole_value['lifetime_hours']);
        this.props.updateNewSig("newSigWormholeDestinationClass", destination);
        this.props.updateNewSig("newSigWormholeType", value);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if (!this.props.displayPopup) {
            return;
        }
        else {
            // Handling click
            let target = e.target.className;
            if (target === "popup_sig_bacgkround") {
                // Closing the display...
                this.props.displayPoggerPopup(false, null);
            }
        }
    };

    render() {

        if (!this.props.displayPopup) {
            return <div />
        }

        // Building the auto sig select from our wormhole_all_types data
        let wormhole_types = this.props.wormhole_all_types;
        let elementDisplayList = [];
        let elementFilterList = [];

        if (this.props.newSigGroup === "Wormhole") {


            /////////////////////////////////////////////////
            // Building the static list from wormhole data //
            /////////////////////////////////////////////////
            let wormhole_chain_data = this.props.chain[this.props.selected_system]['wormhole'];
            if (wormhole_chain_data !== undefined && wormhole_chain_data !== null && Object.keys(wormhole_chain_data).length > 0) {
                // Okay skipping this...
                // Building the statics first...
                let static_divider =
                    <div className="AC_wormhole_divider">
                        Static Wormholes
                    </div>;

                elementDisplayList.push(static_divider);
                elementFilterList.push("");

                // Actually appending the data here...
                for (let wormhole_static_index in wormhole_chain_data['static']['statics']) {
                    let grab_static = wormhole_chain_data['static']['statics'][wormhole_static_index];
                    let entry_value = grab_static;

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

                    let destination_style = destination + "_style_display";

                    let elementDisplay =
                        <div className="AC_wormhole_holder">
                            <div className="AC_wormhole_name_holder">
                                <div className="AC_wormhole_name">{entry_value['name']}</div>

                                <div className={"AC_wormhole_destination " + destination_style}>{destination}</div>
                                <div className="AC_wormhole_name_title">{entry_value['respawn']}</div>

                            </div>

                            <div className="AC_wormhole_info">

                            </div>

                        </div>;
                    elementDisplayList.push(elementDisplay);
                    elementFilterList.push(entry_value['name']);
                }
            }

            ///////////////////////////////////////////
            // Building all possible wandering types //
            ///////////////////////////////////////////


            let wandering_divider =
                <div className="AC_wormhole_divider">
                    Wandering Wormholes
                </div>;

            elementDisplayList.push(wandering_divider);
            elementFilterList.push("");

            if (wormhole_types !== null && wormhole_types !== undefined) {
                // Alright, lets build our list
                for (let entry in wormhole_types) {
                    let entry_value = wormhole_types[entry];

                    let selected_system_class = null;
                    if (wormhole_chain_data !== null && wormhole_chain_data !== undefined)
                        selected_system_class = wormhole_chain_data['class'];

                    if (selected_system_class !== null || selected_system_class !== entry_value['source'])
                        continue;


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

                    let destination_style = destination + "_style_display"

                    let elementDisplay =
                        <div className="AC_wormhole_holder">
                            <div className="AC_wormhole_name_holder">
                                <div className="AC_wormhole_name">{entry_value['name']}</div>

                                <div className={"AC_wormhole_destination " + destination_style}>{destination}</div>
                                <div className="AC_wormhole_name_title">{entry_value['respawn']}</div>

                            </div>

                            <div className="AC_wormhole_info">

                            </div>

                        </div>;
                    elementDisplayList.push(elementDisplay);
                    elementFilterList.push(entry_value['name']);
                }
            }



            let other_divider =
                <div className="AC_wormhole_divider">
                    Other Wormholes
                </div>;

            elementDisplayList.push(other_divider);
            elementFilterList.push("");


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

                    let destination_style = destination + "_style_display"

                    let elementDisplay =
                        <div className="AC_wormhole_holder">
                            <div className="AC_wormhole_name_holder">
                                <div className="AC_wormhole_name">{entry_value['name']}</div>

                                <div className={"AC_wormhole_destination " + destination_style}>{destination}</div>
                                <div className="AC_wormhole_name_title">{entry_value['respawn']}</div>

                            </div>

                            <div className="AC_wormhole_info">

                            </div>

                        </div>;
                    elementDisplayList.push(elementDisplay);
                    elementFilterList.push(entry_value['name']);
                }
            }
        }

        let add_button = null;
        // Checking if we can give the add button...
        if (this.props.popupType === "add" && this.props.newSigID.length === 3 && (this.props.newSigNum.toString()).length === 3 && this.props.newSigGroup.length > 0) {
            add_button = <Button onClick = {() => {this.addSig()}} className = "popupButtonsButton">Add</Button>;
        }
        else if (this.props.popupType === "edit" && this.props.newSigID.length === 3 && (this.props.newSigNum.toString()).length === 3 && this.props.newSigGroup.length > 0) {
            add_button = <Button onClick = {() => {this.saveEditSig()}} className = "popupButtonsButton">Save</Button>;
        }

        let title = ""
        if (this.props.popupType == "add")
            title = "Adding Signature to " + this.props.selected_system;
        else if (this.props.popupType == "edit")
            title = "Editing Signature";

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
                    <div className = "popupSigData_wh_stability_title">Type:</div>
                    <Select className = "popupSigData_wh_select_field"
                            value={this.props.newSigDestinationType}
                            onChange={(v) => {this.setNewSig('destination_type', v)}}
                    >
                        <MenuItem value={"HS"}>Highsec</MenuItem>
                        <MenuItem value={"LS"}>Lowsec</MenuItem>
                        <MenuItem value={"NS"}>Nullsec</MenuItem>
                        <MenuItem value={"Unknown"}>Unknown</MenuItem>
                        <MenuItem value={"Dangerous"}>Dangerous</MenuItem>
                        <MenuItem value={"Deadly"}>Deadly</MenuItem>
                        <MenuItem value={"C1"}>Class-1</MenuItem>
                        <MenuItem value={"C2"}>Class-2</MenuItem>
                        <MenuItem value={"C3"}>Class-3</MenuItem>
                        <MenuItem value={"C4"}>Class-4</MenuItem>
                        <MenuItem value={"C5"}>Class-5</MenuItem>
                        <MenuItem value={"C6"}>Class-6</MenuItem>
                    </Select>
                </div>

                <div className = "popupSigData_wh_status_holder">
                    <div className = "popupSigData_wh_stability_title">Mass:</div>
                    <Select className = "popupSigData_wh_select_field"
                            value={this.props.newSigMass}
                            onChange={(v) => {this.setNewSig('display_mass', v)}}
                    >
                        <MenuItem value={"Stable"}>Stable</MenuItem>
                        <MenuItem value={"Destab"}>Destab</MenuItem>
                        <MenuItem value={"Critical"}>Critical</MenuItem>
                    </Select>
                    <div className = "popupSigData_wh_stability_title">Life:</div>
                    <Select className = "popupSigData_wh_select_field"
                            value={this.props.newSigLifespan}
                            onChange={(v) => {this.setNewSig('display_lifespan', v)}}
                    >
                        <MenuItem value={"Stable"}>Stable</MenuItem>
                        <MenuItem value={"Critical"}>Critical</MenuItem>
                    </Select>
                </div>
            </div>
        }

        if (this.props.displayPopup && (this.props.popupType == "edit" || this.props.popupType == "add")) {
            return (
                <div className = "popup_sig_bacgkround">
                    <Paper className = "popup_sig" elevation={8} ref={this.click_ref}>
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
                                    <MenuItem value={"Combat Site"}>Combat Site</MenuItem>
                                    <MenuItem value={"Wormhole"}>Wormhole</MenuItem>
                                    <MenuItem value={"Relic Site"}>Relic Site</MenuItem>
                                    <MenuItem value={"Data Site"}>Data Site</MenuItem>
                                    <MenuItem value={"Ore Site"}>Ore Site</MenuItem>
                                    <MenuItem value={"Gas Site"}>Gas Site</MenuItem>
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