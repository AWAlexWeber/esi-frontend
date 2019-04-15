// Notes container
// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css"

export default class PoggerNotes extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.notes == null) {
            return (
                <div className = "no_system_selected">
                    No System Selected
                </div>
            )
        }
        return (
            <div>
                Pogger Notes
            </div>
        )
    }
}