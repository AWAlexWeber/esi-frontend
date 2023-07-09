// Loading the react components
import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Graphs from "./Graphs";

import "../../css/simulator.css";

const moduleParams = {
    "damage": {
        "moduleType": "damage",
        "moduleParameters": {"damageArray": "0,",
        "cycleTime": 0}
    },
    "resebo": {
        "moduleType": "resebo",
        "moduleParameters": {"sensorStrengthAsPercentage": "0",
        "cycleTime": 0}
    },
    "jam": {
        "moduleType": "jam",
        "moduleParameters": {"primaryType": "RADAR",
        "primaryStrength": 0,
        "secondaryStrength": 0,
        "cycleTime": 0}
    },
    "remoteRepair": {
        "moduleType": "remoterepair",
        "moduleParameters": {"repairAmount": 0,
        "cycleTime": 0}
    }
}

const customShipData = {
    "shipHull": "Custom",
    "shipCount": "1",
    "rawShipHealth": 1,
    "shipModuleList": []
}

const leshakData = {
    "shipHull": "Leshak",
    "shipCount": "1",
    "rawShipHealth": 50000,
    "sensorStrength": 62,
    "sensorClass": "RADAR",
    "shipModuleList": [
        {"moduleType": "damage", "moduleParameters": {"cycleTime": 4, "damageArray": 
        "2800,2945,3090,3235,3380,3525,3670,3815,3960,4105,4250,4395,4540,4685,4830,4975,5120,5265,5410,5555,5700,5845,5990,6135,6280,6425,6570,6715,6860,7005"
        }}
    ]
}

const damnationData = {
    "shipHull": "Damnation",
    "shipCount": "1",
    "rawShipHealth": 25000,
    "sensorStrength": 62,
    "sensorClass": "RADAR",
    "shipModuleList": [
        {"moduleType": "damage", "moduleParameters": {"cycleTime": 6, "damageArray": "650"}},
        {"moduleType": "resebo", "moduleParameters": {"cycleTime": 6, "sensorStrengthAsPercentage": "1.30", "cycleTime": "6"}},
        {"moduleType": "resebo", "moduleParameters": {"cycleTime": 6, "sensorStrengthAsPercentage": "1.30", "cycleTime": "6"}}
    ]
}

const scorpionData = {
    "shipHull": "Scorpion",
    "shipCount": "1",
    "rawShipHealth": 40000,
    "sensorStrength": 62,
    "sensorClass": "GRAV",
    "shipModuleList": [
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}},
        {"moduleType": "jam", "moduleParameters": {"cycleTime": 20, "primaryType": "RADAR", "primaryStrength": "18", "secondaryStrength": "2"}}
    ]
}

const guardianData = {
    "shipHull": "Guardian",
    "shipCount": "1",
    "rawShipHealth": 20000,
    "sensorStrength": 112,
    "sensorClass": "RADAR",
    "shipModuleList": [
        {"moduleType": "remoteRepair", "moduleParameters": {"repairAmount": "408", "cycleTime": "6"}},
        {"moduleType": "remoteRepair", "moduleParameters": {"repairAmount": "408", "cycleTime": "6"}},
        {"moduleType": "remoteRepair", "moduleParameters": {"repairAmount": "408", "cycleTime": "6"}},
        {"moduleType": "remoteRepair", "moduleParameters": {"repairAmount": "408", "cycleTime": "6"}},
        {"moduleType": "remoteRepair", "moduleParameters": {"repairAmount": "408", "cycleTime": "6"}}
    ]
}

