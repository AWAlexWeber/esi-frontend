// Loading the react components
import React from 'react';

// Loading Matieral UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


// CSS
import "../../../css/Admin/adminaccountslist.css"

// Class that will load and display all of the members
// Will be loaded within admin account and passed down as a prop
export default class AdminAccountsList extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            menu_anchor: null
        }

        this.handleMenuClose = this.handleMenuClose.bind(this);
    }

    handleMenuOpen(event, character_id) {
        console.log(event);
        console.log(character_id);
        this.setState({menu_anchor: event.currentTarget, target_character: character_id});
    }

    handleMenuClose(value) {
        
        this.setState({menu_anchor: null});

        if (value.toString().length>10) {
            return;
        }

        this.props.setCharacterAccountGroup(this.state.target_character, value);
    }

    render() {

        let table_rows = null;
        if (this.props.all_accounts != undefined) {

            table_rows = this.props.all_accounts.map(row => (
                <TableRow>
                    <TableCell className = "accounts_table_row_cell" component="th" scope="row">
                        {row.character_id}
                    </TableCell>
                    <TableCell className = "accounts_table_row_cell" align="left">{row.character_name}</TableCell>
                    <TableCell className = "accounts_table_row_cell" align="left" onClick={(e) => this.handleMenuOpen(e, row.character_id)}>
                        {row.character_type_title}
                        <i class="fa fa-chevron-down dropdown-arrow-group"></i>
                    </TableCell>
                    <TableCell className = "accounts_table_row_cell" align="left">{row.init_date}</TableCell>
                </TableRow>
            ));
        }

        return (
            <div className = "accounts_holder">
                <Menu
                    id="simple-menu"
                    className = "accounts_group_menu"
                    anchorEl={this.state.menu_anchor}
                    keepMounted
                    open={Boolean(this.state.menu_anchor)}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem className = "account_group_menu_item" onClick={() => {this.handleMenuClose(1)}}>1 - Default</MenuItem>
                    <MenuItem className = "account_group_menu_item" onClick={() => {this.handleMenuClose(2)}}>2 - Viper</MenuItem>
                    <MenuItem className = "account_group_menu_item" onClick={() => {this.handleMenuClose(3)}}>3 - Hatchling</MenuItem>
                    <MenuItem className = "account_group_menu_item" onClick={() => {this.handleMenuClose(4)}}>4 - Eggboi</MenuItem>
                    <MenuItem className = "account_group_menu_item" onClick={() => {this.handleMenuClose(5)}}>5 - Admin</MenuItem>
                </Menu>
                <div className = "accounts_title">All Accounts</div>

                    <Table className = "accounts_table_container" aria-label="a dense table">
                        <TableHead className = "accounts_table_head">
                            <TableRow className = "accounts_table_row">
                                <TableCell className = "accounts_table_head_row">ID</TableCell>
                                <TableCell className = "accounts_table_head_row">Name</TableCell>
                                <TableCell className = "accounts_table_head_row">Group Title</TableCell>
                                <TableCell className = "accounts_table_head_row">Last Web Login</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className = "accounts_table_body">
                            {table_rows}
                        </TableBody>
                    </Table>
            </div>
        )
    }
}