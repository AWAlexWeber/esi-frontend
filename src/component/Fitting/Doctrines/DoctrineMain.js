// Loading the react components
import React from 'react';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

// CSS
import "../../../css/base.css"
import "../../../css/Doctrine/doctrine.css"

class DoctrineBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        // Adding stars
        let stars = [];
        for (let i = 0; i < this.props.priority; i++) {
            stars.push(<i class="fa doctrine-star fa-star" aria-hidden="true"></i>);
        }

        var doctrineList = [];
        for (var idx in this.props.data) {
            var data = this.props.data[idx];
            doctrineList.push(
                <DoctrineListShip shipID = {data[0]} stars = {data[1]} shipTitle = {data[2]} info = {ipsum}/>
            )
        }

        return (
            <Paper elevation={20} className = "doctrine_box">
                <div className = "doctrine_box_title">{this.props.doctrine_title}</div>
                <div className = "doctrine_box_view_button" onClick = {() => {this.props.pushLocation("doctrine_info/2");}}>View Doctrine</div>
                <div className = "doctrine_box_info_container">
                    <div className = "doctrine_box_info left">Created by: &nbsp;<div className = "doctrine_box_info_inner right">{this.props.creator}</div></div>
                    <div className = "doctrine_box_info right">Total Fits:&nbsp;<div className = "doctrine_box_info_inner right">{this.props.total_fits}</div></div>
                </div>

                &nbsp;
                <br />

                

                <div className = "doctrine_container">
                    {doctrineList}
                </div>

                <div className = "doctrine_box_info_container">
                    <div className = "doctrine_box_info center">Priority Rank:</div>
                    <div className = "star_container center">{stars}</div>
                </div>
            </Paper>
        )
    }
}

class DoctrineListShip extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        // Adding stars
        let stars = [];
        for (let i = 0; i < this.props.stars; i++) {
            stars.push(<i class="fa doctrine-star-small fa-star" aria-hidden="true"></i>);
        }

        return (
            <div className = "doctrine_list_ship">
                <div className = "doctrine_list_ship_left">
                    <img className = "doctrine_ship_image" src = {"https://image.testeveonline.com/Render/" + this.props.shipID + "_512.png"} />
                    <br />
                    <div className = "doctrine_stars">{stars}</div>
                </div>

                <div className = "doctrine_list_ship_right">
                    <div className = "doctrine_list_ship_title">{this.props.shipTitle}</div> 
                    <div className = "doctrine_list_ship_trainstatus">Training Status: <div className = "doctrine_list_ship_trainigstatustext">Can Fly!</div></div>
                    <div className = "doctrine_list_ship_info">{this.props.info}</div>
                </div>
            </div>
        )
    }
}

export default class DoctrineMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var armorData = [
            [47271, 5, "Armor Leshak"],
            [22474, 4, "Armor Damnation"],
            [11987, 5, "Guardian"],
            [47271, 5, "Armor Leshak"],
            [22474, 4, "Armor Damnation"],
            [11987, 5, "Guardian"],
            [47271, 5, "Armor Leshak"],
            [22474, 4, "Armor Damnation"],
            [11987, 5, "Guardian"],
            [47271, 5, "Armor Leshak"],
            [22474, 4, "Armor Damnation"],
            [11987, 5, "Guardian"]
        ];

        var shieldData = [
            [33153, 5, "Shield DNI"],
            [11985, 4, "Shield Basilisk"],
            [17920, 5, "Shield Bhaalgorn"]
        ];

        var wormholeQRF = [
            [49710, 3, "QRF Kikimora"],
            [37457, 4, "Deacon"],
            [22456, 3, "Heretic"]
        ]

        return (
            <div className = "container_main_adjusted">
                <div className = "container_header">All Doctrines</div>
                <div className = "container_inner">
                    <div className = "doctrine_box_container">
                        <DoctrineBox
                            pushLocation = {this.props.pushLocation} 
                            data = {armorData} 
                            priority = {5} 
                            img_num = {1} 
                            total_fits = {15} 
                            creator = {"Razor"} 
                            doctrine_title={"Wormhole Armor"}
                        />
                        <DoctrineBox 
                            pushLocation = {this.props.pushLocation}  
                            data = {shieldData} priority = {4} 
                            img_num = {1} 
                            total_fits = {15} 
                            creator = {"Razor"} 
                            doctrine_title={"Wormhole Shield"}
                        />
                        <DoctrineBox 
                            pushLocation = {this.props.pushLocation}  
                            data = {wormholeQRF} 
                            priority = {3} 
                            img_num = {1} 
                            total_fits = {15} 
                            creator = {"Razor"} 
                            doctrine_title={"Wormhole QRF"}
                        />
                        <DoctrineBox 
                            pushLocation = {this.props.pushLocation}  
                            priority = {5} 
                            img_num = {1} 
                            total_fits = {15} 
                            creator = {"Razor"} 
                            doctrine_title={"Null Armor"}
                        />
                        <DoctrineBox 
                            pushLocation = {this.props.pushLocation}
                            priority = {5} 
                            img_num = {1} 
                            total_fits = {15} 
                            creator = {"Razor"} 
                            doctrine_title={"Null Shield"}
                        />
                    </div>
                </div>
            </div>
        )
    }

}