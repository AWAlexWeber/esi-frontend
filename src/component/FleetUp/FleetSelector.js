// Loading the react components
import React from 'react';

import "../../css/fleetup.css";

import Checkbox from '@material-ui/core/Checkbox';

const exampleFleetConfiguration = {
    "shipReqs": [
        {"shipName": "Bhaalgorn", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 17920},
        {"shipName": "Damnation", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 22474},
        {"shipName": "Drekavac", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 49711},
        {"shipName": "Leshak", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 47271},
        {"shipName": "Guardian", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 11987},
        {"shipName": "Devoter", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 12017},
        {"shipName": "Nestor", "podReq": ["pods"], "skillReq": ["skills"], "shipId": 33472}
    ]
}

export default class FleetSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.isHeader == 1) {
            let display_badges = []
            exampleFleetConfiguration["shipReqs"].forEach((config) => {
                display_badges.push(<img className="fleetAvailBadgeImageHeader" src={"https://images.evetech.net/types/" + config["shipId"] + "/icon"}/>);
            });

            return (
                <div className = "fleetAvailContainer">
                    {display_badges}
                </div>
            );
        }

        else if (this.props.isHeader == 2) {
            let display_badges = []
            exampleFleetConfiguration["shipReqs"].forEach((config) => {
                display_badges.push(<div className="fleetAvailBadgeContainerCount">{Math.floor(Math.random() * 5) + 2}</div>);
            });

            return (
                <div className = "fleetAvailContainer">
                    {display_badges}
                </div>
            );
        }

        let display_badges = []
        exampleFleetConfiguration["shipReqs"].forEach((config) => {
            display_badges.push(<div className="fleetAvailBadgeContainer"><Checkbox /></div>);
        });

        return (
            <div className = "fleetAvailContainer">
                {display_badges}
            </div>
        );
    }
}