// Loading the react components
import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import "../../css/simulator.css";

export default class Simulator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isBlueforStrategyOpen: false,
            isOpforStrategyOpen: false,
            simulationCount: 100,
            simulationLength: 1000,

            blueforStrategy: {
                damageStrategy: "NO_SWAP",
                reseboStrategy: "ON_ALL",
                jamStrategy: "ON_ALL",
                repairStrategy: "ON_MOST_DAMAGE",

                damageStrategySelect: "RANDOM",
                reseboStrategySelect: "RANDOM",
                jamStrategySelect: "RANDOM",
                repairStrategySelect: "RANDOM",

                strategyPeriod: 30
            },

            opforStrategy: {
                damageStrategy: "NO_SWAP",
                reseboStrategy: "ON_ALL",
                jamStrategy: "ON_ALL",
                repairStrategy: "ON_MOST_DAMAGE",

                damageStrategySelect: "RANDOM",
                reseboStrategySelect: "RANDOM",
                jamStrategySelect: "RANDOM",
                repairStrategySelect: "RANDOM",

                strategyPeriod: 30
            },

            blueforShipList: [],
            opforShipList: [],

            simulationSeed: "NOVAC1"
        }

        this.setStrategyValue = this.setStrategyValue.bind(this);
        this.getStrategyValue = this.getStrategyValue.bind(this);
        this.addShipToList = this.addShipToList.bind(this);
        this.deleteShip = this.deleteShip.bind(this);
        this.addModuleToList = this.addModuleToList.bind(this);
        this.copyShip = this.copyShip.bind(this);
    }

    addShipToList(group, ship) {
        var state = this.state;
        state[group].push(ship)
        this.setState({state})
    }
    
    addModuleToList(group, index, module) {
        var state = this.state;
        state[group + "ShipList"][index]["shipMods"].push(module)
        this.setState(state);
    }

    copyShip(group, index) {
        var state = this.state;
        var list = this.state[group + "ShipList"];
        var ship = list[index]
        list.push(ship)
        state[group + "ShipList"] = list;
        this.setState(list);
    }

    deleteShip(group, index) {
        var state = this.state;
        var list = this.state[group + "ShipList"];
        list.splice(index, 1)
        state[group + "ShipList"] = list;
        this.setState(list);
    }

    setStrategyValue(e, targetValue, group) {
        var existingStrategy = this.state[group + "Strategy"];
        existingStrategy[targetValue] = e.target.value;
        var state = this.state
        state[group + "Strategy"] = existingStrategy;
        this.setState(state);
    }

    getStrategyValue(group, targetValue) {
        return this.state[group + "Strategy"][targetValue];
    }

    setSimulationSeed(e) {
        this.setState({simulationSeed: e});
    }

    setSimulationCount(e) {
        this.setState({simulationCount: e.target.value});
    }

    setSimulationLength(e) {
        this.setState({simulationLength: e.target.value});
    }

    toggleOpforStrategy() {
        this.setState({isOpforStrategyOpen: !this.state.isOpforStrategyOpen});
    }

    toggleBlueforStrategy() {
        this.setState({isBlueforStrategyOpen: !this.state.isBlueforStrategyOpen});
    }

    render() {

        var blueforDisplaySymbol = (this.state.isBlueforStrategyOpen ? "-" : "+");
        var blueforStrategy = (this.state.isBlueforStrategyOpen ?
        <div>
            <DropdownSelector menuOptions = {["SWAP", "NO_SWAP", "TRIG_SPOOL_SPLIT_WITH_REFOCUS"]} getStrategyValue = {this.getStrategyValue}
                group = "bluefor" title = {"Damage Strategy"} type = "damageStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_GUARDS", "ON_TRIG", "ON_ALL", "SPLIT_GUARD_TRIG"]} getStrategyValue = {this.getStrategyValue}
                group = "bluefor" title = {"Resebo Strategy"} type = "reseboStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_GUARDS", "ON_TRIG", "SPLIT_GUARD_TRIG", "ON_ALL"]} getStrategyValue = {this.getStrategyValue}
                group = "bluefor" title = {"Jam Strategy"} type = "jamStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_MOST_DAMAGE", "ON_LAST_DAMAGE"]} getStrategyValue = {this.getStrategyValue}
                group = "bluefor" title = {"Repair Strategy"} type = "repairStrategy" onSelect={this.setStrategyValue}/>
            <div className = "fleetBarMiniTitle">Strategy Period (in seconds)</div>
            <TextField 
                value = {this.state.blueforStrategy.strategyPeriod} 
                className = "simulatorControlTextField"
            />
        </div> : <div/>)

        var opforDisplaySymbol = (this.state.isOpforStrategyOpen ? "-" : "+");
        var opforStrategy = (this.state.isOpforStrategyOpen ?
            <div>
            <DropdownSelector menuOptions = {["SWAP", "NO_SWAP", "TRIG_SPOOL_SPLIT_WITH_REFOCUS"]} getStrategyValue = {this.getStrategyValue}
                group = "opfor" title = {"Damage Strategy"} type = "damageStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_GUARDS", "ON_TRIG", "ON_ALL", "SPLIT_GUARD_TRIG"]} getStrategyValue = {this.getStrategyValue}
                group = "opfor" title = {"Resebo Strategy"} type = "reseboStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_GUARDS", "ON_TRIG", "SPLIT_GUARD_TRIG", "ON_ALL"]} getStrategyValue = {this.getStrategyValue}
                group = "opfor" title = {"Jam Strategy"} type = "jamStrategy" onSelect={this.setStrategyValue}/>
            <DropdownSelector menuOptions = {["ON_MOST_DAMAGE", "ON_LAST_DAMAGE"]} getStrategyValue = {this.getStrategyValue}
                group = "opfor" title = {"Repair Strategy"} type = "repairStrategy" onSelect={this.setStrategyValue}/>
            <div className = "fleetBarMiniTitle">Strategy Period (in seconds)</div>
            <TextField 
                value = {this.state.opforStrategy.strategyPeriod} 
                className = "simulatorControlTextField"
            />
        </div> : <div/>)

        return (
            <div className = "container_main">
                <div className = "container_header">Simulator</div>
                    
                <div className = "sim_left">
                    <div className = "fleetStrategySelector">
                        <div className = "fleetBarTitle">Simulation Controls</div>
                        <div className = "fleetBarMiniTitle">Simulation Count</div>
                        <TextField 
                            value = {this.state.simulationCount} 
                            onChange = {(e) => {this.setSimulationCount(e)}} 
                            className = "simulatorControlTextField"
                        />
                        <div className = "fleetBarMiniTitle">Simulation Length (in seconds)</div>
                        <TextField 
                            value = {this.state.simulationLength} 
                            onChange = {(e) => {this.setSimulationLength(e)}} 
                            className = "simulatorControlTextField"
                        />
                        <div className = "fleetBarMiniTitle">Simulation Seed</div>
                        <TextField 
                            value = {this.state.simulationSeed} 
                            onChange = {(e) => {this.setSimulationSeed(e)}} 
                            className = "simulatorControlTextField"
                        />
                    </div>  
                    <div className = "fleetStrategySelector">
                        <div className = "fleetBarTitle" onClick={() => {this.toggleBlueforStrategy();}}>Bluefor Strategy [{blueforDisplaySymbol}]</div>
                        {blueforStrategy}
                    </div>
                    <div className = "fleetStrategySelector">
                        <div className = "fleetBarTitle" onClick={() => {this.toggleOpforStrategy();}}>Opfor Strategy [{opforDisplaySymbol}]</div>
                        {opforStrategy}
                    </div>
                </div>
                <div className = "sim_right">
                    <FleetController
                        fleetName = "bluefor"
                        shipList = {this.state.blueforShipList}
                        addShipToList = {this.addShipToList}
                        deleteShip = {this.deleteShip}
                        addModuleToList = {this.addModuleToList}
                        copyShip = {this.copyShip}
                    />
                    <br/><br/><br/>
                    <FleetController
                        fleetName = "opfor"
                        shipList = {this.state.opforShipList}
                        addShipToList = {this.addShipToList}
                        deleteShip = {this.deleteShip}
                        addModuleToList = {this.addModuleToList}
                        copyShip = {this.copyShip}
                    />
                </div>
            </div>
        )
    }
}

