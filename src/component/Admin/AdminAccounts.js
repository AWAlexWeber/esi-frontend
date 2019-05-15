// Loading the react components
import React from 'react';

// CSS
import "../../css/admin.css"

export default class AdminAccounts extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "admin_holder">
                <div className = "admin_title">Administrate Accounts</div>
            </div>
        )
    }
}