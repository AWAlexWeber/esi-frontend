// Loading the react components
import React from 'react';

export default class Fitting extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "NAPHE | Fitting";
    }

    render() {
        return (
            <div className = "main_holder">
                Fitting
            </div>
        )
    }
}