// Loading the react components
import React from 'react';

// Material UI imports
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Importing the toolbars
import AdminAccounts from "./AdminAccounts";
import AdminHome from "./AdminHome";
import AdminFitting from "./AdminFitting";
import AdminBuyback from "./AdminBuyback";
import AdminIndustry from "./AdminIndustry";
import AdminMarket from "./AdminMarket";
import AdminPledge from "./AdminPledge";
import AdminPogger from "./AdminPogger";

// CSS
import "../../css/admin.css"

export default class AdminDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current_tab: 0
        }
    }

    componentDidMount() {
        document.title = "ＶＳ -    Admin";
    }

    handleTabChange(value) {
        this.setState({current_tab: value});
    }

    render() {
        return (
            <div className = "main_holder">
                <div className = "admin_dashboard_header"><i className="fa fa-lock" style = {{marginRight: 15, fontSize: 30}} />Administrative Dashboard</div>
                <div className = "admin_appbar">
                    <Tabs 
                        value={this.state.current_tab} 
                        onChange={(e, value) => {this.handleTabChange(value)}}
                        centered
                        textColor="primary"
                        className = "admin_tabs_holder"
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        <Tab label={<div><i className="fa fa-home" style = {{marginRight: 15, fontSize: 22}} />Home</div>} />
                        <Tab label={<div><i className="fa fa-shopping-cart" style = {{marginRight: 15, fontSize: 22}} />Market</div>} />
                        <Tab label={<div><i className="fa fa-space-shuttle" style = {{marginRight: 15, fontSize: 22}} />Fitting</div>} />
                        <Tab label={<div><i className="fa fa-industry" style = {{marginRight: 15, fontSize: 22}} />Industry</div>} />
                        <Tab label={<div><FontAwesomeIcon icon="handshake" style = {{marginRight: 22, fontSize: 22}}/> Buyback</div>} />
                        <Tab label={<div><i className="fa fa-book" style = {{marginRight: 15, fontSize: 22}} />Pledge</div>} />
                        <Tab label={<div><i className="fa fa-map" style = {{marginRight: 15, fontSize: 22}} />Pogger</div>} />
                        <Tab label={<div><i className="fa fa-users" style = {{marginRight: 15, fontSize: 22}} />Accounts</div>} />
                    </Tabs>
                </div>
                {this.state.current_tab === 0 && <AdminHome auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 1 && <AdminMarket auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 2 && <AdminFitting auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 3 && <AdminIndustry auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 4 && <AdminBuyback auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 5 && <AdminPledge auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 6 && <AdminPogger auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
                {this.state.current_tab === 7 && <AdminAccounts auth_code = {this.props.auth_code} character_id= {this.props.character_id} location = {this.props.location}/>}
            </div>
        )
    }
}