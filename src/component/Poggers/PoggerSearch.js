// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css";
import "../../css/pogger_search.css";

export default class PoggerSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search_sig_list: []
        }
    }

    render() {
        return (
            <div className = "main_holder">
                Hello, World!
            </div>
        )
    }

    getAllSigs() {}


    componentDidMount() {

        // Refreshing all of the search sigs
    }
}