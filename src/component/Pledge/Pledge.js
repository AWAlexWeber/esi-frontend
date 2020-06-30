// Loading the react components
import React from 'react';

// CSS
import "../../css/pledge.css"

// Importing pledge components
import PledgeHome from "./PledgeHome.js";
import PledgeInfo from "./PledgeInfo.js";
import PledgeProfile from "./PledgeProfile.js";
import PledgeClasses from "./PledgeClasses.js";

export default class Pledge extends React.Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    Pledge";
    }

    render() {

        let active_view = <PledgeHome />;
        
        // Picking what to render
        let path = this.props.location.pathname;

        let base_target = "/pledge"
        if (path == base_target + "/list" ) {
            active_view = <PledgeClasses />
        }
        else if (path == base_target + "/info" ) {
            active_view = <PledgeInfo />
        }
        else if (path == base_target + "/profile" ) {
            active_view = <PledgeProfile />
        }

        return (
            <div className = "main_holder">
                {active_view}
            </div>
        )
    }
}