import React from "react";

import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryZoomContainer } from 'victory';

export default class Graphs extends React.Component {
    constructor(props) {
        super(props);
    }

    mapData(data) {
        var outputData = []
        for (var i = 0; i < data.length; i++) {
            outputData.push(
                {x: i, y: Math.round(data[i])}
            )
        }
        return outputData;
    }

    getMaximumValue(data) {
        var max = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i] > max) {
                max = data[i];
            }
        }
        return max
    }

    createDoubleChart(dataA, dataB, yLabel) {

        var processedDataA = this.mapData(dataA);
        var processedDataB = this.mapData(dataB);

        var maximumValueDataA = this.getMaximumValue(dataA)
        var maximumValueDataB = this.getMaximumValue(dataB)
        var maximumTotal = Math.round(this.getMaximumValue([maximumValueDataA, maximumValueDataB])) * 2

        return (
            <VictoryChart
                    className = "graphClass"
                    theme={VictoryTheme.material}
                    containerComponent={
                        <VictoryZoomContainer/>
                      }
                >
                    <VictoryAxis
                        label="Simulation Length"
                        style={{
                        axis: {stroke: "grey"},
                        axisLabel: {fontSize: 8, padding: 30},
                        grid: {stroke: ({ tick }) => tick > 0.5 ? "grey" : "grey"},
                        ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 8, padding: 5}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        label={yLabel}
                        style={{
                        axis: {stroke: "grey"},
                        axisLabel: {fontSize: 8, padding: 30},
                        grid: {stroke: ({ tick }) => tick > 0.5 ? "grey" : "grey"},
                        ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 8, padding: 5}
                        }}
                        domain = {{y: [0, maximumTotal]}}
                    />
                    <VictoryLine 
                        style={{
                            data: { stroke: "#0000ff" },
                            parent: { border: "1px solid #ccc"}
                        }}
                        data={processedDataA} 
                    />
                    <VictoryLine 
                        style={{
                            data: { stroke: "#ff0000" },
                            parent: { border: "1px solid #ccc"}
                        }}
                        data={processedDataB} 
                    />
                </VictoryChart>
        )
    }

    render() {

        if (this.props.results == null) {
            return (
                <div className = "graphsContainer">
                    <div className = "graphsNoData">No data to render!</div>
                </div>
            )
        }

        return (
            <div className = "graphsContainer">
                {this.createDoubleChart(this.props.results["blueforOutboundDamage"], this.props.results["opforOutboundDamage"], "Fleet Outbound Damage")}
                {this.createDoubleChart(this.props.results["blueforShipHealth"], this.props.results["opforShipHealth"], "Fleet Sum Ship Health")}
            </div>
        )
    }
}