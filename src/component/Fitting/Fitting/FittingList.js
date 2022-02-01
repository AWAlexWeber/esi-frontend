// Loading the react components
import { List } from '@material-ui/core';
import React from 'react';

// Importing CSS
import "../../../css/Doctrine/doctrinemyfits.css";

// Importing material ui, etc
import SearchBar from "material-ui-search-bar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// Exporting the base API url
const baseURL = "http://vs-eve.com:5000/";

export default class FittingList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show_set: new Set(),
            fits: []
        }

        this.toggleShowSet = this.toggleShowSet.bind(this);
    }

    componentDidMount() {
        this.getFits();
    }

    getFits() {
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
        }
        let ref = this;

        fetch(baseURL+"fit/get_all", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log(myJson);
            ref.setState({fits: myJson})
        });
    }

    toggleShowSet(index) {
        var new_show_set = this.state.show_set;
        if (new_show_set.has(index)) {
            new_show_set.delete(index);
        }
        else {
            new_show_set.add(index);
        }
        this.setState({show_set: new_show_set});
    }

    render() {

        /* Building our doctrine fit list */
        var doctrineFitList = []
        var index = 0;
        this.state.fits.forEach(element => {
            index = index + 1;
            doctrineFitList.push(
                <DoctrineFitList 
                    toggleShowSet = {this.toggleShowSet}
                    index = {index}
                    key = {index} 
                    show = {this.state.show_set.has(index)}
                    fit_id = {element[0]}
                    fit_title = {element[5]} 
                    fit_ship = {element[9]} 
                    fit_creation_date = {element[8]} 
                    data = {element}
                    show_set = {this.state.show_set}
                />
            );
        });
        
        return (
            <div className = "container_main">
                <div className = "container_header">Fits</div>
                <div className = "container_bar_wide">
                    <SearchBar className = "fits_searchbar"/>
                    <FormControl variant="filled" className="fits_select">
                        <InputLabel id="demo-simple-select-filled-label">Ship</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        >
                            <MenuItem value="">
                                <em>No Filter</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" className="fits_select">
                        <InputLabel id="demo-simple-select-filled-label">Doctrine</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        >
                            <MenuItem value="">
                                <em>No Filter</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" className="fits_select">
                        <InputLabel id="demo-simple-select-filled-label">Character</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        >
                            <MenuItem value="">
                                <em>No Filter</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className = "container_inner_adjusted">
                    <div className = "doctrineFitListTitleContainer">
                        <div className = "doctrineFitListExpandButton"></div>
                        <div className = "doctrineFitListTitleShort">ID</div>
                        <div className = "doctrineFitListTitleHeaderLong">Fit Title</div>
                        <div className = "doctrineFitListTitleHeader">Fit Ship</div>
                        <div className = "doctrineFitListTitleHeader">Fit Creation</div>
                    </div>
                    <br />
                    <div className = "doctrineFitListInner">
                        {doctrineFitList}
                    </div>
                </div>
            </div> 
        )
    }
}

class DoctrineFitList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let details = null;

        if (this.props.show) {
            details = <DoctrineFitListDetails title = {this.props.fit_title} data = {this.props.data}/>
        }
        return (
            <div className = "doctrineFitListContainer">
                <div className = "doctrineFitListTitleContainer">
                    <div className = "doctrineFitListExpandButton" onClick = {() => {this.props.toggleShowSet(this.props.index)}}>{this.props.show_set.has(this.props.index) ? "-" : "+"}</div>
                    <div className = "doctrineFitListTitleShort">{this.props.fit_id}</div>
                    <div className = "doctrineFitListTitleLong">{this.props.fit_title}</div>
                    <div className = "doctrineFitListTitle">{this.props.fit_ship}</div>
                    <div className = "doctrineFitListTitle">{this.props.fit_creation_date}</div>
                </div>
                {details}
            </div>
        )
    }
}

class DoctrineFitListDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var required_skills = "";
        var json_data = JSON.parse(this.props.data[7])
        for (var key in json_data) {
            required_skills += ("" + key + ": " + json_data[key] + "\n");
        }
        console.log(required_skills);

        return (
            <div className = "doctrineFitListDetails">
                <div className = "doctrineFitListDetailsTitle">{this.props.title}</div>
                <div className = "doctrineFitListDetailsEFTContainer">
                    <div className = "doctrineFitListDetailsEFT">
                        <br />
                        Fit
                        <textarea disabled className = "doctrineFitListDetailsEFTTextArea" value={this.props.data[3]} />
                        <br />
                    </div>
                    <div className = "doctrineFitListDetailsEFT">
                        <br />
                        Required Skills
                        <textarea disabled className = "doctrineFitListDetailsEFTTextArea" value={required_skills} />
                        <br />
                    </div>
                    <div className = "doctrineFitListDetailsEFT">
                        <br />
                        Recommended Skills
                        <textarea disabled className = "doctrineFitListDetailsEFTTextArea" value={required_skills} />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}