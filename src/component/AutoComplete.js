// Loading the react components
import React from 'react';

// Loading CSS
import '../css/autocomplete.css';

// MU
import TextField from '@material-ui/core/TextField';
import Popup from "reactjs-popup";
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

export default class AutoComplete extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            menu_open: false,
            anchorTextDropdown: null,
        };

        this.onSelectInput = this.onSelectInput.bind(this);
        this.onCloseMenu = this.onCloseMenu.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
    }

    onSelectInput() {
        // Function for when
        this.setState({menu_open: true});
    }

    onCloseMenu() {
        console.log("Closing menu");
        this.setState({menu_open: false});
    }

    onMenuClick(value) {
        this.setState({menu_open: false});
        this.props.onMenuClick(value);
    }

    render() {
        const { anchorTextDropdown } = this.state;

        return (
            <div className = {this.props.holderClassName} aria-owns={anchorTextDropdown ? 'simple-menu' : undefined}>
                <TextField
                    onClick = {() => {this.onSelectInput()}}
                    maxLength = {this.props.maxLength}
                    className ={this.props.inputClassName}
                    placeholder = {this.props.placeholder}
                    value = {this.props.value}
                    onChange = {(v) => {this.props.onChange(v)}}
                />
                <AutoCompleteMenu
                    enableDisplay = {this.state.menu_open}
                    elementDisplayList = {this.props.elementDisplayList}
                    elementFilterList = {this.props.elementFilterList}
                    onMenuClick = {this.onMenuClick}
                    value = {this.props.value}
                    onCloseMenu = {this.onCloseMenu}
                />
            </div>
        )
    }
}

class AutoCompleteMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        // Checking if we are actually being displayed

        if (!this.props.enableDisplay) {
            return (<div />)
        }

        // If our display list is empty, don't display anything
        if (this.props.elementDisplayList === null || this.props.elementFilterList === null || this.props.elementDisplayList.length <= 0 || this.props.elementFilterList.length <= 0) {
            return (<div />)
        }

        // Filtering out some of the stuff if we have a filter
        let filteredElementDisplayList = [];

        // Appending the bumper
        filteredElementDisplayList.push(<div className = "autocomplete_menu_top_buffer">Buffer</div>);

        for (let entry in this.props.elementFilterList) {
            // Checking if entry name contains this
            let entry_value = this.props.elementFilterList[entry];
            if (entry_value.includes(this.props.value)) {
                let duplicate = React.cloneElement(this.props.elementDisplayList[entry]);
                let menu_container = <div onClick = {() => {this.props.onMenuClick(this.props.elementFilterList[entry])}}>{duplicate}</div>
                filteredElementDisplayList.push(menu_container);
            }
        }

        console.log("FILTERED");
        console.log(filteredElementDisplayList);

        return (

            <div className = "autocomplete_menu_holder">
                <div className = "autocomplete_close_menu" onClick = {() => {this.props.onCloseMenu()}}>Close</div>
                {filteredElementDisplayList}
            </div>
        )
    }
}