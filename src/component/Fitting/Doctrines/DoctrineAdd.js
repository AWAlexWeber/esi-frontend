// Loading the react components
import React from 'react';

// Material UI Imports
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

// Importing CSS
import "../../../css/Doctrine/doctrineadd.css";

// Exporting the base API url
const baseURL = "http://vs-eve.com:5000/";

export default class DoctrineAdd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pasteFit: "",
            pasteFitTitle: "",

            fit: "",
            fitTitle: "",

            doctrineAddType: "paste",
            esi_fits: []
        }

        this.updateFit = this.updateFit.bind(this);
        this.updateFitTitle = this.updateFitTitle.bind(this);
        this.updatePasteFitTitle = this.updatePasteFitTitle.bind(this);
        this.updatePasteFit = this.updatePasteFit.bind(this);
    }
    
    addFit() {
        let fit_title = (this.state.doctrineAddType == "paste" ? this.state.pasteFitTitle : this.state.fitTitle);
        let fit = (this.state.doctrineAddType == "paste" ? this.state.pasteFit : this.state.fit);
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            fit_title: fit_title,
            eft_fit: fit,
            fit_attributes: {}
        }
        console.log(params);

        if (fit_title.length <= 0) {
            alert("Missing fit title!");
            return;
        }
        if (fit.length <= 0) {
            alert("Missing fit!")
            return;
        }

        let ref = this;

        fetch(baseURL+"fit/add", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log(myJson);
            alert(myJson['data'])
        });
    }

    updateFit(value) {
        this.setState({fit: value});
    }

    updateFitTitle(value) {
        this.setState({fitTitle: value});
    }

    updatePasteFitTitle(value) {
        this.setState({pasteFitTitle: value});
    }

    updatePasteFit(value) {
        this.setState({pasteFit: value});
    }

    getCharacterFits() {
        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        }

        let ref = this;

        fetch(baseURL+"fit/get_eve_all", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            ref.setState({esi_fits: myJson['data']})
        });
    }

    componentDidMount() {
        this.getCharacterFits();
    }

    render() {

        let selectedInputType = null;
        if (this.state.doctrineAddType == "paste") {
            selectedInputType = <DoctrineAddRaw updatePasteFitTitle = {this.updatePasteFitTitle} updatePasteFit = {this.updatePasteFit} pasteFit = {this.state.pasteFit} pasteFitTitle = {this.state.pasteFitTitle}/>;
        }
        else if (this.state.doctrineAddType == "import") {
            selectedInputType = <DoctrineAddFit esi_fits = {this.state.esi_fits} updateFitTitle = {this.updateFitTitle} updateFit = {this.updateFit} fit = {this.state.fit} fitTitle = {this.state.fitTitle}/>;
        }

        return (
            <div className = "container_main">
                <div className = "container_header">Add Fitting</div>
                <div className = "container_inner">
                    <div className = "doctrineRadioContainer">
                        <RadioGroup onChange={(e) => {this.setState({doctrineAddType: e.target.value});}} row aria-label="position" name="position" className = "doctrineRadioGroup" defaultValue={this.state.doctrineAddType}>
                            <FormControlLabel
                                value="paste"
                                control={<Radio color="primary" />}
                                label="Paste Fit"
                                labelPlacement="top"
                                className = "doctrineRadioFormControl"
                            />
                            <FormControlLabel
                                value="import"
                                control={<Radio color="primary" />}
                                label="Import Fit"
                                labelPlacement="top"
                                className = "doctrineRadioFormControl"
                            />
                        </RadioGroup>
                    </div>

                
                    {selectedInputType}
                    <Button
                        className = "doctrineAddFitButton"
                        onClick = {() => {this.addFit()}}
                    >
                        Add Fit
                    </Button>
                </div>
            </div>
        )
    }
}

class DoctrineAddFit extends React.Component {
    constructor(props) {
        super(props);
    }

    attemptGrabTitle(value) {
        let firstComma = value.indexOf(",")
        let endBracket = value.indexOf("]");
        if (firstComma == -1 || endBracket == -1) {
            return;
        }

        let title = value.substring(firstComma + 2, endBracket);
        let shipName = value.substring(1, firstComma)
        return title + " (" + shipName + ")";
    }

    updateSelectFit(fit_index) {
        var fit = this.props.esi_fits[fit_index];
        let firstComma = fit.indexOf(",")
        let endBracket = fit.indexOf("]");
        if (firstComma == -1 || endBracket == -1) {
            return;
        }

        let title = fit.substring(firstComma + 2, endBracket);
        this.props.updateFit(fit);
        this.props.updateFitTitle(title);
    }

    render() {

        var esi_fit_render = []
        for (var fit_index in this.props.esi_fits) {
            var title = this.attemptGrabTitle(this.props.esi_fits[fit_index])
            esi_fit_render.push(
                <FormControlLabel
                    value={fit_index}
                    control={<Radio color="primary" />}
                    label={title}
                    labelPlacement="right"
                    className = "radioDoctrineAddFit"
                />
            )
        }
        return (
            <div className = "doctrineAddFitContainer">
                <div className = "doctrineAddFitLeft">
                    <RadioGroup 
                        row aria-label="position" 
                        name="position" 
                        className = "doctrineRadioGroup"
                        onChange={(e) => {this.updateSelectFit(e.target.value)}}
                    >
                        {esi_fit_render}
                    </RadioGroup>
                </div>
                <div className = "doctrineAddFitRight">
                <div className = "textFieldFitTitle">EFT Fit</div>
                    <TextareaAutosize
                        className = "doctrineFitTextField" 
                        aria-label="empty textarea" 
                        placeholder="Empty" 
                        maxRows={25} 
                        minRows={25}
                        value={this.props.fit}
                        disabled={true}
                    />
                    <div className = "textFieldFitTitle">Fit Title</div>
                    <TextField
                        value = {this.props.fitTitle}
                        className="doctrineFitTextField"
                        disabled={true}
                    />
                </div>
            </div>
        )
    }
}

class DoctrineAddRaw extends React.Component {
    constructor(props) {
        super(props);
    }

    attemptGrabTitle(value) {
        let firstComma = value.indexOf(",")
        let endBracket = value.indexOf("]");
        if (firstComma == -1 || endBracket == -1) {
            return;
        }

        let title = value.substring(firstComma + 2, endBracket);
        if (title.length > 0) {
            this.onChangeTitle(title);
        }
    }

    onChangePaste(value) {
        this.attemptGrabTitle(value);
        this.props.updatePasteFit(value);
    }

    onChangeTitle(value) {
        this.props.updatePasteFitTitle(value);
    }

    render() {
        return (
            <form noValidate autoComplete="off">
                <div className = "textFieldTitle">Paste Fit</div>
                <TextareaAutosize 
                    value = {this.props.pasteFit} 
                    onChange={(e) => {this.onChangePaste(e.target.value)}} 
                    className = "doctrineTextField" 
                    aria-label="empty textarea" 
                    placeholder="Empty" 
                    maxRows={25} 
                    minRows={25}
                />
                <div className = "textFieldTitle">Fit Title</div>
                <TextField 
                    disabled={true}
                    value = {this.props.pasteFitTitle}
                    className="doctrineTextField"
                />
            </form>
        )
    }
}