// Loading the react components
import React from 'react';

// CSS
import "../../css/admin.css"

export default class AdminBuyback extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "admin_holder">
                <div className = "admin_title">Administrate Buyback</div>
            </div>
        )
    }
}