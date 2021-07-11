// Loading the react components
import React from 'react';
import CCTV from "./CCTV"
import CCTVAdd from "./CCTVAdd"
import CCTVTokens from "./CCTVTokens"

// CSS
import "../../css/CCTV/cctv.css"

export default class CCTVManager extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    CCTV";
    }

    render() {
        let active_market_view = null;

        // Picking what to render
        let path = this.props.location.pathname;
        let base_target = "/cctv";
        if (path === base_target + "/add" ) {
            active_market_view = <CCTVAdd history = {this.props.history} character_data = {this.props.character_data} character_id = {this.props.character_id} character_name = {this.props.character_name} auth_code = {this.props.auth_code}/>
        }
        else if (path === base_target + "/tokens" ) {
            active_market_view = <CCTVTokens history = {this.props.history} character_data = {this.props.character_data} character_id = {this.props.character_id} character_name = {this.props.character_name} auth_code = {this.props.auth_code}/>
        }
        else {
            active_market_view = <CCTV history = {this.props.history} character_data = {this.props.character_data} character_id = {this.props.character_id} character_name = {this.props.character_name} auth_code = {this.props.auth_code}/>
        }

        return (
            <div className = "main_holder">
                {active_market_view}
            </div>
        )
    }
}