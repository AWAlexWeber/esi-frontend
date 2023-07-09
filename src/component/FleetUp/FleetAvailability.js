// Loading the react components
import React from 'react';

import "../../css/fleetup.css";

import Badge from '@material-ui/core/Badge';

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

export default class FleetAvailability extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let display_badges = []
        exampleFleetConfiguration["shipReqs"].forEach((config) => {
            if (Math.floor(Math.random() * 10) < 5)
                return;

            display_badges.push(<div className="fleetAvailBadgeContainer">
                    <Badge className="fleetAvailBadgeImageContainer" color="primary" >
                        <img className="fleetAvailBadgeImage" src={"https://images.evetech.net/types/" + config["shipId"] + "/icon"}/>
                    </Badge>
                </div>);
        });

        return (
            <div className = "fleetAvailContainer">
                {display_badges}
            </div>
        );
    }
}