const shipData = {
    "Custom": customShipData,
    "Leshak": leshakData,
    "Damnation": damnationData,
    "Scorpion": scorpionData,
    "Guardian": guardianData
}

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

            simulationSeed: "NOVAC1",
            simulationDisplayTab: 0,

            // View related stuff
            viewToken: "",
            isSendingRequests: false,
            simulationStatus: "NO_SIMULATION",
            lastSimulationRequestTime: null,
            windowTimeout: null,
            simulationResponseData: null,
            simulationResultsRuns: 0
        }

        this.setStrategyValue = this.setStrategyValue.bind(this);
        this.getStrategyValue = this.getStrategyValue.bind(this);
        this.addShipToList = this.addShipToList.bind(this);
        this.deleteShip = this.deleteShip.bind(this);
        this.addModuleToList = this.addModuleToList.bind(this);
        this.copyShip = this.copyShip.bind(this);
        this.deleteModule = this.deleteModule.bind(this);
        this.setShipCount = this.setShipCount.bind(this);
        this.updateModuleValue = this.updateModuleValue.bind(this);
        this.setDisplayTab = this.setDisplayTab.bind(this);
        this.setViewToken = this.setViewToken.bind(this);
        this.getSimulationData = this.getSimulationData.bind(this);
        this.getSimulationDataAndStartRequests = this.getSimulationDataAndStartRequests.bind(this);
        this.setShipParameterValue = this.setShipParameterValue.bind(this);
    }

    setViewToken(token) {
        this.setState({viewToken: token});
    }

    formatStrategy(strategy) {
        return {
            "fleetDamageStrategy": {
                "strategy": strategy["damageStrategy"],
                "select": strategy["damageStrategySelect"]
            },
            "fleetReseboStrategy": {
                "strategy": strategy["reseboStrategy"],
                "select": strategy["reseboStrategySelect"]
            },
            "fleetRepairStrategy": {
                "strategy": strategy["repairStrategy"],
                "select": strategy["repairStrategySelect"]

            },
            "fleetJamTargetStrategy": {
                "strategy": strategy["jamStrategy"],
                "select": strategy["jamStrategySelect"]

            },
            "strategyPeriod": strategy["strategyPeriod"]
        }
    }

    formatFleet(fleet) {
        return {
            "fleetShipList": fleet
        }
    }

    export() {

        var requestData = {
            simulationCount: this.state.simulationCount,
            simulationLength: this.state.simulationLength,
            simulatorSeed: this.state.simulationSeed,

            blueforStrategy: this.formatStrategy(this.state.blueforStrategy),
            opforStrategy: this.formatStrategy(this.state.opforStrategy),

            blueforFleet: this.formatFleet(this.state.blueforShipList),
            opforFleet: this.formatFleet(this.state.opforShipList)
        };

        return requestData;
    }

    addShipToList(group, ship) {
        var state = this.state;
        state[group].push(ship)
        this.setState({state})
    }
    
    addModuleToList(group, index, module) {
        var state = this.state;
        state[group + "ShipList"][index]["shipModuleList"].push(module)
        this.setState(state);
    }

    copyShip(group, index) {
        var state = this.state;
        var list = this.state[group + "ShipList"];
        var ship = list[index]
        var copy = JSON.parse(JSON.stringify(ship));
        list.push(copy)
        state[group + "ShipList"] = list;
        this.setState(list);
    }

    setShipCount(group, index, count) {
        var state = this.state;
        var list = this.state[group + "ShipList"];
        var ship = list[index];
        ship["shipCount"] = count;
        list[index] = ship;
        state[group + "ShipList"] = list;
        this.setState(list);
    }

    setShipParameterValue(group, index, targetValue, value) {
        var state = this.state;
        var list = this.state[group + "ShipList"];
        var ship = list[index];
        ship[targetValue] = value;
        list[index] = ship;
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

    deleteModule(fleet, shipIndex, moduleIndex) {
        var state = this.state;
        var list = this.state[fleet + "ShipList"];
        var ship = list[shipIndex]
        ship["shipModuleList"].splice(moduleIndex, 1);
        state[fleet + "ShipList"] = list;
        this.setState(list);
    }

    updateModuleValue(fleet, shipIndex, moduleIndex, moduleValue, moduleParam) {
        console.log(fleet, shipIndex, moduleIndex, moduleValue, moduleParam);
        var state = this.state;
        var list = this.state[fleet + "ShipList"];
        var ship = list[shipIndex]
        var module = ship["shipModuleList"][moduleIndex];
        module["moduleParameters"][moduleParam] = moduleValue;
        ship["shipModuleList"][moduleIndex] = module;
        list[shipIndex] = ship;
        state[fleet + "ShipList"] = list;
        this.setState(state);
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

    setDisplayTab(newDisplayTab) {
        this.setState({simulationDisplayTab: newDisplayTab});
    };

    // API Call functions
    generateSimulation() {
        if (this.state.blueforShipList.length == 0 || this.state.opforShipList.length == 0) {
            alert("Fleets must have at least one ship each");
            return;
        }

        this.setState({
            simulationDisplayTab: 1, 
            simulationResponseData: null,
            simulationResultsRuns: 0,
            viewToken: ""
        });
        
        var ref = this;

        window.setTimeout(function() {
            ref.sendSimulationRequest();
            ref.setState({isSendingRequests: true});
            ref.getSimulationData();
        }, 1000);
        
    }

    sendSimulationRequest() {
        var ref = this;
        
        fetch('http://143.244.186.177:8000/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.export())
        })
        .then(response => response.json())
        .then(data => {
            ref.setState({
                viewToken: data["data"]["simulationToken"],
                simulationStatus: data["data"]["simulationStatus"]
            })
        });
    }

    getSimulationDataAndStartRequests() {
        window.clearTimeout(this.state.windowTimeout);
        this.setState({isSendingRequests: true, simulationResponseData: null});
        var ref = this;
        window.setTimeout(function() {
            ref.getSimulationData();
        }, 1000);
    }

    getSimulationData() {
        var ref = this;
        
        fetch('http://143.244.186.177:8000/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({simulatorToken: this.state.viewToken})
        })
        .then(response => response.json())
        .then(data => {
            ref.setState({
                simulationStatus: data["data"]["simulationStatus"],
                simulationResultsRuns: data["data"]["simulationRuns"]
            });

            if (data["data"]["simulationStatus"] == "FINISHED") {
                this.setState({isSendingRequests: false, simulationResponseData: JSON.parse(data["data"]["simulationData"])})
            }
        });

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.setState({lastSimulationRequestTime: time});

        if (this.state.isSendingRequests == true) {
            window.clearTimeout(this.state.windowTimeout);
            var timeout = window.setTimeout(function() {
                ref.getSimulationData();
            }, 10000);
            this.setState({windowTimeout: timeout});
        }
    }

    render() {

        var blueforDisplaySymbol = (this.state.isBlueforStrategyOpen ? "-" : "+");
        var blueforStrategy = (this.state.isBlueforStrategyOpen ?
        <div>
            <DropdownSelector menuOptions = {["SWAP", "NO_SWAP", "TRIG_SPOOL_SPLIT"]} getStrategyValue = {this.getStrategyValue}
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
            <DropdownSelector menuOptions = {["SWAP", "NO_SWAP", "TRIG_SPOOL_SPLIT"]} getStrategyValue = {this.getStrategyValue}
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

        var sim_left = 
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
                    onChange = {(e) => {this.setSimulationSeed(e.target.value)}} 
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
        </div>;

        var sim_right = 
            <div className = "sim_right">
                <FleetController
                    fleetName = "bluefor"
                    shipList = {this.state.blueforShipList}
                    addShipToList = {this.addShipToList}
                    deleteShip = {this.deleteShip}
                    addModuleToList = {this.addModuleToList}
                    copyShip = {this.copyShip}
                    deleteModule = {this.deleteModule}
                    setShipCount = {this.setShipCount}
                    updateModuleValue = {this.updateModuleValue}
                    setShipParameterValue = {this.setShipParameterValue}
                />
                <br/><br/><br/>
                <FleetController
                    fleetName = "opfor"
                    shipList = {this.state.opforShipList}
                    addShipToList = {this.addShipToList}
                    deleteShip = {this.deleteShip}
                    addModuleToList = {this.addModuleToList}
                    copyShip = {this.copyShip}
                    deleteModule = {this.deleteModule}
                    setShipCount = {this.setShipCount}
                    updateModuleValue = {this.updateModuleValue}
                    setShipParameterValue = {this.setShipParameterValue}
                />
            </div>;

        var sim_button = <Button className = "simulationResultsButton" onClick = {() => {this.generateSimulation();}}>
            Generate Simulation & Go to View
        </Button>

        if (this.state.simulationDisplayTab == 1) {
            sim_left = <SimulatorResultController
                viewToken = {this.state.viewToken}
                setViewToken = {this.setViewToken}
                isSendingRequests = {this.state.isSendingRequests}
                simulationStatus = {this.state.simulationStatus}
                lastSimulationRequestTime = {this.state.lastSimulationRequestTime}
                simulationResultsRuns = {this.state.simulationResultsRuns}

                getSimulationDataAndStartRequests = {this.getSimulationDataAndStartRequests}
            />
            sim_right = <Graphs results = {this.state.simulationResponseData} />;
            sim_button = null;
        }
        else if (this.state.simulationDisplayTab == 2) {
            sim_left = null;
            sim_right = null;
            sim_button = null;
        }

        return (
            <div className = "container_main">
                <div className = "container_header">Simulator</div>
                <div className = "simulatorTabController">
                    <Tabs value={this.state.simulationDisplayTab} centered>
                        <Tab onClick={() => {this.setDisplayTab(0);}} className = "simulatorTab" label="Create Simulation" />
                        <Tab onClick={() => {this.setDisplayTab(1);}} className = "simulatorTab" label="View Simulation" />
                        <Tab onClick={() => {this.setDisplayTab(2);}} className = "simulatorTab" label="Previous Simulations" />
                    </Tabs>
                </div>
                <div className = "simulatorInternalContainer">
                    {sim_left}
                    {sim_right}
                    {sim_button}
                </div>
            </div>
        )
    }
}

