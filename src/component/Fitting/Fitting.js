// Loading the react components
import React from 'react';

// Importing view components
import DoctrineMain from "./Doctrines/DoctrineMain.js";

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
            active_view = <DoctrineMain />;
        }

        return (
            <div className = "main_holder">
                {active_view}
            </div>
        )
    }
}