class FleetController extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    addShip() {
        this.props.addShipToList(this.props.fleetName + "ShipList", {"shipHull": this.state.shipHull, "shipMods": []});
    }

    handleChange(e) {
        this.setState({shipHull: e.target.value});
    }

    render() {

        var shipList = [];
        for (var ship in this.props.shipList) {
            var shipData = this.props.shipList[ship]
            shipList.push(<FleetShip 
                shipHull={shipData["shipHull"]} 
                shipMods={shipData["shipMods"]} 
                index={ship}
                deleteShip = {(index) => {this.props.deleteShip(this.props.fleetName, index)}}
                copyShip = {(index) => {this.props.copyShip(this.props.fleetName, index)}}
                addModuleToList = {(index, mod) => {this.props.addModuleToList(this.props.fleetName, index, mod)}}
            />)
        }

        return (
            <div className = "fleetControllerContainer">
                <div className = "fleetControllerTitle">{this.props.fleetName.toUpperCase()} Fleet</div>
                <div className = "shipAddController">
                    <div className = "shipAddControllerSelector">
                        <div className = "shipAddControllerTitle">Add Ship to Fleet</div>
                        <FormControl className = "simDropdown" fullWidth>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                                onChange={this.handleChange}
                                id={this.props.fleetName + "shipSelect"}
                            >
                                <MenuItem value={"Damnation"}>Damnation</MenuItem>
                                <MenuItem value={"Leshak"}>Leshak</MenuItem>
                                <MenuItem value={"Guardian"}>Guardian</MenuItem>
                                <MenuItem value={"Scorpion"}>Scorpion</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick = {() => {this.addShip()}} className = "shipAddButton">Add Ship</Button>
                    </div>
                </div>
                <div elevation={20} className = "fleetShipList">
                    {shipList}
                </div>
            </div>
        )
    }
}

