// Loading the react components
import React from 'react';

import "../../css/fleetup.css";

import FleetSelector from './FleetSelector';

export default class FleetPilotDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className = "fleetPilotContainer">
            <div className = "fleetPilotRowEntryLong">
                {this.props.isHeader === 0 ? this.props.character['name'] : this.props.isHeader === 2 ? "Count" : ""}
            </div>
            <div className = "fleetPilotRowEntryLong">
                <FleetSelector isHeader = {this.props.isHeader}/>
            </div>
        </div>);
    }
}