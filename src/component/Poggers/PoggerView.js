// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css"

// MU
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class PoggerView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        // If we do not have a top location selected, displaying direct option for selecting location
        if (this.props.displayAdd) {
            return (
                <div className = "poggersys_holder">
                    <div className = "no_selected_system_view">No Initialized View</div>
                    <div className = "no_selected_system_view_input_header">Type in the system name to create a view</div>

                    <div className = "text_field_holder_input_system">
                        <TextField value = {this.props.update_system_input} onChange = {(value) => {this.props.update_input_system(value)}} placeholder = "System Name" variant="filled" className = "input_no_selected_system"/>
                    </div>

                    <Button onClick = {() => {this.props.update_wormhole_mask()}} variant="contained" component="span" className="create_system_button">Create</Button>
                </div>
            )
        }

        // Rendering the 'current' location of the player, if that is what the player wants
        console.log(this.props);

        if (this.props.top_location == null) {
            return (
                <div className = "loading">
                    Loading...
                </div>
            )
        }

        return (
            <div className = "poggersys_holder">
                <div className = "poggersys_row">
                    <PoggerSystem 
                        location = {this.props.top_location}
                        selected_system = {this.props.selected_system}
                        select = {this.props.set_selected_system}
                    />
                </div>
                <div className = "poggersys_row">
                </div>
            </div>
        )
    }
}

class PoggerSystem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        // Checking if we are selected system
        let selected = "poggersys_system"
        if (this.props.selected_system == this.props.system_name) {
            selected = "poggersys_system sys_selected"
        }

        let nickname = null;
        if (this.props.location['nickname'] != null) {
            nickname = this.props.location['nickname'];
        }

        // Checking if not wormhole
        if (this.props.location['wormhole'] == null) {
            return (
            <div className = {selected} onClick={() => {this.props.select(this.props.location['solarSystemName'])}}>
                <div className = "poggersys_system_type">{this.props.location['securityClass']}</div>
                <div className = "poggersys_system_connections">{this.props.location['regionName']}</div>
                <div className = "poggersys_system_name">{this.props.location['solarSystemName']}</div>
                <div className = "poggersys_system_nickname">{nickname}</div>
            </div>)
        }

        return (
            <div className = {selected} onClick={() => {this.props.select(this.props.location['solarSystemName'])}}>
                <div className = "poggersys_system_type">{this.props.location['wormhole']['class']}</div>
                <div className = "poggersys_system_connections">{this.props.location['wormhole']['static']['display_text']}</div>
                <div className = "poggersys_system_name">{this.props.location['solarSystemName']}</div>
                <div className = "poggersys_system_nickname">{nickname}</div>
            </div>
        )
    }
}