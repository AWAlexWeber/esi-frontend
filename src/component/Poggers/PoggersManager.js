// Loading the react components
import React from 'react';

// Importing pledge components
import Poggers from "./Poggers.js";
import PoggerSearch from "./PoggerSearch.js";

export default class PoggersManager extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "NAPHE | Pogger";
    }

    render() {

        let active_view = <Poggers character_data = {this.props.character_data} character_id = {this.props.character_id} character_name = {this.props.character_name} auth_code = {this.props.auth_code} />;

        // Picking what to render
        let path = this.props.location.pathname;

        let base_target = "/pogger"
        if (path == base_target + "/search" ) {
            active_view = <PoggerSearch character_data = {this.props.character_data} character_id = {this.props.character_id} character_name = {this.props.character_name} auth_code = {this.props.auth_code} />
        }

        return (
            <div>
                {active_view}
            </div>
        )
    }
}