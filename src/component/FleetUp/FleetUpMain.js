// Loading the react components
import React from 'react';

import "../../css/fleetup.css";
import Cookies from 'universal-cookie';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import Countdown from 'react-countdown';
import FleetPilot from './FleetPilot';
import FleetPilotDisplay from './FleetPilotDisplay';

const baseURL = "http://vs-eve.com:5000/";



export default class FleetUpMain extends React.Component {

    constructor(props) {
        super(props);

        this.cookies = new Cookies();

        this.state = {
            "is_active": false,
            "activity_timeout": new Date("1/1/2020"),
            "is_auth": false,
            "is_loading": true,

            "fly": {}
        }

        let state_from_cookie = this.cookies.get("fleetup_state");
        let fly_from_cookie = this.cookies.get("fleetup_fly_state");
        let fly = {}

        if (fly_from_cookie != undefined) {
            fly = fly_from_cookie
        }

        if (state_from_cookie == null || state_from_cookie == "undefined") {
            this.state = {
                "is_active": false,
                "activity_timeout": new Date("1/1/2020"),
                "characters": [],
                "is_auth": false,
                "is_loading": true,

                "fly": fly
            }
        }
        else {
            this.state = {
                "is_active": state_from_cookie.is_active,
                "activity_timeout": state_from_cookie.activity_timeout,
                "characters": [],
                "is_auth": false,
                "is_loading": true,

                "fly": fly
            }
        }

        this.getAllCharacters();

        this.onUpdatePilotFlyStatus = this.onUpdatePilotFlyStatus.bind(this);
    }

    onClickActive() {
        let new_state = this.state;
        new_state.is_active = true;
        new_state.activity_timeout = new Date();
        new_state.activity_timeout.setMinutes(new_state.activity_timeout.getMinutes() + 30);
        this.setState(new_state);
        this.cookies.set("fleetup_state", new_state);
    }

    onClickInactive() {
        let new_state = this.state;
        new_state.is_active = false;
        new_state.activity_timeout = new Date("1/1/2020");
        this.setState(new_state);
        this.cookies.set("fleetup_state", new_state);
    }

    onUpdatePilotFlyStatus(character_id, new_status) {
        console.log(character_id, new_status);

        let new_state = this.state;
        let current_fly = this.state.fly;
        current_fly[character_id] = new_status;

        this.setState({"fly": current_fly});
        this.cookies.set("fleetup_fly_state", current_fly);        
    }

