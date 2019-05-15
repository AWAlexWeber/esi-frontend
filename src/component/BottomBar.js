import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';

// Loading the css
import '../css/bottombar.css';
import 'font-awesome/css/font-awesome.min.css';

export default class BottomBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Toolbar className = "bottom_bar_holder">
            </Toolbar>
        )
    }
}