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

// Importing other classes
import HomeYoutubeCarousel from "./HomeYoutubeCarousel.js";

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

class WWOLeadership extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let image_url = "https://image.eveonline.com/Character/" + this.props.character_id + "_1024.jpg";

        if (this.props.type === "spacer") {
            return (
                <div elevation={20} className="wwoLeadershipItem_spacer" />
            );
        }

        if (!this.props.full) {
            return (
                <Paper elevation={20} className="wwoLeadershipItem">

                    <img src={image_url} className="wwolist_leadership_image"/>

                    <div className="wwolist_leadership_title">{this.props.title}</div>
                    <div className="wwolist_leadership_role">{this.props.role}</div>
                    <div className="wwolist_leadership_text">{this.props.info}</div>
                </Paper>
            )
        }
        else {
            return (
                <Paper elevation={20} className="wwoLeadershipItemFull">
                    <div className = "wwoLeadershipFull_left">
                        <img src={image_url} className="wwolist_leadership_image_full"/>
                        <div className="wwolist_leadership_title">{this.props.title}</div>
                        <div className="wwolist_leadership_role">{this.props.role}</div>
                    </div>

                    <div className = "wwwoLeadershipFull_right">
                        <div className = "wwoLeadershipFull_text_right">
                            {this.props.info}
                        </div>
                    </div>
                </Paper>
            )
        }
    }
}

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.callLoginSSO = this.callLoginSSO.bind(this);

        // Building refs
        this.ref_leadership = React.createRef();
        this.ref_about = React.createRef();
        this.ref_recruitment = React.createRef();
    }

    // Determinig where to scroll
    componentDidMount() {
        this.checkScroll();
        document.title = "ＶＳ -    Home";
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
            else if (hash == "#recruitment") {
                position = ref.ref_recruitment.current.offsetTop;
            }

            console.log(position);
            window.scroll(position, 0);
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

        let wwo_list = [
            <WWOListItem icon = {"fa-users"} title={"#WWO_1"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."} />,
            <WWOListItem icon = {"fa-users"} title={"#WWO_2"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>,
            <WWOListItem icon = {"fa-users"} title={"#WWO_3"} info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
        ];

        return (
            <div className = "main_home_holder">
                 <img src={require("../../assets/img/eve_planet.jpg")} className = "background_image"/>

                <div className = "welcome_holder_background"></div>

                <div className = "welcome_holder">
                    <div className = "welcome_text_holder">
                    ＶＩＰＥＲ ＳＯＶＥＲＥＩＧＮ
                    </div>

                    <div className = "welcome_text_subtext">
                        - Become Sovereign -
                    </div>

                    {join_now}
                </div>

                <div className = "who_we_are_holder" ref={about_erb => { this.about_erb = about_erb; }}>
                    <div className = "who_we_are_header">
                        #WELCOME_HEADER
                    </div>

                    <div className = "who_we_are_content">
                        <Paper elevation={20} className = "paper_who_we_are">
                        <Typography component="p" className = "who_we_are_text">
                            #WELCOME_TEXT
                        </Typography>
                        </Paper>
                    </div>

                    <div className = "wwo_holder">
                        <div className = "wwo_header">
                            #WWO_HEADER
                        </div>

                        <div className = "wwo_list_holder" ref={this.ref_about}>
                            {wwo_list}
                        </div>
                    </div>
                </div>

                <div className = "home_media_holder">
                    <HomeYoutubeCarousel />
                </div>


                <div className = "rec_holder" ref={this.ref_recruitment}>

                    <Paper className = "rec_paper_main">

                        <div className = "rec_join_title">
                            Join Viper Sovereign
                        </div>

                        <div className = "rec_list_holder">
                            <div className = "rec_list_left">
                                <Paper elevation={20} className = "rec_left_obj">
                                    <div className = "rec_inner_title">As Hatchling</div>
                                    <div className = "rec_inner_info">Join as a Full Member</div>
                                </Paper>
                            </div>
                            <div className = "rec_list_right">
                                <Paper elevation={20} className = "rec_right_obj">
                                    <div className = "rec_inner_title">As Eggboi</div>
                                    <div className = "rec_inner_info">Join through the Pledge Program</div>
                                </Paper>
                            </div>
                        </div>
                    </Paper>
                </div>

                <div className = "leadership_holder" ref={this.ref_leadership}>
                    <div className = "leadership_title_text">Leadership</div>

                    <div className = "who_we_are_content">
                        <Paper elevation={20} className = "paper_who_we_are">
                            <Typography component="p" className = "who_we_are_text">
                                Listed below are all leadership personnel within Viper Sovereign. For all corporate inquiries or diplo requests please reach out to one of the following individuals.
                            </Typography>
                        </Paper>
                    </div>

                    <br />
                    <br />

                    <div className = "wwo_list_holder_leadership">
                        <WWOLeadership
                            title={"Chief Mana"}
                            role={"CEO, FC, Recruiter"}
                            character_id={96887295}
                            info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."} />
                        <WWOLeadership
                            title={"Arancar Aideron"}
                            role={"Co-Founder, FC, Recruiter"}
                            character_id={92523694}
                            info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."} />
                        <WWOLeadership
                            title={"RazorrozaR"}
                            role={"Co-Founder, FC, Recruiter"}
                            character_id={1296924323}
                            info={"Ipsum Lorem blah blah blah stuff goes here and here and here and here more information that lists stuff and details and whatever the hell we want to put into details right nere?? I dont know..."}/>
                    </div>
                </div>
            </div>
        )
    }
}