    getAllCharacters() {
        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        fetch(baseURL+"/fleetup/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 0) {
                return;
            }
            return response.json();
        }).then(function(myJson) {
            // Okay lets get the data value
            ref.setState({"is_loading": false});
            console.log(myJson, myJson["code"]);
            if (myJson["code"] != 200) {
                console.log("Failed auth");
                ref.setState({"is_auth": false, "is_loading": false})
            }
            else {
                let fly = {}
                myJson["data"]["pilots"].forEach((character) => {
                    if (ref.state.fly[character["character_id"]] === undefined)
                        fly[character["character_id"]] = "offline";
                    else {
                        fly[character["character_id"]] = ref.state.fly[character["character_id"]];
                    }
                });

                ref.setState({"is_auth": true, "fly": fly, characters: myJson["data"]["pilots"], "is_loading": false})
            }
        });
    }

    render() {

        if (this.state.is_loading && this.props.character_id != undefined) {
            return (
                <div>
                    <div className="fleetUpContainer">
                        <div className="fleetupTitle">Loading...</div>
                        <div className="fleetupInfo">If you have a lot of characters this may take some time.</div>
                        </div>
                    </div>
            )
        }

        let login = <img aria-haspopup="true" className={"eveFleetupLogin"} src={require("../../assets/img/eve-sso-login-black-large.png")} onClick={() => { this.props.loginSSO() }} />;
        if (this.props.character_id != undefined) {
            login = null;
        }

        else {
            return (
                <div>
                    <div className="fleetUpContainer">
                        <div className="fleetupTitle">No Vacancies - Fleet</div>
                            <div className="fleetupLoginButtonContainer">
                                    {login}
                                </div>
                        </div>
                    </div>
            );
        }

        if (this.state.is_auth == false) {
            return (<div>
                    <div className="fleetUpContainer">
                        <div className="fleetupTitle">Not authenticated, contact an administrator</div>
                        </div>
                    </div>);
        }

        let active_status = (this.state.is_active ? "Active" : "Inactive")

        let button = <Button onClick={() => {this.onClickActive();}} variant="contained" className="fleetupActivityStatusInactive">Go Active</Button>
        let activity_timeout_display = "Inactivity Timeout: You are currently inactive";
        let inactive_button = <div/>//<Button variant="contained" className="fleetupActivityLeaveFleetButton">Go Inactive</Button>

        if (this.state.is_active) {
            button = <Button onClick={() => {this.onClickActive();}} variant="contained" className="fleetupActivityStatus">Extend Timer</Button>
            
            

            activity_timeout_display = <Countdown onComplete={() => this.onClickInactive()} date={this.state.activity_timeout} />
            inactive_button = <Button onClick={() => {this.onClickInactive();}} variant="contained" className="fleetupActivityLeaveFleetButton">Set As Inactive</Button>
        }

        let willFly = [];
        let canFly = [];
        let wontFly = [];
            for (let i = 0; i < this.state.characters.length; i++) {
                let character_id = this.state.characters[i]['character_id']
                let pilot_object = <FleetPilot onUpdatePilotFlyStatus={this.onUpdatePilotFlyStatus} character = {this.state.characters[i]} fly={this.state.fly[character_id]}/>;

                if (this.state.fly[character_id] == "main") {
                    willFly.push(pilot_object);
                }
                else if (this.state.fly[character_id] == "secondary") {
                    canFly.push(pilot_object);
                }
                else {
                    wontFly.push(pilot_object);
                }
            }

        let pilotSelector = [];
        pilotSelector.push(<FleetPilotDisplay isHeader={1} />)
        pilotSelector.push(<FleetPilotDisplay isHeader={2} />)
        for (let i = 0; i < this.state.characters.length; i++) {
            let character_id = this.state.characters[i]['character_id']
            let pilot_object = <FleetPilotDisplay isHeader={0} character = {this.state.characters[i]} fly={this.state.fly[character_id]}/>;
            pilotSelector.push(pilot_object);
        }

        return (
            <div>
                <div className="fleetUpContainer">
                    <div className="fleetupTitle">No Vacancies - Fleet</div>
                    <div className="fleetupActivtyContainer">
                        <Paper elevation={20} className="fleetupActivityPaper">
                            <div className="fleetupActivityTitle">
                                Your current status:
                            </div>
                            <div className="fleetupActivityStatusTitle">
                                {active_status}
                            </div>
                            
                            <div className="fleetupActivityTimer">
                                {activity_timeout_display}
                            </div>

                            {button}
                            {inactive_button}

                            <div className="fleetupActivityButtonInfo">Click the button to reset your activity timer. Automatically times out. Click go inactive to become inactive.</div>
                        </Paper>
                    </div>
                    <div className="fleetupTitle">Fleet Management</div>
                    <div className="fleetupPilotContainer">
                        <Paper elevation={20} className="fleetActivityPilotPaper">
                        <div className="fleetUpPilotTypeBigTitle">My Pilots</div>
                            <div className="fleetUpPilotTypeTitle">Will Fly</div>
                            <div className="fleetUpPilotTypeSubTitle">(I can actively undock this pilot)</div>
                            {willFly}
                            <div className="fleetUpPilotTypeTitle">Can Fly</div>
                            <div className="fleetUpPilotTypeSubTitle">(I can actively undock this pilot but would prefer not to)</div>
                            {canFly}
                            <div className="fleetUpPilotTypeTitle">Won't Fly</div>
                            <div className="fleetUpPilotTypeSubTitle">(I can not undock this pilot)</div>
                            {wontFly}
                        </Paper>

                        <Paper elevation={20} className="fleetActivityPilotPaper">
                            <div className="fleetUpPilotTypeBigTitle">Fleet Management</div>
                            {pilotSelector}
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}