// Loading the react components
import React from 'react';

import Simulator from "./Simulator";

export default class Fleet extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    Fleet";
    }

    render() {

        let active_view = null;
        
        // Picking what to render
        let path = this.props.location.pathname
        let base_target = "/fleet"

        if (path == base_target + "/simulator" ) {
            active_view = <Simulator pushLocation = {this.props.pushLocation} character_id = {this.props.character_id} auth_code = {this.props.auth_code} />;
        }

        return (
            <div className = "main_holder">
                {active_view}
            </div>
        )
    }
}