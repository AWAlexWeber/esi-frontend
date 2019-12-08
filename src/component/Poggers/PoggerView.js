// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css"

// MU
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



export default class PoggerView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            POGGER_SIG_WIDTH: 125,
            mouseDragDown: false,

            // Display data
            final_display_row: [],
            sig_hold: null,
            refObject: {},
            graph_array: [],
            svg: null,
            displayTimeout: undefined

        };

        this.poggersys_view = React.createRef();

        this.handleMouseScroll = this.handleMouseScroll.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.addNewRef = this.addNewRef.bind(this);
    }

    addNewRef(ref, name) {
        let newRefObject = this.state.refObject;
        newRefObject[name] = ref;
        this.setState({refObject: newRefObject});
    }

    // Function for handling mouse based scrolling
    handleMouseScroll(e) {

        if (this.state.displayTimeout !== undefined)
            clearTimeout(this.state.displayTimeout);

        // Getting direction
        if (e.deltaY < 0) {
            let new_sig_width = this.state.POGGER_SIG_WIDTH - 6;
            if (new_sig_width < 60) {
                new_sig_width = 60;
            }

            this.setState({POGGER_SIG_WIDTH: new_sig_width, renderSVG: true});
        }

        if (e.deltaY > 0) {
            let new_sig_width = this.state.POGGER_SIG_WIDTH + 6;
            if (new_sig_width > 125) {
                new_sig_width = 125;
            }

            this.setState({POGGER_SIG_WIDTH: new_sig_width, renderSVG: true});
        }

        let ref = this;
        setTimeout(function() {
            ref.loadDisplayData();
        }, 50);

        e.preventDefault();
    }

    handleMouseDown(e) {
        this.setState({mouseDragDown: true, renderSVG: true});

        e.preventDefault();
    }

    handleMouseUp(e) {
        let ref = this;
        setTimeout(function() {
            ref.setState({mouseDragDown: false, renderSVG: true});
        }, 50);
    }

    loadDisplayData() {

        // Here is where we build our chain...
        // Our row of display lists...
        let visit_list = [];
        let lower_visit_list = [];
        let parent_list = {};

        if (this.props.top_location !== null) {
            visit_list.push(this.props.top_location['solarSystemName']);
        }
        else {
            return;
        }

        let MASTER_VIEW_CHAIN = {};
        let while_loop_count = 0;

        // Building the layer-based graph array
        let GRAPH_LAYER_ARRAY = [];
        let current_graph_layer_node = [];
        let next_graph_layer_node = [];

        // Tracking sigs, matching name to sig ID
        let map_system_name_to_id = {};

        let current_visit_list = [];
        let iterate_count = 0;


        /* COPY START */
        while(iterate_count < 10 && (visit_list.length > 0 || lower_visit_list.length > 0)) {

            iterate_count++;

            // Building our current row
            current_graph_layer_node = next_graph_layer_node;
            next_graph_layer_node = [];

            ////console.log("NEW ROW");
            while(visit_list.length > 0) {
                // Iterating on the system
                ////console.log(lower_visit_list);
                ////console.log(visit_list);

                let visit_system = visit_list.pop();

                // Checking if we already have the existing sig
                let continue_flag = false;
                for (let i = 0; i < current_visit_list.length; i++) {
                    if (current_visit_list[i] === visit_system) {
                        continue_flag = true;
                    }
                }

                if (continue_flag) {
                    continue;
                }

                current_visit_list.push(visit_system);

                // If it is a number, we are simply just going to add it and keep on truckin along here mother fuckerr
                if (typeof(visit_system) === "number") {
                    MASTER_VIEW_CHAIN[visit_system] =
                        {
                            "name": visit_system,
                            "lrint": 0,
                            "layer": while_loop_count,
                            "child_count": 0,
                            "parent": parent_list[visit_system],
                            "children": {},
                            "init_sig": this.props.sig_list_id[visit_system]
                        };
                    ////console.log("ADDING UNKNOWN SIG");
                    ////console.log(MASTER_VIEW_CHAIN[visit_system]);
                    current_graph_layer_node.push(MASTER_VIEW_CHAIN[visit_system]);

                    continue;
                }

                let children_json = [];

                // Lets get all of this dudes sigs, checking for wormholes!
                let system_sig_list = this.props.sigs_list_system[visit_system];
                let wormhole_count = 0;

                for (let sig_index in system_sig_list) {
                    let sig_value = system_sig_list[sig_index];

                    // We are checking for wormholes with valid destinations
                    // Those are the ones we want to add into the lower_visit_list
                    if (sig_value['sig_type'] === "Wormhole") {
                        // We have a wormhole!!! :O :O :O :O
                        // Now lets check if it has a destination
                        wormhole_count = wormhole_count + 1;

                        let wormhole_data = JSON.parse(sig_value['sig_wormhole_data']);
                        let parent_child_name = sig_value["sig_id"];
                        if (wormhole_data['wormhole_destination'] !== undefined && wormhole_data['wormhole_destination'].length > 0) {
                            // We have a destination!
                            // Lets append
                            parent_child_name = wormhole_data['wormhole_destination'];
                            lower_visit_list.unshift(wormhole_data['wormhole_destination']);

                            // Since it has actual data, lets take this data and load it...
                            let system_chain_data_name = this.props.chain[wormhole_data['wormhole_destination']];
                            if (system_chain_data_name !== undefined) {
                                system_chain_data_name = system_chain_data_name['solarSystemName'];
                            }
                            else {
                                system_chain_data_name = null;
                            }
                        }
                        else {
                            lower_visit_list.unshift(parent_child_name);
                        }

                        // Either way, this parent has a child

                        parent_list[parent_child_name] = visit_system;
                        children_json.push(parent_child_name);

                        let sig_id = sig_value['sig_id'];
                        map_system_name_to_id[parent_child_name] = sig_id;
                    }
                }

                let wormhole_effect = "None";
                if (this.props.chain[visit_system] !== undefined) {
                    wormhole_effect = this.props.chain[visit_system]['wormholeEffect'];
                }

                MASTER_VIEW_CHAIN[visit_system] =
                    {
                        "name": visit_system,
                        "lrint": 0,
                        "layer": while_loop_count,
                        "child_count": wormhole_count,
                        "parent": parent_list[visit_system],
                        "children": children_json,
                        "init_sig": this.props.sig_list_id[map_system_name_to_id[visit_system]],
                        "wormhole_effect": wormhole_effect

                    };

                // Appending this to our current graph array.
                current_graph_layer_node.push(MASTER_VIEW_CHAIN[visit_system]);
            }

            GRAPH_LAYER_ARRAY.push(current_graph_layer_node);
            while_loop_count = while_loop_count + 1;

            // Moving over the lower row now...
            visit_list = lower_visit_list;
            lower_visit_list = [];
        }

        //////console.log("MASTER CHAIN INFO");
        //////console.log(MASTER_VIEW_CHAIN);
        //////console.log(GRAPH_LAYER_ARRAY);
        //////console.log(parent_list);


        ///
        /// OKAY WE HAVE OUR GRAPH LAYER ARRAY!
        /// LETS FUCKING DO THISSSSSSSSSSSSSSS

        /* COPY END */
        let terminal_row_tracker = {};
        let node_index_counter = 0;

        // Starting from the bottom
        for (let i = GRAPH_LAYER_ARRAY.length - 1; i >= 0; i--) {
            let current_layer = GRAPH_LAYER_ARRAY[i];

            let terminal_row_current = {};
            let child_counter = 0;

            node_index_counter = 0;
            for (let node_index in current_layer) {
                ////console.log(node_index);
                ////console.log(current_layer);
                let node = current_layer[node_index];
                ////console.log("BUILDING DATA FOR " + node);
                let node_name = node['name'];
                let leftright_internodal_distance = 0;

                if (node['child_count'] === 1) {
                    leftright_internodal_distance = MASTER_VIEW_CHAIN[node['children'][0]]['lrint'];
                    //////console.log("FOUND THE SMALLVALUE LEFTRIGHT OF " +leftright_internodal_distance);
                }
                else if (node['child_count'] > 1) {
                    leftright_internodal_distance = node['child_count'];

                    let node_children = node['children'];
                    for (let node_child_index in node_children) {
                        let node_child_name = node_children[node_child_index];
                        let node_child_data = MASTER_VIEW_CHAIN[node_child_name];

                        let node_child_lrint = node_child_data['lrint'];
                        leftright_internodal_distance = leftright_internodal_distance + 2 * node_child_lrint;
                    }

                    // Final value
                    leftright_internodal_distance = (leftright_internodal_distance-=1 ) / 2;


                }
                else if (node['child_count'] === 0) {
                    // TERMINAL
                    // Lets keep track of it for the next row
                    //////console.log("TERMINAL IN ROW " + i);

                    // Lets check, does an array already exist?

                    if (terminal_row_current[child_counter] >= 1) {
                        // Incrementing
                        terminal_row_current[child_counter] = terminal_row_current[child_counter] + 1;
                    }
                    else {
                        terminal_row_current[child_counter] = 1;
                    }

                }

                child_counter = child_counter + node['child_count'];

                //////console.log("SETTING LRINT TO " + leftright_internodal_distance);
                MASTER_VIEW_CHAIN[node_name]['lrint'] = leftright_internodal_distance;
                node_index_counter = node_index_counter + 1;
                terminal_row_tracker[i + 1] = terminal_row_current;
            }
        }

        // Attempting to build a second set of datapoints for the spacers...
        // Determining the maximum width of the screen
        let maximum_width = (4 * MASTER_VIEW_CHAIN[this.props.top_location['solarSystemName']]['lrint']) + 2;
        let maximum_height = GRAPH_LAYER_ARRAY.length;

        let GRAPH_BASED_TERMINAL_POSITIONS = [];
        for (let y = 0; y < maximum_height; y++) {
            let width_array = [];
            for (let x = 0; x < maximum_width; x++) {
                width_array.push("000");
            }
            GRAPH_BASED_TERMINAL_POSITIONS.push(width_array);
        }

        // Now that we have build the array to represent the positioning, we are going to assemble the display set...
        // This display set is an array of all the positioning of the nodes
        for (let row_index in GRAPH_LAYER_ARRAY) {
            // Grabbing the first layer row
            // Using the terminal_count to offset ourselves slightly...
            let terminal_count = 0;

            // Current horizontal position will ALWAYS be the 'start' position of the next node
            // Such that it is never in its range of the previously iterated child
            let current_horizontal_position = 0;
            let row = GRAPH_LAYER_ARRAY[row_index];

            for (let node_index in row) {
                let node = row[node_index];

                // Checking if there are any preceding Xs
                // Checking if we are starting at zero...
                while (current_horizontal_position < GRAPH_BASED_TERMINAL_POSITIONS[parseInt(row_index)].length && GRAPH_BASED_TERMINAL_POSITIONS[parseInt(row_index)][current_horizontal_position] === "XXX") {
                    current_horizontal_position++;
                }

                // Moving us the LRINT first
                current_horizontal_position = current_horizontal_position + ( 2 * node['lrint'] );

                // We are sitting at the start of this node
                // Lets go ahead and mark that within the graph
                // Some fancy stuff for marking
                let node_name = node['name'];
                if (node_name.length > 3)
                    node_name = node_name.substr(node_name.length - 3).toUpperCase();
                node_name = node_name.toString();

                GRAPH_BASED_TERMINAL_POSITIONS[row_index][current_horizontal_position] = node;
                GRAPH_BASED_TERMINAL_POSITIONS[row_index][current_horizontal_position + 1] = node;

                // Checking if this is childless; if it is, adding 0s all the way down
                if (node['child_count'] <= 0) {
                    let adjust_row_index = parseInt(row_index);

                    adjust_row_index++;
                    while (adjust_row_index < GRAPH_BASED_TERMINAL_POSITIONS.length) {
                        GRAPH_BASED_TERMINAL_POSITIONS[adjust_row_index][current_horizontal_position] = "XXX";
                        GRAPH_BASED_TERMINAL_POSITIONS[adjust_row_index][current_horizontal_position + 1] = "XXX";
                        adjust_row_index++;
                    }
                }

                // Adding on the terminal amount for the horizontal position
                current_horizontal_position = current_horizontal_position + ( 2 * node['lrint'] ) + 2;
            }
        }

        //console.log(GRAPH_BASED_TERMINAL_POSITIONS);

        // We have, miracuously, assembled our layer list
        // Building, layer by layer...
        let display_row = [];

        // Getting chain data to help us
        let chain_data = this.props.chain;

        // Looping over the layers...
        for (let i = 0; i < GRAPH_BASED_TERMINAL_POSITIONS.length; i++) {




            let current_display_row = [];
            let current_graph_node = GRAPH_BASED_TERMINAL_POSITIONS[i];

            let x = 0;
            for (x = current_graph_node.length - 1; x >= 0; x--) {
                let node = current_graph_node[x];

                if (node === "XXX" || node === "000") {
                    // Lets add a hidden node, and continue

                    let POGGER_HIDDEN_SYS =
                        <PoggerSystem
                            fake = {true}
                            POGGER_SIG_WIDTH = {this.state.POGGER_SIG_WIDTH}
                        />;

                    // APPENDING!!!!!
                    current_display_row.unshift(POGGER_HIDDEN_SYS);

                    continue;
                }

                let node_name = node['name'];
                let system_name = "";
                let location_chain_data = undefined;

                console.log(node);

                // Checking; are we adding an unknown or a known
                let destination_class = "";

                if (typeof(node_name) === "number") {
                    // Is a unknown
                    // Making some adjustments
                    let sig_wormhole_data = JSON.parse(MASTER_VIEW_CHAIN[node_name]['init_sig']['sig_wormhole_data']);
                    destination_class = sig_wormhole_data['destination_class'];
                    system_name = "???";
                }
                else {
                    // Valid destination
                    system_name = node_name;
                    location_chain_data = chain_data[node_name];
                }

                if (destination_class === undefined || destination_class.length <= 0) {
                    destination_class = "???";
                }


                // Finally building it...
                let new_pogger_display_system = null;
                let system_sig_list = this.props.sigs_list_system[node_name];
                let system_sig_count = "";
                let sig_system_scan_strength_sum = "";
                if (system_sig_list !== undefined) {
                    system_sig_count = +Object.keys(system_sig_list).length + " sig(s)";

                    // Getting the average system sig scan strength
                    sig_system_scan_strength_sum = 0;
                    let counting_sigs = 0;
                    for (let sig_it_val in system_sig_list) {
                        let sig_it_val_strength = system_sig_list[sig_it_val]['sig_scan_strength'];
                        sig_system_scan_strength_sum += sig_it_val_strength;
                        counting_sigs = counting_sigs + 1;
                    }

                    sig_system_scan_strength_sum = sig_system_scan_strength_sum / counting_sigs;
                    let int_value_strength = parseInt(sig_system_scan_strength_sum);
                    if (int_value_strength < 10) {
                        int_value_strength = "" + int_value_strength;
                    }

                    let color_value = "#FFFFFF";
                    if (int_value_strength >= 90) {
                        color_value = "#1dff00";
                    }
                    else if (int_value_strength >= 80) {
                        color_value = "#8fd046";
                    }
                    else if (int_value_strength >= 50) {
                        color_value = "#d0ce24";
                    }
                    else if (int_value_strength >= 30) {
                        color_value = "#d07215";
                    }
                    else {
                        color_value = "#ab4b4e";
                    }


                    let targetFontSize = 12;
                    if (this.state.POGGER_SIG_WIDTH < 120) {
                        targetFontSize = 0;
                    }
                    sig_system_scan_strength_sum = <div style = {{color: color_value, fontSize: targetFontSize}} className = "poggersys_inner_display_scan_strength">{int_value_strength}</div>;
                }

                if (typeof(node_name) === "number") {
                    new_pogger_display_system =
                        <PoggerSystem
                            left = {MASTER_VIEW_CHAIN[node_name]['lrint']}
                            right = {MASTER_VIEW_CHAIN[node_name]['lrint']}
                            location={undefined}
                            selected_system={this.props.selected_system}
                            select={this.props.set_selected_system}
                            system_name={system_name}
                            system_type={destination_class}
                            system_sig_count={system_sig_count}
                            system_sig_strength = {sig_system_scan_strength_sum}
                            parent_sig = {MASTER_VIEW_CHAIN[node_name]['init_sig']}
                            POGGER_SIG_WIDTH = {this.state.POGGER_SIG_WIDTH}
                            addNewRef = {this.addNewRef}
                            system_effect = {node['wormhole_effect']}
                        />
                }
                else {
                    new_pogger_display_system =
                        <PoggerSystem
                            left = {MASTER_VIEW_CHAIN[node_name]['lrint']}
                            right = {MASTER_VIEW_CHAIN[node_name]['lrint']}
                            location={location_chain_data}
                            selected_system={this.props.selected_system}
                            select={this.props.set_selected_system}
                            system_name={system_name}
                            system_sig_count={system_sig_count}
                            system_sig_strength = {sig_system_scan_strength_sum}
                            parent_sig = {MASTER_VIEW_CHAIN[node_name]['init_sig']}
                            POGGER_SIG_WIDTH = {this.state.POGGER_SIG_WIDTH}
                            addNewRef = {this.addNewRef}
                            system_effect = {node['wormhole_effect']}
                        />
                }

                current_display_row.unshift(new_pogger_display_system);

                // Skipping one set...
                x-=1;

                // Lets also check; are we about to leave and there are STILL fuckbois left???
            }

            // Determining the row style
            let targetHeight = this.state.POGGER_SIG_WIDTH/2;
            if (targetHeight <= 10) {
                targetHeight = 10;
            }
            if (targetHeight > 90) {
                targetHeight = 90;
            }

            let row_stype = {
                width: "96%",

                flexDirection: "row",
                justifyContent: "center",
                display: "flex",

                marginLeft: 200,
                marginRight: 200,
                height: targetHeight
            };

            let new_display_row =
                <div style = {row_stype}>
                    {current_display_row}
                </div>
            display_row.push(new_display_row);

            // Building the margin on the display row
            let display_height = this.state.POGGER_SIG_WIDTH - 70;
            if (display_height < 45) {
                display_height = 45;
            }
            let style_display_row =
                {
                    height: display_height
                };

            let display_connection_row =
                <div style = {style_display_row} className = "poggersys_connection_display_row">

                </div>;

            display_row.push(display_connection_row);
        }

        this.setState({
            final_display_row: display_row,
            graph_array: GRAPH_LAYER_ARRAY
        });

        let ref = this;
        // This is the 'default' normal load time
        // Can be sped up by certain things...

        if (this.state.displayTimeout !== undefined)
            clearTimeout(this.state.displayTimeout);

        let displayDataTimeout = setTimeout(function() {
            ref.loadDisplayData();
        }, 500);

        this.setState({displayTimeout: displayDataTimeout});
    }

    processSVGData() {

        // We are only going to process if an adjustment has been made!

        /*

        if (!this.state.renderSVG) {
            let ref = this;
            setTimeout(function() {
                ref.processSVGData();
            }, 500);
            return;
        }

        if (this.renderSVGTimeout !== undefined)
            this.renderSVGTimeout.clearTimeout();

        */


        let containerHeight = 0;
        let containerWidth = 0;

        if (this.state.sig_holder !== undefined) {
            containerWidth = this.state.sig_holder.clientWidth;
            containerHeight = this.state.sig_holder.clientHeight;
        }

        // Determining the row style
        let targetHeight = this.state.POGGER_SIG_WIDTH/2;
        if (targetHeight <= 10) {
            targetHeight = 10;
        }
        if (targetHeight > 90) {
            targetHeight = 90;
        }


        let svg_lines = [];
        let GRAPH_LAYER_ARRAY = this.state.graph_array;

        // Iterating
        if (this.state.refObject !== undefined && Object.keys(this.state.refObject).length > 0) {
            for (let row = 1; row < GRAPH_LAYER_ARRAY.length; row++) {
                let current_row = GRAPH_LAYER_ARRAY[row];

                // Iterating on all of the elements in here
                for (let row_element_id in current_row) {
                    let row_element = GRAPH_LAYER_ARRAY[row][row_element_id];
                    let start_name = row_element['name'];
                    let end_name = row_element['parent'];

                    // Okay lets get the refs
                    let start_ref = this.state.refObject[start_name];
                    let end_ref = this.state.refObject[end_name];

                    if (start_ref === undefined || end_ref === undefined || start_ref === null || end_ref === null) {
                        let ref = this;
                        setTimeout(function() {
                            ref.processSVGData();
                        }, 100);
                        return;
                    }

                    start_ref = start_ref['current'];
                    end_ref = end_ref['current'];

                    if (start_ref === undefined || end_ref === undefined || start_ref === null || end_ref === null) {
                        let ref = this;
                        setTimeout(function() {
                            ref.processSVGData();
                        }, 100);
                        return;
                    }

                    // Determining start Y offset from the pogger sig width

                    // Getting positional data
                    let start_x = start_ref['offsetLeft'] + this.state.POGGER_SIG_WIDTH / 2;
                    let start_y = start_ref['offsetTop'] - (targetHeight / 2);

                    let end_x = end_ref['offsetLeft'] + this.state.POGGER_SIG_WIDTH / 2;
                    let end_y = end_ref['offsetTop'] + targetHeight + 9;

                    let lineOffset = 5;

                    // Determining the stroke datapoitns...
                    let init_sig = row_element['init_sig'];
                    let mass = init_sig['sig_mass'];
                    let lifespan = init_sig['sig_display_lifespan'];

                    // Turning to red for low mass
                    // Turning to orange for medium mass
                    // Turning to blue for high mass
                    let strokeColor = "#2979FF";
                    if (mass === "Destab") {
                        strokeColor = "#dd9637";
                    }
                    else if (mass === "Critical") {
                        strokeColor = "#dd2b28";
                    }

                    // Depending on lifespan, setting to full or dashed
                    let strokeDash = "";
                    if (lifespan === "Critical") {
                        strokeDash = "5,5";
                    }


                    // Drawing the line
                    let newLineUp = <line x1={start_x} y1={start_y} x2 = {start_x} y2 = {start_y - lineOffset} style = {{stroke: strokeColor, strokeDasharray: strokeDash, strokeWidth: 3}} />;
                    let newLineLeft = <line x1 = {start_x} y1 = {start_y - lineOffset} x2 = {end_x} y2 = {start_y - lineOffset} style = {{stroke: strokeColor, strokeDasharray: strokeDash, strokeWidth: 3}} />;
                    let newLineFinal = <line x1 = {end_x} y1 = {start_y - lineOffset} x2={end_x} y2={end_y} style = {{stroke: "#2979FF", strokeWidth: 3}} />;
                    svg_lines.push(newLineUp);
                    svg_lines.push(newLineLeft);
                    svg_lines.push(newLineFinal);
                }
            }
        }

        let display_svg = <svg  width = {containerWidth} height = {containerHeight} className = "displayCanvas">
            {svg_lines}
        </svg>;

        this.setState({svg: display_svg});
        let ref = this;
        setTimeout(function() {
            ref.processSVGData();
        }, 25);


        /*
        let renderSVGTimeoutFunction = setTimeout(function() {
            ref.setState({renderSVG: false});
        }, 500);

        this.setState({renderSVGTimeout: renderSVGTimeoutFunction});
        */
    }

    componentDidMount() {
        // Begin the processing...
        let ref = this;

        // Getting parent size
        let sig_hold = document.getElementById('sig_holder');
        this.setState({sig_holder: sig_hold});

        setTimeout(function() {
            ref.loadDisplayData();
            ref.processSVGData();
        }, 500);
    }

    render() {

        // If we do not have a top location selected, displaying direct option for selecting location
        if (this.props.displayAdd) {
            return (
                <div className = "poggersys_holder">
                    <div className = "no_selected_system_view">No Initialized View</div>
                    <div className = "no_selected_system_view_input_header">Type in the system name to create a view</div>

                    <div className = "text_field_holder_input_system">
                        <TextField value = {this.props.update_system_input} onChange = {(value) => {this.props.update_input_system(value)}} placeholder = "System Name" variant="filled" className = "input_no_selected_system"/>
                        <br /><br />
                        <TextField value = {this.props.update_system_nickname} onChange = {(value) => {this.props.update_nickname_system(value)}} placeholder = "Nickname" variant="filled" className = "input_no_selected_system"/>
                    </div>

                    <Button onClick = {() => {this.props.update_wormhole_mask()}} variant="contained" component="span" className="create_system_button">Create</Button>
                </div>
            )
        }

        return (
            <div className = "poggersys_holder"
                 onWheel = {(e) => {this.handleMouseScroll(e)}}
                 onMouseDown = { (e) => {this.handleMouseDown(e)} }
                 onMouseUp = { (e) => {this.handleMouseUp(e)} }
                 ref={ this.poggersys_view }
            >
                    {this.state.final_display_row}
                    {this.state.svg}
            </div>
        )
    }
}

