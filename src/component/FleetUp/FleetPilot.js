// Loading the react components
import React from 'react';

import "../../css/fleetup.css";

import FleetAvailability from './FleetAvailability';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class FleetPilot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className = "fleetPilotContainer">
                    <div className = "fleetPilotPortraitEntry">
                        <img className = "fleetPilotPortrait" src={"https://images.evetech.net/characters/" + this.props.character['character_id'] + "/portrait"} />
                    </div>
                    <div className = "fleetPilotRowEntryLong">
                        {this.props.character['name']}
                    </div>
                    <div className = "fleetPilotRowEntryLong">
                        <FleetAvailability />
                    </div>
                    <div className = "fleetPilotRowEntryLongRadio">
                        <RadioGroup row className = "fleetPilotRadioControl" value={this.props.fly} onChange={(e) => 
                                {this.props.onUpdatePilotFlyStatus(this.props.character['character_id'], e.target.value)}}>

                            <FormControlLabel className = "fleetPilotWillFly" value="main" control={<Radio />} label="Will Fly" />
                            <FormControlLabel className = "fleetPilotCanFly" value="secondary" control={<Radio />} label="Can Fly" />
                            <FormControlLabel className = "fleetPilotWontFly" value="offline" control={<Radio />} label="N/A" />
                        </RadioGroup>
                    </div>
                </div>
    }
}