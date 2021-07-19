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

        // Adding stars
        let stars = [];
        for (let i = 0; i < this.props.priority; i++) {
            stars.push(<i class="fa doctrine-star fa-star" aria-hidden="true"></i>);
        }
        return (
            <Paper elevation={20} className = "doctrine_box">
                <div className = "doctrine_box_title">{this.props.doctrine_title}</div>
                <div className = "doctrine_box_info_container">
                    <div className = "doctrine_box_info left">Created by: &nbsp;<div className = "doctrine_box_info_inner right">{this.props.creator}</div></div>
                    <div className = "doctrine_box_info right">Total Fits:&nbsp;<div className = "doctrine_box_info_inner right">{this.props.total_fits}</div></div>
                </div>

                &nbsp;

                <div className = "doctrine_container">

                </div>

                &nbsp;

                <div className = "doctrine_box_info_container">
                    <div className = "doctrine_box_info center">Priority Rank:</div>
                    <div className = "star_container center">{stars}</div>
                </div>
            </Paper>
        )
    }
}

export default class DoctrineMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "container_main">
                <div className = "container_header">All Doctrines</div>
                <div className = "container_inner">
                    <div className = "doctrine_box_container">
                        <DoctrineBox priority = {5} img_num = {1} total_fits = {15} creator = {"Chief Mana"} doctrine_title={"Wormhole Armor"}/>
                        <DoctrineBox priority = {4} img_num = {1} total_fits = {15} creator = {"Chief Mana"} doctrine_title={"Wormhole Shield"}/>
                        <DoctrineBox priority = {3} img_num = {1} total_fits = {15} creator = {"Chief Mana"} doctrine_title={"Wormhole QRF"}/>
                        <DoctrineBox priority = {5} img_num = {1} total_fits = {15} creator = {"Chief Mana"} doctrine_title={"Null Armor"}/>
                        <DoctrineBox priority = {5} img_num = {1} total_fits = {15} creator = {"Chief Mana"} doctrine_title={"Null Shield"}/>
                    </div>
                </div>
            </div>
        )
    }

}