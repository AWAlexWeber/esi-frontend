// This is the main toolbar that sits on the top
// Loading the react components
import React from 'react';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Material UI
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

// Loading the css
import '../css/toolbar.css';
import 'font-awesome/css/font-awesome.min.css';


export default class ToolbarTop extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            home: null,
            market: null,
            fitting: null,
            fleet: null,
            industry: null,
            buyback: null,
            account: null,
            pledge: null,
            poggers: null,
            cctv: null
          };
    }

    // Function for loading pages
    loadPage(page) {
        this.closeAllAnchors()
        this.props.pushLocation(page);
    }
    
    closeAllAnchors() {
        this.setState({
            home: null,
            market: null,
            fitting: null,
            fleet: null,
            industry: null,
            buyback: null,
            account: null,
            pledge: null,
            poggers: null,
            cctv: null,
            anchorMenu: null
        })
    }

    displayAnchor(anchor, event) {
        console.log(event.target);

        // Checking if we are allowed to display this anchor...

        let display_array = null;
        if (this.props.character_data !== null && this.props.character_data !== undefined && this.props.character_data['character_permission_set'] !== null && this.props.character_data['character_permission_set'] !== undefined) {
            let permission_set = JSON.parse(this.props.character_data['character_permission_set']);
            display_array = permission_set['display_array'];
        }

        console.log("Testing " + anchor + " against " + display_array);
        if (display_array !== null && !display_array.includes("all") && anchor != "account" && anchor !== "home" && anchor !== "anchorMenu" && (display_array == null || !display_array.includes(anchor))) {
            return false;
        }


        if (anchor == "home") {
            this.setState({home: event.target});
        }
        else if (anchor == "market") {
            this.setState({market: event.target});
        }
        else if (anchor == "fitting") {
            this.setState({fitting: event.target});
        }
        else if (anchor == "fleet") {
            this.setState({fleet: event.target});
        }
        else if (anchor == "industry") {
            this.setState({industry: event.target});
        }
        else if (anchor == "buyback") {
            this.setState({buyback: event.target});
        }
        else if (anchor == "account") {
            this.setState({account: event.target})
        }
        else if (anchor == "poggers") {
            this.setState({poggers: event.target})
        }
        else if (anchor == "pledge") {
            this.setState({pledge: event.target})
        }
        else if (anchor == "cctv") {
            this.setState({cctv: event.target})
        }
        else if (anchor == "anchorMenu") {
            this.setState({anchorMenu: event.target})
        }
    }
    
    closeAnchor(anchor) {
        if (anchor == "home") {
            this.setState({home: null});
        }
        else if (anchor == "market") {
            this.setState({market: null});
        }
        else if (anchor == "fitting") {
            this.setState({fitting: null});
        }
        else if (anchor == "fleet") {
            this.setState({fleet: null});
        }
        else if (anchor == "industry") {
            this.setState({industry: null});
        }
        else if (anchor == "buyback") {
            this.setState({buyback: null});
        }
        else if (anchor == "account") {
            this.setState({account: null})
        }
        else if (anchor == "poggers") {
            this.setState({poggers: null})
        }
        else if (anchor == "pledge") {
            this.setState({pledge: null})
        }
        else if (anchor == "cctv") {
            this.setState({cctv: null})
        }
        else if (anchor == "anchorMenu") {
            this.setState({anchorMenu: null})
        }
    }

    authRoute(route) {

        if (route === "home") {
            return true;
        }

        let display_array = null;
        if (this.props.character_data !== null && this.props.character_data !== undefined && this.props.character_data['character_permission_set'] !== null && this.props.character_data['character_permission_set'] !== undefined) {
            let permission_set = JSON.parse(this.props.character_data['character_permission_set']);
            display_array = permission_set['display_array'];
        }

        // Checking if we have the route to display this...
        if (display_array === null) {
            return false;
        }

        if (route === "admin") {
            return (display_array.includes("admin"));
        }

        return (display_array.includes(route) || display_array.includes("all"));

    }
    
    render() {

        // Grabbing the anchors
        const { anchorMenu, pledge, poggers, account, home, market, fitting, fleet, industry, buyback, cctv } = this.state;

        // Determining whether we render hamburger mode or normal mode
        let window_width = window.innerWidth;

        // Determining to display or not display login
        let login = <img aria-haspopup="true" className = {"eve_login"} src={require("../assets/img/eve-sso-login-black-large.png")} onClick = {() => {this.props.loginSSO()}}/>

        let character_id = this.props.character_id
        console.log(this.props);
        if (this.props.character_id === "undefined")
            character_id = 1;

        if (this.props.character_name != null && this.props.auth_code != null) {
            login = 
                <Button onClick = {(e) => {this.displayAnchor("account",e)}} aria-haspopup="true" className = "profile_button" aria-owns={home ? 'simple-menu' : undefined}>
                    <img src={"https://image.eveonline.com/Character/"+this.props.character_id+"_256.jpg"} className = "character_image" />
                    <div className = "menu_button_text">
                        {this.props.character_name}    
                    </div>
                </Button>
        }

        let toolbar = null;

        // Checking if we have the admin button
        let admin_menu_item = null;
        if (this.authRoute("admin")) {
            admin_menu_item = <MenuItem onClick={() => {this.loadPage("/admin")}}>&nbsp;<i className="fa fa-lock" style = {{marginRight: 15, fontSize: 22}} />Admin&nbsp;</MenuItem>;
        }

        if (window_width < 750) {
            login = null;

            // Alright, rendering as a hamburger...
            toolbar =
            <Toolbar className="toolbar">

                <Typography variant="h4" color="inherit" className="naphe_title_mobile">
                    －ＶＳ－                   
                </Typography>

                <Button onClick = {(e) => {this.displayAnchor("anchorMenu",e)}} aria-haspopup="true" className = "profile_button" aria-owns={anchorMenu ? 'simple-menu' : undefined}>
                    <i className="fa fa-list" style = {{marginRight: 8, fontSize: 20}} />
                </Button>

                <Typography variant="h4" color="inherit">
                    <img className="erb_logo" src={require("../assets/img/naphe_logo.png")}/>
                </Typography>



            </Toolbar>

        }
        else {

            // Building the toolbar, determining whether or not to disable certain sets based on the information
            // Building the buttons
            let home, market, fitting, fleet, industry, buyback, pledge, pogger, cctv = null;
            if (this.authRoute("home"))
                home = <Button onClick={(e) => {
                    this.displayAnchor("home", e)
                }} aria-haspopup="true" className="menu_button" aria-owns={home ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="home" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Home</div>
                </Button>;
            if (this.authRoute("market"))
                market = <Button onClick={(e) => {
                    this.displayAnchor("market", e)
                }} aria-haspopup="true" className="menu_button"
                                 aria-owns={market ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="shopping-cart" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Market</div>
                </Button>;
            if (this.authRoute("fitting"))
                fitting = <Button onClick={(e) => {
                    this.displayAnchor("fitting", e)
                }} aria-haspopup="true" className="menu_button"
                                  aria-owns={fitting ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="space-shuttle" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Fitting</div>
                </Button>;
            if (this.authRoute("fleet"))
                fleet = <Button onClick={(e) => {
                    this.displayAnchor("fleet", e)
                }} aria-haspopup="true" className="menu_button"
                                aria-owns={fleet ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="users" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Fleet</div>
                </Button>;
            if (this.authRoute("industry"))
                industry = <Button onClick={(e) => {
                    this.displayAnchor("industry", e)
                }} aria-haspopup="true" className="menu_button"
                                   aria-owns={industry ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="industry" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Industry</div>
                </Button>;
            if (this.authRoute("buyback"))
                buyback = <Button onClick={(e) => {
                    this.displayAnchor("buyback", e)
                }} aria-haspopup="true" className="menu_button"
                                  aria-owns={buyback ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="handshake" style={{marginRight: 15}}/>
                    <div className="menu_button_text">Buyback</div>
                </Button>;
            if (this.authRoute("pledge"))
                pledge = <Button onClick={(e) => {
                    this.displayAnchor("pledge", e)
                }} aria-haspopup="true" className="menu_button"
                                 aria-owns={buyback ? 'simple-menu' : undefined}>
                    <i className="fa fa-book" style={{marginRight: 15, fontSize: 18}}/>
                    <div className="menu_button_text">Pledge</div>
                </Button>;
            if (this.authRoute("pogger"))
                pogger = <Button onClick={(e) => {
                    this.displayAnchor("poggers", e)
                }} aria-haspopup="true" className="menu_button"
                                 aria-owns={poggers ? 'simple-menu' : undefined}>
                    <i className="fa fa-map" style={{marginRight: 15, fontSize: 18}}/>
                    <div className="menu_button_text">Pogger</div>
                </Button>;
            if (this.authRoute("cctv"))
                cctv = <Button onClick={(e) => {
                    this.displayAnchor("cctv", e)
                }} aria-haspopup="true" className="menu_button"
                                 aria-owns={poggers ? 'simple-menu' : undefined}>
                    <i className="fa fa-camera" style={{marginRight: 15, fontSize: 18}}/>
                    <div className="menu_button_text">CCTV</div>
                </Button>;

            //
            toolbar =
                <Toolbar className="toolbar">
                    {login}

                    <Typography variant="h4" color="inherit">
                        <img className="erb_logo" src={require("../assets/img/naphe_logo.png")}/>
                    </Typography>

                    <Typography variant="h4" color="inherit" className="erb_title">
                    －ＶＳ－
                    </Typography>

                    {home}
                    {market}
                    {fitting}
                    {fleet}
                    {industry}
                    {buyback}
                    {pledge}
                    {pogger}
                    {cctv}

                </Toolbar>
        }

        // Hiding some of the toolbar if we are not logged in...
        if (this.props.checkLoggedIn()) {
            toolbar =
            <Toolbar className = "toolbar">
                {login}

                <Typography variant="h4" color="inherit">
                    <img className = "erb_logo" src={require("../assets/img/naphe_logo.png")} />
                </Typography>

                <Typography variant="h4" color="inherit" className = "erb_title">
                －ＶＳ－
                </Typography>
            </Toolbar>
        }
        if (this.props.checkLoggedIn() && window_width < 750) {
            toolbar =
                <Toolbar className = "toolbar">
                    {login}

                    <Typography variant="h4" color="inherit">
                        <img className = "erb_logo_center" src={require("../assets/img/naphe_logo.png")} />
                    </Typography>

                    <Typography variant="h4" color="inherit" className = "erb_title">
                    －ＶＳ－
                    </Typography>
                </Toolbar>
        }

        console.log("TOOLBAR.js: Loading toolbar with active index of " + this.props.activeIndex);

        // Building the datapoints...
        let home_mb, market_mb, fitting_mb, fleet_mb, industry_mb, buyback_mb, pledge_mb, pogger_mb, cctv_mb = null;

        if (this.authRoute("home"))
            home_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("home", e)
            }} aria-haspopup="true" className="menu_button_mobile" aria-owns={home ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="home" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Home</div>
            </MenuItem>;
        if (this.authRoute("market"))
            market_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("market", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                  aria-owns={market ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="shopping-cart" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Market</div>
            </MenuItem>;
        if (this.authRoute("fitting"))
            fitting_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("fitting", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                   aria-owns={fitting ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="space-shuttle" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Fitting</div>
            </MenuItem>
        if (this.authRoute("fleet"))
            fleet_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("fleet", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                aria-owns={fleet ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="handshake" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Fleet</div>
            </MenuItem>
        if (this.authRoute("industry"))
            industry_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("industry", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                    aria-owns={industry ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="industry" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Industry</div>
            </MenuItem>
        if (this.authRoute("buyback"))
            buyback_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("buyback", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                   aria-owns={buyback ? 'simple-menu' : undefined}>
                <FontAwesomeIcon icon="handshake" style={{marginRight: 15}}/>
                <div className="menu_button_text_mobile">Buyback</div>
            </MenuItem>
        if (this.authRoute("pledge"))
            pledge_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("pledge", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                 aria-owns={pledge ? 'simple-menu' : undefined}>
                <i className="fa fa-book" style={{marginRight: 15, fontSize: 18}}/>
                <div className="menu_button_text_mobile">Pledge</div>
            </MenuItem>
        if (this.authRoute("pogger"))
            pogger_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("poggers", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                  aria-owns={poggers ? 'simple-menu' : undefined}>
                <i className="fa fa-map" style={{marginRight: 15, fontSize: 18}}/>
                <div className="menu_button_text_mobile">Pogger</div>
            </MenuItem>
        if (this.authRoute("cctv"))
            cctv_mb = <MenuItem onClick={(e) => {
                this.displayAnchor("cctv", e)
            }} aria-haspopup="true" className="menu_button_mobile"
                                  aria-owns={poggers ? 'simple-menu' : undefined}>
                <i className="fa fa-camera" style={{marginRight: 15, fontSize: 18}}/>
                <div className="menu_button_text_mobile">CCTV</div>
            </MenuItem>



        return (
            <div className = "toolbar_full">
            
                <AppBar position="static">
                    {toolbar}
                </AppBar>

                <div className = "muimenuholder">

                    <Menu
                        id="simple-menu"
                        open={Boolean(this.state.home)}
                        anchorEl={home}
                        onClose={() => {this.closeAnchor("home")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/home")}}>&nbsp;<FontAwesomeIcon icon="home" style = {{marginRight: 15}}/>Home &nbsp;</MenuItem>
                        {/*<MenuItem onClick={() => {this.loadPage("/home#about")}}>&nbsp;<FontAwesomeIcon icon="info-circle" style = {{marginRight: 15}}/>About -VS-&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home#recruitment")}}>&nbsp;<FontAwesomeIcon icon="user" style = {{marginRight: 15}}/>Joining Us&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home#leadership")}}>&nbsp;<FontAwesomeIcon icon="users" style = {{marginRight: 15}}/>Our Leadership&nbsp;</MenuItem>*/}
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(market)}
                        anchorEl={market}
                        onClose={() => {this.closeAnchor("market")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/market")}}>&nbsp;<i className="fa fa-shopping-cart" style = {{marginRight: 15, fontSize: 22}} />Marketplace</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {this.loadPage("/market/sell")}}>&nbsp;<i className="fa fa-chevron-circle-left" style = {{marginRight: 15, fontSize: 22}} />Sell Orders</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/market/buy")}}>&nbsp;<i className="fa fa-chevron-circle-right" style = {{marginRight: 15, fontSize: 22}} />Buy Orders</MenuItem>
                        <Divider />
                        <MenuItem onClick={() =>{this.loadPage("/market/add_sell")}}>&nbsp;<i className="fa fa-cart-plus" style = {{marginRight: 15, fontSize: 22}} />Add Sell Order</MenuItem>
                        <MenuItem onClick={() =>{this.loadPage("/market/add_buy")}}>&nbsp;<i className="fa fa-cart-plus" style = {{marginRight: 15, fontSize: 22}} />Add Buy Order</MenuItem>
                        <Divider />
                        <MenuItem onClick={() =>{this.loadPage("/market/manage")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />Manage My Orders</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(fitting)}
                        anchorEl={fitting}
                        onClose={() => {this.closeAnchor("fitting")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/fitting/doctrines")}}>&nbsp;<i className="fa fa-space-shuttle" style = {{marginRight: 15, fontSize: 22}} />Doctrines</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {this.loadPage("/fitting/all")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />All Fits</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/fitting/add")}}>&nbsp;<i className="fa fa-plus-square" style = {{marginRight: 15, fontSize: 22}} />Add Fit</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(fleet)}
                        anchorEl={fleet}
                        onClose={() => {this.closeAnchor("fleet")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/fleet/join")}}>&nbsp;<i className="fa fa-users" style = {{marginRight: 15, fontSize: 22}} />Join Fleet</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/fleet/fc")}}>&nbsp;<i className="fa fa-cogs" style = {{marginRight: 15, fontSize: 22}} />FC Tools</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {this.loadPage("/fleet/simulator")}}>&nbsp;<i className="fa fa-cogs" style = {{marginRight: 15, fontSize: 22}} />Simulator</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(industry)}
                        anchorEl={industry}
                        onClose={() => {this.closeAnchor("industry")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/industry")}}>Industry</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/industry/profile")}}>My Industry</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/industry/manage")}}>Industry management</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(buyback)}
                        anchorEl={buyback}
                        onClose={() => {this.closeAnchor("buyback")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/buyback")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />Buyback Programs</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/buyback/contribute")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />Contribute to Program</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/buyback/my_contributions")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />My Contributions</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(poggers)}
                        anchorEl={poggers}
                        onClose={() => {this.closeAnchor("poggers")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/pogger")}}>&nbsp;<i className="fa fa-map" style = {{marginRight: 15, fontSize: 22}} />Pogger</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pogger/stats")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />Pogger Stats</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pogger/options")}}>&nbsp;<i className="fa fa-gear" style = {{marginRight: 15, fontSize: 22}} />Pogger Options</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(pledge)}
                        anchorEl={pledge}
                        onClose={() => {this.closeAnchor("pledge")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/pledge")}}>&nbsp;<i className="fa fa-book" style = {{marginRight: 15, fontSize: 22}} />Pledge Program</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/info")}}>&nbsp;<i className="fa fa-info" style = {{marginRight: 15, fontSize: 22}} />Program Information</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/list")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />Classes List</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/profile")}}>&nbsp;<i className="fa fa-user" style = {{marginRight: 15, fontSize: 22}} />My Class Profile</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(cctv)}
                        anchorEl={cctv}
                        onClose={() => {this.closeAnchor("cctv")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/cctv")}}>&nbsp;<i className="fa fa-camera" style = {{marginRight: 15, fontSize: 22}} />CCTV Overview</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/cctv/add")}}>&nbsp;<i className="fa fa-plus-circle" style = {{marginRight: 15, fontSize: 22}} />New CCTV</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/cctv/tokens")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />CCTV Tokens</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(account)}
                        anchorEl={account}
                        onClose={() => {this.closeAnchor("account")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/account")}}>&nbsp;<FontAwesomeIcon icon="user" style = {{marginRight: 15}}/>My account&nbsp;</MenuItem>
                        {admin_menu_item}
                        <MenuItem onClick={() => {this.props.logOut()}}>&nbsp;<i className="fa fa-sign-out" style = {{marginRight: 15, fontSize: 22}} />Sign Out&nbsp;</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorMenu)}
                        anchorEl={anchorMenu}
                        onClose={() => {this.closeAnchor("anchorMenu")}}
                    >
                        {home_mb}

                        {market_mb}

                        {fitting_mb}

                        {fleet_mb}

                        {industry_mb}

                        {buyback_mb}

                        {pledge_mb}

                        {pogger_mb}

                        {cctv_mb}

                        <MenuItem onClick={(e) => {
                            this.displayAnchor("account", e)
                        }} aria-haspopup="true" className="menu_button_mobile"
                                  aria-owns={account ? 'simple-menu' : undefined}>
                            <i className="fa fa-user" style={{marginRight: 15, fontSize: 18}}/>
                            <div className="menu_button_text_mobile">{this.props.character_name}</div>
                        </MenuItem>
                    </Menu>

                </div>
            </div>
        )
    }
}

class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let border = null;
        if (this.props.index === this.props.activeIndex) {
            border = <div className = "toolbarButtonBottomBorder" />
        }

        return (
            <Link to = {this.props.url_title} onClick = { () => {this.props.setActiveIndex(this.props.index, this.props.url_title)}} className = {"toolbarButton"}>
                <FontAwesomeIcon icon={this.props.icon} style = {{marginRight: 15}}/>
                {this.props.title}
                <FontAwesomeIcon icon="caret-down" style = {{marginLeft: 15}}/>
                {border}
                
            </Link>
        )
    }
}
const ToolbarLip = {
    width: "100%",
    height: "7%",
    textAlign: "center",
    backgroundColor: "#28C0CB",
    position: "relative"
}

const ToolbarBase = {
    backgroundColor: "#45374C",
    width: "100%",
    height: "90%",
    minHeight: 60,
    maxHeight: 90,
    textAlign: "center",
}

const lipColor = "#45374C";
const baseColor = "#262626";
const contrastColor = "#28C0CB";



/*


        return (
            <div style = {ToolbarFull}>
            
                <div style = {ToolbarLip}></div>
                <div style = {ToolbarBase}>
                    <div className = "logoHolder">
                        <img className = "erb_logo" src={require("../assets/img/erb_logo.png")} />
                        <div className = "erb_title">Einstein-Rosen Brigade</div>
                    </div>

                    <div class = "toolbar_content">
                        <ToolbarButton url_title = "" icon = "home" setActiveIndex = {this.props.setActiveIndex} title = "Home" index = {0} activeIndex = {this.props.activeIndex}/>
                        <ToolbarButton url_title = "/market" icon = "shopping-cart" setActiveIndex = {this.props.setActiveIndex} title = "Market" index = {1} activeIndex = {this.props.activeIndex}/>
                        <ToolbarButton url_title = "/industry" icon = "industry" setActiveIndex = {this.props.setActiveIndex} title = "Industry" index = {2} activeIndex = {this.props.activeIndex}/>
                        <ToolbarButton url_title = "/fittings" icon = "space-shuttle" setActiveIndex = {this.props.setActiveIndex} title = "Fittings" index = {3} activeIndex = {this.props.activeIndex}/>
                        <ToolbarButton url_title = "/programs" icon = "handshake" setActiveIndex = {this.props.setActiveIndex} title = "Programs" index = {4} activeIndex = {this.props.activeIndex}/>
                    </div>

                    {login}
                    
                </div>
                <div style = {ToolbarLip}></div>
            </div>
        )

*/
