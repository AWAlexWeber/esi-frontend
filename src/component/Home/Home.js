// Loading the react components
import React from 'react';

// Class that handles all of the authentication

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
import "../../css/home.css"

class WWOListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Paper elevation={20} className = "wwoListItem">
                <i className={"fa " + this.props.icon + " wwolist_icon"}/>

                <div className = "wwolist_title">{this.props.title}</div>

                <div className = "wwolist_text">{this.props.info}</div>
            </Paper>
        )
    }
}

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.callLoginSSO = this.callLoginSSO.bind(this);

        // Building refs
        this.ref_leadership = React.createRef();
        this.ref_about = React.createRef();
    }

    // Determinig where to scroll
    componentDidMount() {
        this.checkScroll();
    }

    checkScroll() {
        // Determining where to scroll to
        let ref = this;

        setTimeout(function() {
            // Determining where to scroll based off of refs...
            let hash = ref.props.location.hash;
            let position = 0;
            console.log(ref.props.location);

            if (hash == "#about") {
                position = ref.ref_about.current.offsetTop;
                console.log("ABOUT");
            }
            else if (hash == "#leadership") {
                console.log("LEADERSHIP");
                position = ref.ref_leadership.current.offsetTop;
            }

            console.log(position);
            
            window.scrollTo({top: position, behavior: 'smooth'});
        }, 100);
    }

    callLoginSSO() {
        console.log(this.props);
        this.props.loginSSO();
    }

    render() {

        console.log(this.props);
        this.checkScroll();

        let login = <div className = "login_holder">
            <img class = "log_in" src={require("../../assets/img/eve-sso-login-black-large.png")} onClick = {() => {this.callLoginSSO()}}/>
        </div>

        let join_now = null;

        if (this.props.character_id != null) {
            login = null;
            join_now = null;/*<div className = "join_now_holder">
            <Button variant="contained" className="join_now_button">
                Apply Now
            </Button>
            </div>*/
        }

        return (
            <div className = "main_home_holder">
                 <img src={require("../../assets/img/eve_planet.jpg")} className = "background_image"/>

                <div className = "welcome_holder_background"></div>

                <div className = "welcome_holder">
                    <div className = "welcome_text_holder">
                        NaturalPhenomenon
                    </div>

                    <div className = "welcome_text_subtext">
                        A Wormhole Corporation
                    </div>

                    {login}
                    {join_now}
                </div>

                <div className = "who_we_are_holder" ref={about_erb => { this.about_erb = about_erb; }}>
                    <div className = "who_we_are_header">
                        Who we are?
                    </div>

                    <div className = "who_we_are_content">
                        <Paper elevation={20} className = "paper_who_we_are">
                        <Typography component="p" className = "who_we_are_text">
                            Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know...   
                        </Typography>
                        </Paper>
                    </div>

                    <div className = "wwo_holder">
                        <div className = "wwo_header">
                            What we offer
                        </div>

                        <div className = "wwo_list_holder" ref={this.ref_about}>
                            <WWOListItem icon = {"fa-shopping-cart"} title={"Constant Fights"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."} />
                            <WWOListItem icon = {"fa-dollar"} title={"Frequent ISK"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                            <WWOListItem icon = {"fa-users"} title={"Relaxed People"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                            <WWOListItem icon = {"fa-industry"} title={"Industry Services"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                            <WWOListItem icon = {"fa-book"} title={"Custom Tracker"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                            <WWOListItem icon = {"fa-window-maximize"} title={"Fantastic Website!"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                        </div>
                    </div>
                </div>     

                <div className = "leadership_holder" ref={this.ref_leadership}>
                    <div className = "leadership_title_text">Leadership</div>
                </div>
            </div>
        )
    }
}