class SimulatorResultController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var loader = null;
        if (this.props.isSendingRequests) {
            loader = 
            <div className = "loaderContainer">
                <div className = "simulationLoader" />
                Last Request: {this.props.lastSimulationRequestTime}
                <br />
                Current Status: <div className = "simulationStatus">{this.props.simulationStatus}</div>
                ({this.props.simulationResultsRuns} runs completed)
            </div>
        }

        return (
            <div className = "simulatorResultControllerContainer">
                <div className = "simulatorResultsTitle">Simulator Results Controller</div>
                <div className = "simulatorResultsSubtitle">Simulation Token:</div>
                <TextField value = {this.props.viewToken} onChange = {(e) => {this.props.setViewToken(e.target.value);}} className = "simulationTokenTextField"/>
                <Button className = "simulationResultsButton" onClick = {() => {this.props.getSimulationDataAndStartRequests();}}>Get Results</Button>
                {loader}
            </div>
        )
    }
}

class FleetController extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            displayOn: true
        }
    }

    addShip() {
        if (shipData[this.state.shipHull] != undefined) {
            var ship = shipData[this.state.shipHull];
            var copy = JSON.parse(JSON.stringify(ship));
            this.props.addShipToList(this.props.fleetName + "ShipList", copy);
        }
        else {
            this.props.addShipToList(this.props.fleetName + "ShipList", {"shipCount": 1, "shipHull": this.state.shipHull, "shipModuleList": []});
        }
    }

    handleChange(e) {
        this.setState({shipHull: e.target.value});
    }

    toggleDisplay() {
        this.setState({displayOn: !this.state.displayOn});
    }

    render() {

        var fleetComposition = {}

        var shipList = [];
        for (var ship in this.props.shipList) {
            var shipData = this.props.shipList[ship]

            var shipHull = shipData["shipHull"];
            if (fleetComposition[shipHull] == undefined) {
                fleetComposition[shipHull] = parseInt(shipData["shipCount"]);
            }
            else {
                fleetComposition[shipHull] = fleetComposition[shipHull] + parseInt(shipData["shipCount"]);
            }

            shipList.push(<FleetShip 
                shipHull={shipData["shipHull"]} 
                shipMods={shipData["shipModuleList"]} 
                shipCount={shipData["shipCount"]}
                shipData={shipData}
                index={ship}
                deleteShip = {(index) => {this.props.deleteShip(this.props.fleetName, index)}}
                copyShip = {(index) => {this.props.copyShip(this.props.fleetName, index)}}
                addModuleToList = {(index, mod) => {this.props.addModuleToList(this.props.fleetName, index, mod)}}
                deleteModule = {(shipIndex, moduleIndex) => {console.log(this.props); this.props.deleteModule(this.props.fleetName, shipIndex, moduleIndex)}}
                setShipCount = {(shipIndex, count) => {this.props.setShipCount(this.props.fleetName, shipIndex, count)}}
                setShipParameterValue = {(shipIndex, value, targetValue) => {this.props.setShipParameterValue(this.props.fleetName, shipIndex, value, targetValue);}}
                updateModuleValue = {(shipIndex, moduleIndex, moduleValue, moduleParam) => {this.props.updateModuleValue(this.props.fleetName, shipIndex, moduleIndex, moduleValue, moduleParam);}}
            />)
        }

        var shipAddController = null;
        var shipListController = null;
        var displayToggleVar = "+";

        var shipCompositionInfo = [];

        for (const [key, value] of Object.entries(fleetComposition)) {
            shipCompositionInfo.push(<div className = "fleetControllerCompositionCount">{value} &nbsp;</div>)
            shipCompositionInfo.push(<div className = "fleetControllerCompositionTitle">{key} &nbsp;&nbsp;</div>)
        }

        if (this.state.displayOn == true) {
            displayToggleVar = "-";
            shipAddController = 
            <div className = "shipAddController">
                <div className = "shipAddControllerSelector">
                    <div className = "shipAddControllerTitle">Add Ship to Fleet</div>
                    <FormControl className = "simDropdown" fullWidth>
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <Select
                            onChange={this.handleChange}
                            id={this.props.fleetName + "shipSelect"}
                        >
                            <MenuItem value={"Custom"}>Custom</MenuItem>
                            <MenuItem value={"Damnation"}>Damnation</MenuItem>
                            <MenuItem value={"Leshak"}>Leshak</MenuItem>
                            <MenuItem value={"Guardian"}>Guardian</MenuItem>
                            <MenuItem value={"Scorpion"}>Scorpion</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick = {() => {this.addShip()}} className = "shipAddButton">Add Ship</Button>
                </div>
            </div>
            shipListController = <div elevation={20} className = "fleetShipList">
                {shipList}
            </div>
        }

        return (
            <div className = "fleetControllerContainer">
                <div onClick = {() => {this.toggleDisplay()}} className = "fleetControllerTitle">[{displayToggleVar}] {this.props.fleetName.toUpperCase()} Fleet</div>
                <div className = "fleetControllerComposition">
                    <div className="fleetControllerCompositionHeader">Fleet Comp: &nbsp;&nbsp;</div>
                    {shipCompositionInfo}
                </div>
                {shipAddController}
                {shipListController}
            </div>
        )
    }
}