class FleetShipModule extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <div className = "fleetShipTitle">
                {this.props.moduleParams["moduleName"]}
                <i className = "fa fa-trash"
                    onClick = {() => {this.props.deleteShip(this.props.index)}}
                    style = {{color: "white", paddingLeft: 2, marginTop: 3, marginLeft: 5}}
                />
            </div>
        </div>
    }
}

class FleetShip extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({moduleName: e.target.value});
    }

    render() {

        var moduleList = [];
        for (var moduleIndex in this.props.shipMods) {
            moduleList.push(
                <FleetShipModule moduleParams={this.props.shipMods[moduleIndex]} />
            )
        }

        return (
            <Paper className = "fleetShip">
                <div className = "fleetShipTitle">
                    [{this.props.index}] {this.props.shipHull}
                    <i className = "fa fa-copy"
                        onClick = {() => {this.props.copyShip(this.props.index)}}
                        style = {{color: "white", paddingLeft: 2, marginTop: 3, marginLeft: 5}}
                    />
                    <i className = "fa fa-trash"
                        onClick = {() => {this.props.deleteShip(this.props.index)}}
                        style = {{color: "white", paddingLeft: 2, marginTop: 3, marginLeft: 5}}
                    />
                    <div className = "shipAddControllerSelector">
                        <div className = "shipAddControllerTitle">Add Module to Ship</div>
                        <FormControl className = "simDropdown" fullWidth>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                                onChange={this.handleChange}
                                id={this.props.index + "moduleSelect"}
                            >
                                <MenuItem value={"Damage"}>Damage</MenuItem>
                                <MenuItem value={"Resebo"}>Resebo</MenuItem>
                                <MenuItem value={"Remote Repairer"}>Remote Repairer</MenuItem>
                                <MenuItem value={"Jam"}>Jam</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick ={() => {this.props.addModuleToList(this.props.index, {"moduleName": this.state.moduleName})}} className = "moduleAddButton">
                            Add Module
                        </Button>
                    </div>
                    <div className = "fleetShipModuleList">
                        {moduleList}
                    </div>
                </div>
            </Paper>
        )
    }
}

class DropdownSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dropdownState: "",
            dropdownSelectState: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleChange(e) {
        this.props.onSelect(e, this.props.type, this.props.group)
    }

    handleSelectChange(e) {
        this.props.onSelect(e, this.props.type + "Select", this.props.group)
    }

    render() {

        var menuItem = []
        for (var option in this.props.menuOptions) {
            var v = this.props.menuOptions[option];
            menuItem.push(<MenuItem value={v}>{v}</MenuItem>);
        }

        var value = this.props.getStrategyValue(this.props.group, this.props.type);
        var valueSelect = this.props.getStrategyValue(this.props.group, this.props.type + "Select");

        return(

            <div>
                <div className = "simulatorDropdownSubtitle">{this.props.title} & Selector</div>
                <div className = "simStrategyHolder">
                    <FormControl className = "simDropdown" fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                        <Select
                            id={this.props.title + this.props.group}
                            value={value}
                            onChange={this.handleChange}
                        >
                            {menuItem}
                        </Select>
                    </FormControl>
                    <FormControl className = "simDropdown" fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                        <Select
                            id={this.props.title + this.props.group + "select"}
                            value={valueSelect}
                            onChange={this.handleSelectChange}
                        >
                            <MenuItem value={"EVEN"}>EVEN</MenuItem>
                            <MenuItem value={"RANDOM"}>RANDOM</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        )
    }
}
