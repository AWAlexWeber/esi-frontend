import React from 'react';
import ReactDOM from 'react-dom';
import Main from './component/Main';
import Favicon from 'react-favicon';

// Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Cookies!
import { withCookies, Cookies, CookiesProvider } from 'react-cookie';

// Importing some css
import './css/index.css';
import './css/font.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser, faInfoCircle, faUsers, faHome, faShoppingCart, faIndustry, faSpaceShuttle, faHandshake, faCaretDown } from '@fortawesome/free-solid-svg-icons'
library.add(faHome)
library.add(faSignOutAlt)
library.add(faUsers)
library.add(faShoppingCart)
library.add(faIndustry)
library.add(faSpaceShuttle)
library.add(faHandshake)
library.add(faCaretDown)
library.add(faInfoCircle)
library.add(faUser)

// Query Searching
const queryString = require('query-string');

// Initializing the display

ReactDOM.render(
        <Router>
                <Route path = "/" component={Main} />
        </Router>
, document.getElementById('root'));