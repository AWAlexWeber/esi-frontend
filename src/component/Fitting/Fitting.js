// Loading the react components
import React from 'react';

// Importing view components
import DoctrineMain from "./Doctrines/DoctrineMain.js";
import DoctrineAdd from "./Doctrines/DoctrineAdd.js";

export default class Fitting extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    Fitting";
    }

    render() {

        let active_view = null;
        
        // Picking what to render
        let path = this.props.location.pathname
        let base_target = "/fitting"
        if (path == base_target + "/doctrines" ) {
            active_view = <DoctrineMain character_id = {this.props.character_id} auth_code = {this.props.auth_code} />;
        }
        else if (path == base_target + "/add" ) {
            active_view = <DoctrineAdd character_id = {this.props.character_id} auth_code = {this.props.auth_code} />;
        }

        return (
            <div className = "main_holder">
                {active_view}
            </div>
        )
    }
}