class FleetShipModule extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, p) {
        this.props.updateModuleValue(this.props.shipIndex, this.props.moduleIndex, e.target.value, p);
    }

    render() {

        var moduleParamDisplay = [];
        for (var p in this.props.moduleParams) {
            if (p == "moduleName") {
                continue;
            }

            moduleParamDisplay.push(
                <div className = "moduleListTitle">{p}: </div>
            );
            let x = p;
            moduleParamDisplay.push(
                <TextField onChange = {(e) => {this.handleChange(e, x);}} className = "moduleListParamText" value = {this.props.moduleParams[p]} />
            );
        }

        return <div className = "fleetShipModuleContainer">
            <div className = "fleetShipTitle">
                {this.props.moduleParams["moduleName"]}
            </div>
            <div className = "fleetModulePropertyList">
                {moduleParamDisplay}
                <i className = "fa fa-trash"
                    onClick = {() => {this.props.deleteModule(this.props.shipIndex, this.props.moduleIndex)}}
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
        this.addModule = this.addModule.bind(this);

        this.state = {
            "moduleName": ""
        };
    }

    handleChange(e) {
        this.setState({moduleName: e.target.value});
    }

    setShipCount(e) {
        console.log(e);
        this.props.setShipCount(this.props.index, e.target.value);
    }

    setShipParameterValue(value, e) {
        this.props.setShipParameterValue(this.props.index, value, e.target.value);
    }

    addModule() {
        var moduleStats = moduleParams[this.state.moduleName];
        var copy = JSON.parse(JSON.stringify(moduleStats))
        this.props.addModuleToList(this.props.index, copy)
    }

    render() {

        var moduleList = [];
        for (var moduleIndex in this.props.shipMods) {
            moduleList.push(
                <FleetShipModule 
                    shipIndex = {this.props.index}
                    moduleIndex = {moduleIndex}
                    deleteModule = {this.props.deleteModule}
                    moduleParams={this.props.shipMods[moduleIndex]["moduleParameters"]}
                    updateModuleValue={this.props.updateModuleValue}
                />
            )
        }

        return (
            <Paper className = "fleetShip">
                <div className = "fleetShipTitle">
                   [-] {this.props.shipHull} #{this.props.index}
                    <i className = "fa fa-copy"
                        onClick = {() => {this.props.copyShip(this.props.index)}}
                        style = {{color: "white", paddingLeft: 2, marginTop: 3, marginLeft: 5}}
                    />
                    <i className = "fa fa-trash"
                        onClick = {() => {this.props.deleteShip(this.props.index)}}
                        style = {{color: "white", paddingLeft: 2, marginTop: 3, marginLeft: 5}}
                    />
                    <div className = "shipTypeCount">
                        Copies of this ship: <TextField onChange = {(e) => {this.setShipCount(e);}} className = "shipTypeCountInput" value = {this.props.shipCount}/>
                    </div>
                    <div className = "shipParametersHolder">
                        <div className = "shipParameterTextFieldClassLabel">Ship Sensor Strength</div>
                        <TextField 
                            onChange = {(e) => {this.setShipParameterValue("sensorStrength", e);}} 
                            className = "shipParameterTextFieldClass" 
                            value = {this.props.shipData['sensorStrength']}
                        />
                        <div className = "shipParameterTextFieldClassLabel">Ship Sensor Class</div>
                        <TextField 
                            onChange = {(e) => {this.setShipParameterValue("sensorClass", e);}} 
                            className = "shipParameterTextFieldClass" 
                            value = {this.props.shipData['sensorClass']}
                        />
                        <div className = "shipParameterTextFieldClassLabel">Raw Ship Health</div>
                        <TextField
                            onChange = {(e) => {this.setShipParameterValue("rawShipHealth", e);}}
                            className = "shipParameterTextFieldClass"
                            value = {this.props.shipData['rawShipHealth']}
                        />
                    </div>
                    <div className = "shipAddControllerSelector">
                        <div className = "shipAddControllerTitle">Add Module to Ship</div>
                    
                        <FormControl className = "simDropdown" fullWidth>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                                onChange={this.handleChange}
                                id={this.props.index + "moduleSelect"}
                            >
                                <MenuItem value={"damage"}>Damage</MenuItem>
                                <MenuItem value={"resebo"}>Resebo</MenuItem>
                                <MenuItem value={"remoteRepair"}>Remote Rep</MenuItem>
                                <MenuItem value={"jam"}>Jam</MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick ={() => {this.addModule()}} 
                            className = "moduleAddButton">
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
                            <MenuItem value={"IGNORE_GUARDS"}>IGNORE_GUARDS</MenuItem>
                            <MenuItem value={"IGNORE_SCORPS"}>IGNORE_SCORPS</MenuItem>
                            <MenuItem value={"IGNORE_JAMS_AND_GUARDS"}>IGNORE_JAMS_AND_GUARDS</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        )
    }
}
