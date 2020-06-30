// Loading the react components
import React from 'react';

export default class Buyback extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "ＶＳ -    Buyback";
    }

    render() {
        return (
            <div className = "main_holder">
                Buyback
            </div>
        )
    }
}