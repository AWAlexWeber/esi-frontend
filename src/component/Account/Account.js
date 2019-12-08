// Loading the react components
import React from 'react';

export default class Account extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        document.title = "NAPHE | Account";
    }

    render() {
        return (
            <div className = "main_holder">
                Account
            </div>
        )
    }
}