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
            anchorHome: null,
            anchorMarket: null,
            anchorFitting: null,
            anchorIndustry: null,
            anchorBuyback: null,
            anchorProfile: null,
            anchorClasses: null,
            anchorPoggers: null
          };
    }

    // Function for loading pages
    loadPage(page) {
        this.closeAllAnchors()
        this.props.pushLocation(page);
    }
    
    closeAllAnchors() {
        this.setState({
            anchorHome: null,
            anchorMarket: null,
            anchorFitting: null,
            anchorIndustry: null,
            anchorBuyback: null,
            anchorProfile: null,
            anchorClasses: null,
            anchorPoggers: null
        })
    }

    displayAnchor(anchor, event) {
        console.log(event.target);

        if (anchor == "anchorHome") {
            this.setState({anchorHome: event.target});
        }
        else if (anchor == "anchorMarket") {
            this.setState({anchorMarket: event.target});
        }
        else if (anchor == "anchorFitting") {
            this.setState({anchorFitting: event.target});
        }
        else if (anchor == "anchorIndustry") {
            this.setState({anchorIndustry: event.target});
        }
        else if (anchor == "anchorBuyback") {
            this.setState({anchorBuyback: event.target});
        }
        else if (anchor == "anchorProfile") {
            this.setState({anchorProfile: event.target})
        }
        else if (anchor == "anchorPoggers") {
            this.setState({anchorPoggers: event.target})
        }
        else if (anchor == "anchorClasses") {
            this.setState({anchorClasses: event.target})
        }
    }
    
    closeAnchor(anchor) {
        if (anchor == "anchorHome") {
            this.setState({anchorHome: null});
        }
        else if (anchor == "anchorMarket") {
            this.setState({anchorMarket: null});
        }
        else if (anchor == "anchorFitting") {
            this.setState({anchorFitting: null});
        }
        else if (anchor == "anchorIndustry") {
            this.setState({anchorIndustry: null});
        }
        else if (anchor == "anchorBuyback") {
            this.setState({anchorBuyback: null});
        }
        else if (anchor == "anchorProfile") {
            this.setState({anchorProfile: null})
        }
        else if (anchor == "anchorPoggers") {
            this.setState({anchorPoggers: null})
        }
        else if (anchor == "anchorClasses") {
            this.setState({anchorClasses: null})
        }
    }
    
    render() {

        // Grabbing the anchors
        const { anchorClasses, anchorPoggers, anchorProfile, anchorHome, anchorMarket, anchorFitting, anchorIndustry, anchorBuyback } = this.state;


        // Determining to display or not display login
        let login = <img aria-haspopup="true" class = {"eve_login"} src={require("../assets/img/eve-sso-login-black-large.png")} onClick = {() => {this.props.loginSSO()}}/>

        let character_id = this.props.character_id
        console.log(this.props);
        if (this.props.character_id == "undefined")
            character_id = 1;

        if (this.props.character_name != null && this.props.auth_code != null) {
            login = 
                <Button onClick = {(e) => {this.displayAnchor("anchorProfile",e)}} aria-haspopup="true" className = "profile_button" aria-owns={anchorHome ? 'simple-menu' : undefined}>
                    <img src={"https://image.eveonline.com/Character/"+this.props.character_id+"_256.jpg"} className = "character_image" />
                    <div className = "menu_button_text">
                        {this.props.character_name}    
                    </div>
                </Button>
        }

        // Building the toolbar, determining whether or not to disable certain sets based on the information
        let toolbar =
            <Toolbar className = "toolbar">
                {login}

                <Typography variant="h4" color="inherit">
                    <img className = "erb_logo" src={require("../assets/img/naphe_logo.png")} />
                </Typography>

                <Typography variant="h4" color="inherit" className = "erb_title">
                    NaturalPhenomenon
                </Typography>

                <Button onClick = {(e) => {this.displayAnchor("anchorHome",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorHome ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="home" style = {{marginRight: 15}}/>
                    <div className = "menu_button_text">Home</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorMarket",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorMarket ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="shopping-cart" style = {{marginRight: 15}}/>
                    <div className = "menu_button_text">Market</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorFitting",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorFitting ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="space-shuttle" style = {{marginRight: 15}}/>
                    <div className = "menu_button_text">Fitting</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorIndustry",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorIndustry ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="industry" style = {{marginRight: 15}}/>
                    <div className = "menu_button_text">Industry</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorBuyback",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorBuyback ? 'simple-menu' : undefined}>
                    <FontAwesomeIcon icon="handshake" style = {{marginRight: 15}}/>
                    <div className = "menu_button_text">Buyback</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorClasses",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorBuyback ? 'simple-menu' : undefined}>
                <i className="fa fa-book" style = {{marginRight: 15, fontSize: 18}} />
                    <div className = "menu_button_text">Pledge</div>
                </Button>

                <Button onClick = {(e) => {this.displayAnchor("anchorPoggers",e)}} aria-haspopup="true" className = "menu_button" aria-owns={anchorPoggers ? 'simple-menu' : undefined}>
                    <i className="fa fa-map" style = {{marginRight: 15, fontSize: 18}} />
                    <div className = "menu_button_text">Pogger</div>
                </Button>
            </Toolbar>

        // Hiding some of the toolbar if we are not logged in...
        if (this.props.checkLoggedIn()) {
            toolbar =
            <Toolbar className = "toolbar">
                {login}

                <Typography variant="h4" color="inherit">
                    <img className = "erb_logo" src={require("../assets/img/naphe_logo.png")} />
                </Typography>

                <Typography variant="h4" color="inherit" className = "erb_title">
                    NaturalPhenomenon
                </Typography>
            </Toolbar>
        }

        console.log("TOOLBAR.js: Loading toolbar with active index of " + this.props.activeIndex);
        return (
            <div className = "toolbar_full">
            
                <AppBar position="static">
                    {toolbar}
                </AppBar>

                <div className = "muimenuholder">

                    <Menu
                        id="simple-menu"
                        open={Boolean(this.state.anchorHome)}
                        anchorEl={anchorHome}
                        onClose={() => {this.closeAnchor("anchorHome")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/home")}}>&nbsp;<FontAwesomeIcon icon="home" style = {{marginRight: 15}}/>Home Page&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home#about")}}>&nbsp;<FontAwesomeIcon icon="info-circle" style = {{marginRight: 15}}/>About NAPHE&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home#leadership")}}>&nbsp;<FontAwesomeIcon icon="users" style = {{marginRight: 15}}/>NAPHE Leadership&nbsp;</MenuItem>    
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorMarket)}
                        anchorEl={anchorMarket}
                        onClose={() => {this.closeAnchor("anchorMarket")}}
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
                        open={Boolean(anchorFitting)}
                        anchorEl={anchorFitting}
                        onClose={() => {this.closeAnchor("anchorFitting")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/fitting")}}>&nbsp;<i className="fa fa-space-shuttle" style = {{marginRight: 15, fontSize: 22}} />All Fittings</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/fitting/corp")}}>&nbsp;<i className="fa fa-certificate" style = {{marginRight: 15, fontSize: 22}} />Corporation Fittings</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {this.loadPage("/fitting/add")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />Add Fitting</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/fitting/my_fittings")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />My Fittings</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorIndustry)}
                        anchorEl={anchorIndustry}
                        onClose={() => {this.closeAnchor("anchorIndustry")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/home")}}>Profile</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home")}}>My account</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/home")}}>Logout</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorBuyback)}
                        anchorEl={anchorBuyback}
                        onClose={() => {this.closeAnchor("anchorBuyback")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/buyback")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />Buyback Programs</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/buyback/contribute")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />Contribute to Program</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/buyback/my_contributions")}}>&nbsp;<i className="fa fa-plus" style = {{marginRight: 15, fontSize: 22}} />My Contributions</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorPoggers)}
                        anchorEl={anchorPoggers}
                        onClose={() => {this.closeAnchor("anchorPoggers")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/pogger")}}>&nbsp;<i className="fa fa-map" style = {{marginRight: 15, fontSize: 22}} />Pogger</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pogger/stats")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />Pogger Stats</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pogger/options")}}>&nbsp;<i className="fa fa-gear" style = {{marginRight: 15, fontSize: 22}} />Pogger Options</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorClasses)}
                        anchorEl={anchorClasses}
                        onClose={() => {this.closeAnchor("anchorClasses")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/pledge")}}>&nbsp;<i className="fa fa-book" style = {{marginRight: 15, fontSize: 22}} />Pledge Program</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/info")}}>&nbsp;<i className="fa fa-info" style = {{marginRight: 15, fontSize: 22}} />Program Information</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/list")}}>&nbsp;<i className="fa fa-list" style = {{marginRight: 15, fontSize: 22}} />Classes List</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/pledge/profile")}}>&nbsp;<i className="fa fa-user" style = {{marginRight: 15, fontSize: 22}} />My Class Profile</MenuItem>
                    </Menu>

                    <Menu
                        id="simple-menu"
                        open={Boolean(anchorProfile)}
                        anchorEl={anchorProfile}
                        onClose={() => {this.closeAnchor("anchorProfile")}}
                    >
                        <MenuItem onClick={() => {this.loadPage("/account")}}>&nbsp;<FontAwesomeIcon icon="user" style = {{marginRight: 15}}/>My account&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.loadPage("/admin")}}>&nbsp;<i className="fa fa-lock" style = {{marginRight: 15, fontSize: 22}} />Admin&nbsp;</MenuItem>
                        <MenuItem onClick={() => {this.props.logOut()}}>&nbsp;<i className="fa fa-sign-out" style = {{marginRight: 15, fontSize: 22}} />Sign Out&nbsp;</MenuItem>
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