class PoggerSystem extends React.Component {
    constructor(props) {
        super(props);

        this.localRef = React.createRef();
    }

    componentWillUpdate() {

        if (this.props.fake) {
            return;
        }

        if (this.props.location !== undefined && this.props.location['solarSystemName'] !== undefined)
            this.props.addNewRef(this.localRef, this.props.location['solarSystemName']);
        else if (this.props.parent_sig !== undefined && this.props.parent_sig['sig_id'] !== undefined) {
            this.props.addNewRef(this.localRef, this.props.parent_sig['sig_id']);
        }
        else if (this.props.parent_sig_id !== undefined) {
            this.props.addNewRef(this.localRef, this.props.parent_sig_id);
        }
        else {
            this.props.addNewRef(this.localRef, "UNKNOWN");
        }
    }

    render() {


        // Rendering the fake pogger systems
        let POGGERWIDTH = this.props.POGGER_SIG_WIDTH - 20;
        let POGGERHIDDENWIDTH = POGGERWIDTH / 2 + 10;

        let poggersys_style =
            {
                width: "90%",
                height: "100%"
            };
        let poggersys_style_hidden = {
            width: POGGERHIDDENWIDTH,
            height: "100%",
            maxWidth: POGGERHIDDENWIDTH,
            minWidth: POGGERHIDDENWIDTH
        };

        if (this.props.fake) {
            // Rendering fake poggerview

            return (
                <div className = "poggersys_system_hidden" style = {poggersys_style_hidden}>

                </div>
            )
        }

        let parent_sig_id = "";
        if (this.props.parent_sig !== undefined)
            parent_sig_id = this.props.parent_sig['sig_id_letter'];

        // Constructing the LRINT style
        let lrint_pixel_left = this.props.left * this.props.POGGER_SIG_WIDTH;
        let lrint_pixel_right = this.props.left * this.props.POGGER_SIG_WIDTH;
        let lrint_style = {
            marginLeft: 0,
            marginRight: 0,
            maxWidth: this.props.POGGER_SIG_WIDTH,
            minWidth: this.props.POGGER_SIG_WIDTH
        };


        // Custom styling based on pogger width
        let style_connections = {
            fontSize: 10
        };
        let style_system_type = {
            fontSize: 12
        };
        let style_inbound_sig = {
            width: POGGERWIDTH,
            fontSize: 14
        };
        let style_system_name = {
            fontSize: 16
        };
        let style_system_nickname = {

        };
        let style_sig_count = {

        };
        let style_sig_strength = {

        };
        let style_system_effect_image = {
            marginTop: 12,
            float: "left",
            marginTop: -1,
            marginLeft: 6,
            height: 15
        };
        let style_sig_statics = {
            fontSize: 14
        };

        if (POGGERWIDTH <= 60) {
            style_sig_statics = {
                fontSize: 0,
                marginTop: 2,
            };
            style_connections = {
                fontSize: 0,
                width: 30
            };
            style_system_type = {
                fontSize: 0
            };
            style_inbound_sig = {
                width: POGGERWIDTH,
                fontSize: 12,
                marginTop: -20,
                marginLeft: 5
            };
            style_system_name = {
                fontSize: 10
            };
            style_sig_strength = {
                fontSize: 0,
                display: "none"
            };
            style_sig_count = {
                fontSize: 0,
                display: "none"
            };
            style_system_effect_image = {
                width: 0,
                height: 0
            };

        }

        else if (POGGERWIDTH <= 75) {
            style_sig_statics = {
                fontSize: 7,
                marginTop: 2,
            };
            style_connections = {
                fontSize: 8,
                width: 30
            };
            style_system_type = {
                fontSize: 8
            };
            style_inbound_sig = {
                width: POGGERWIDTH,
                fontSize: 10,
                marginTop: -18
            };
            style_system_name = {
                fontSize: 10
            };
            style_sig_strength = {
                fontSize: 0,
                display: "none"
            };
            style_sig_count = {
                fontSize: 0,
                display: "none"
            };
            poggersys_style =
            {
                width: "90%",
                height: "100%",
                maxHeight: POGGERWIDTH / 2 + 10
            };
            style_system_effect_image = {
                width: 0,
                height: 0
            };

        }
        else if (POGGERWIDTH < 100) {
            style_connections = {
                fontSize: 8,
                width: 30
            };
            style_system_type = {
                fontSize: 8
            };
            style_inbound_sig = {
                width: POGGERWIDTH,
                fontSize: 10,
                marginTop: -18
            };
            style_system_name = {
                fontSize: 10
            };
            style_sig_strength = {
                fontSize: 0,
                display: "none"
            };
            style_sig_count = {
                fontSize: 0,
                display: "none"
            };
            style_sig_statics = {
                fontSize: 8
            };
            style_system_effect_image = {
                width: 0,
                height: 0
            };

        }
        else if (POGGERWIDTH < 125) {
            style_system_name = {
                fontSize: 12
            };
            style_sig_statics = {
                fontSize: 10
            };

        }

        // Checking if we are selected system
        let selected = "poggersys_system";
        //////console.log("CHECKING SELECTED");
        //////console.log(this.props.selected_system);
        //////console.log(this.props.system_name);
        if (this.props.selected_system === this.props.system_name) {
            selected = "poggersys_system sys_selected"
        }

        let nickname = null;
        if (this.props.location !== undefined && this.props.location['nickname'] != null) {
            nickname = this.props.location['nickname'];
        }

        // Building the expanded view
        let expand_view = null; /*
        <div className = "pogger_view_expand_view">
            <div className = "pogger_view_expand_view_arrow">
                <i className = "fa fa-chevron-right pogger_view_expand_view_arrow_icon"/>
            </div>
        </div>*/

        // Grabbing the destination type (if it exists)
        let wormhole_data = {};
        if (this.props.parent_sig !== undefined) {
            if (this.props.parent_sig['sig_wormhole_data'] !== undefined) {
                wormhole_data = JSON.parse(this.props.parent_sig['sig_wormhole_data']);
            }
        }


        // Displaying the number of connections
        let system_sig_name = "";
        if (this.props.parent_sig !== undefined) {
            system_sig_name = this.props.parent_sig['sig_id']
        }

        let display_system_type = this.props.system_type;
        if (wormhole_data['destination_type'] !== undefined && wormhole_data['destination_type'].length > 1) {
            display_system_type = wormhole_data['destination_type'];
        }

        // Displaying the effect
        let text_system_effect = this.props.system_effect;
        let display_system_effect = null;

        //
        if (1 === 2) {
            if (text_system_effect === "Black Hole")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_bh.png")}/>;
            else if (text_system_effect === "Cataclysmic Variable")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_capvar.png")}/>;
            else if (text_system_effect === "Wolf-Rayet")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_wr.png")}/>;
            else if (text_system_effect === "Red Giant")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_rg.png")}/>;
            else if (text_system_effect === "Pulsar")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_pulsar.png")}/>;
            else if (text_system_effect === "Magnetar")
                display_system_effect = <img className = "system_effect_image" src={require("../../assets/img/wh_mag.png")}/>;
        }
        else {
            if (text_system_effect === "Black Hole")
                display_system_effect =
                    <img className="system_effect_image" src={require("../../assets/img/wh_sym_black_hole.png")}/>;
            else if (text_system_effect === "Cataclysmic Variable")
                display_system_effect = <img className="system_effect_image"
                                             src={require("../../assets/img/wh_sym_cataclysmic_variable.png")}/>;
            else if (text_system_effect === "Wolf-Rayet")
                display_system_effect =
                    <img className="system_effect_image" src={require("../../assets/img/wh_sym_wolf_rayet.png")}/>;
            else if (text_system_effect === "Red Giant")
                display_system_effect =
                    <img className="system_effect_image" src={require("../../assets/img/wh_sym_red_giant.png")}/>;
            else if (text_system_effect === "Pulsar")
                display_system_effect =
                    <img className="system_effect_image" src={require("../../assets/img/wh_sym_pulsar.png")}/>;
            else if (text_system_effect === "Magnetar")
                display_system_effect =
                    <img className="system_effect_image" src={require("../../assets/img/wh_sym_magnetar.png")}/>;
        }

        // Checking if not wormhole
        if (this.props.location !== undefined && this.props.location['wormhole'] == null) {
            return (
                <div ref = {this.localRef} style = {lrint_style} className = "poggersys_system_container" >
                    <div className = {selected} onClick={(e) => {this.props.select(this.props.location['solarSystemName'], e)}} style = {poggersys_style}>
                        <div style = {style_inbound_sig} className = "poggersys_system_inbound_sig">{parent_sig_id}</div>
                        <div style = {style_system_type} className = "poggersys_system_type">{this.props.location['securityClass']}</div>
                        <div style = {style_connections} className = "poggersys_system_connections">{this.props.location['regionName']}</div>
                        <div style = {style_system_name} className = "poggersys_system_name">{this.props.location['solarSystemName']}</div>
                        <div style = {style_system_nickname} className = "poggersys_system_nickname">{nickname}</div>
                        {expand_view}
                    </div>
                </div>
            )
        }

        else if (this.props.location === undefined) {
            // Undefined wormhole display...
            return (
                <div ref = {this.localRef} style = {lrint_style} className = "poggersys_system_container">
                    <div className = {selected} style = {poggersys_style}>
                        <div style = {style_inbound_sig} className = "poggersys_system_inbound_sig">{parent_sig_id}</div>
                        <div style = {style_system_type} className = "poggersys_system_type">???</div>
                        <div style = {style_connections} className = "poggersys_system_connections">???</div>
                        <div style = {style_system_name} className = "poggersys_system_name">{display_system_type}</div>
                        <div style = {style_system_nickname} className = "poggersys_system_nickname"></div>
                        {expand_view}
                    </div>
                </div>
            )
        }

        // Building the static display text
        let statics = this.props.location['wormhole']['static']['statics'];

        let static_display_text = "";
        if (statics !== undefined) {
            static_display_text = [];
            for (let entry in statics) {
                let entry_value = statics[entry];
                let destination = entry_value['destination'];
                let name = entry_value['name'];

                if (destination === "Highsec")
                    destination = "HS"
                else if (destination === "Lowsec")
                    destination = "LS"
                else if (destination === "Nullsec")
                    destination = "NS"

                let custom_display_sig_style = destination + '' + "_style_display";

                let display_static_display_text =
                    <div className = {custom_display_sig_style + " poggersys_internal_static_display_list"}>{name + " " + destination}</div>;
                static_display_text.push(display_static_display_text);

            }
        }

        return (
            <div ref = {this.localRef} style = {lrint_style} className = "poggersys_system_container">
                <div className = {selected} onClick={(e) => {this.props.select(this.props.location['solarSystemName'], e)}} style = {poggersys_style}>
                    <div style = {style_inbound_sig} className = "poggersys_system_inbound_sig">{parent_sig_id}</div>
                    <div style = {style_system_type} className = "poggersys_system_type">{this.props.location['wormhole']['class']}</div>
                    <div style = {style_system_effect_image}>{display_system_effect}</div>
                    <div style = {style_connections} className = "poggersys_system_connections">0 Pilots</div>
                    <div style = {style_system_name} className = "poggersys_system_name">{this.props.location['solarSystemName']}</div>
                    <div style = {style_system_nickname} className = "poggersys_system_nickname">{nickname}</div>
                    <div style = {style_sig_count} className = "poggersys_system_sig_count">{this.props.system_sig_count}</div>
                    <div style = {style_sig_strength} className = "poggersys_system_scan_strength_level">%{this.props.system_sig_strength}</div>
                    <div style = {style_sig_statics} className = "poggersys_system_connections_detail">{static_display_text}</div>
                    {expand_view}
                </div>
            </div>
        )
    }
}