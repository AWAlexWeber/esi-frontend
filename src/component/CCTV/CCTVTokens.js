// Loading the react components
import React from 'react';

// Material UI
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';      
import { withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

// CSS
import "../../css/CCTV/cctv.css"
import "../../css/CCTV/cctv_tokens.css"

const OrangeCheckbox = withStyles({
    root: {
      color: orange[400],
      '&$checked': {
        color: orange[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

export default class CCTVTokens extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    CCTV";
    }

    render() {

        // Getting our token list
        let cctv_token_list = [];

        let cctv_header =
        <div className = "cctv_list_row_header">
            <div className = "cctv_list_row_element_select">Select</div>
            <div className = "cctv_list_row_element_title">Code</div>
            <div className = "cctv_list_row_element_title">Character ID</div>
            <div className = "cctv_list_row_element_title">Token Status</div>
            <div className = "cctv_list_row_element_title">Init Datetime</div>
            <div className = "cctv_list_row_element_title">Control</div>
        </div>;

        cctv_token_list.push(cctv_header);

        for (var i = 0; i < 25; i++) {
            let new_list_element = 
            <div className = "cctv_list_element">
                <div className = "cctv_list_row_element_select"><OrangeCheckbox /></div>
                <div className = "cctv_list_row_element">A213EKFC13V23</div>
                <div className = "cctv_list_row_element">1250292</div>
                <div className = "cctv_list_row_element">Unused</div>
                <div className = "cctv_list_row_element">10/25/2025 10:00:00</div>
                <div className = "cctv_list_row_element"></div>
            </div>
            cctv_token_list.push(new_list_element);
        }

        return (
            <div className = "cctv_token">
                <div className = "cctv_left_holder">
                    <div className = "cctv_left_title">
                        All CCTV Tokens
                    </div>
                    <div className = "cctv_left_button_holder">
                        <Button className = "cctv_button" variant="contained">Delete Selected</Button>
                    </div>
                </div>
                <div className = "cctv_list">
                    <br />
                    <div className = "cctv_token_list_container">
                        {cctv_token_list}
                    </div>
                </div>
            </div>
        )
    }
}