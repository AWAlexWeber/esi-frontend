// Loading the react components
import React from 'react';

// Loading market components
import MarketMain from "./MarketMain";
import MarketManage from "./MarketManage";
import MarketSell from "./MarketSell";
import MarketBuy from "./MarketBuy";

export default class Market extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let active_market_view = null;
        
        // Picking what to render
        let path = this.props.location.pathname
        let base_target = "/market"
        if (path == base_target + "/sell" ) {
            active_market_view = <MarketSell />
        }

        return (
            <div className = "main_holder">
                {active_market_view}
            </div>
        )
    }
}