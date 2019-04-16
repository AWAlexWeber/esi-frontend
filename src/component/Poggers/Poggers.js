// Loading the react components
import React from 'react';

// CSS
import "../../css/pogger.css"
import PoggerView from './PoggerView';
import PoggerNotes from './PoggerNotes';
import PoggerSig from './PoggerSig';
import 'font-awesome/css/font-awesome.min.css';
import Icon from '@material-ui/core/Icon';

// Material UI

// Exporting the base API url
const baseURL = "http://13.57.164.44:5000/";

export default class Poggers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            location: null,
            settings: null,
            selected_system: null,
            sigs: {},

            selected_tab: 0,
            chain: null,
            top_location: null,
            top_location_name: null,
            update_system_input: "",
            select_mask_index: 0,
            loaded: false,

            displayPopup: false,
            popupType: null,

            newSigID: "",
            newSigNum: "",
            newSigGroup: "",
            newSigName: ""
        }

        // Function binding
        this.check_selected = this.check_selected.bind(this);
        this.set_selected_system = this.set_selected_system.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.update_input_system = this.update_input_system.bind(this);
        this.update_wormhole_mask = this.update_wormhole_mask.bind(this);
        this.displayPoggerPopup = this.displayPoggerPopup.bind(this);
        this.updateNewSig = this.updateNewSig.bind(this);
    }

    //////////////////////////////
    /// Modification functions ///
    //////////////////////////////
    set_selected_system(system) {
        if (this.state.selected_system == system) 
            this.setState({selected_system: null})
        else
            this.setState({selected_system: system});
    }

    check_selected(system) {
        return (this.state.selected_system == system);
    }

    get_top_location() {
        return this.state.top_location;
    }

    update_input_system(system) {
        let val = system.target.value;

        console.log("Updating value to " + val);
        this.setState({update_system_input: val})
    }

    displayPoggerPopup(value, type) {
        console.log("Setting popup to " + value + " , " + type);
        this.setState({displayPopup: value, popupType: type});
    }

    deleteSystemMask(systemName) {
        // Deleting
        let ref = this;
        console.log(this.state.update_system_input)

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            system_name: systemName
        };

        fetch(baseURL+"setting/wormhole/delete", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let settings_data = myJson['data'];
                console.log("Recieved setting data of " + settings_data);
                ref.setState({settings: settings_data, selected_system: null});
            }
        });
    }

    setDisplayView(systemName, mask_index) {
        this.get_chain(systemName);
        this.setState({select_mask_index: mask_index, top_location_name: systemName, selected_system: null});
    }

    updateNewSig(type, value) {
        console.log(value);
        if (type == 'group')
            this.setState({newSigGroup: value});
        else if (type == 'letter' && (this.state.newSigID.length < 3 || value.length < 3) ) {
            value = value.toUpperCase();
            this.setState({newSigID: value});
        }
        else if (type == 'number'  && (this.state.newSigNum.length < 3 || value.length < 3) )
            this.setState({newSigNum: value});
        else if (type == 'name')
            this.setState({newSigName: value});
    }

    ///////////////////////////////////////
    // Functions used for helper reasons //
    ///////////////////////////////////////
    get_location() {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            refresh_type: "Normal"
        };

        fetch(baseURL+"location/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let location_data = myJson['data'];
                console.log(location_data);
                location_data = location_data;
                ref.setState({location: location_data, loaded: true});
            }
        });

    }

    // Function for getting user options
    get_user_options() {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            refresh_type: "Normal"
        };

        fetch(baseURL+"setting/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 5) {
                return;
            }
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let settings_data = myJson['data'];
                console.log("Recieved setting data of " + settings_data);
                console.log(settings_data);
                let wormhole_mask = settings_data['wormhole_mask']
                if (wormhole_mask.length > 0) {
                    // Okay loading chain from this...
                    ref.get_chain(wormhole_mask[0]['systemName']);
                }

                // Checking if the user has given us an actual system to load
                
                ref.setState({settings: settings_data});
            }
        });
    }

    // Function for getting the chain
    get_chain(input_name) {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            system_name: input_name,
            refresh_type: "Normal"
        };

        fetch(baseURL+"chain/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            if (response.length <= 0) {
                return;
            }
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let chain_data = myJson['data'];
                console.log("C H A I N");
                console.log(chain_data);
                console.log(ref.state.top_location_name);
                chain_data = chain_data;

                // If we have a non-null location based data, lets set that...
                if (ref.state.top_location_name != null) {
                    let top_location_value = chain_data[ref.state.top_location_name];
                    ref.setState({chain: chain_data, top_location: top_location_value});
                }
                else if (ref.state.settings != null) {
                    // Loading from mask instead...
                    let top_name = ref.state.settings['wormhole_mask'][0]['systemName']
                    let top_location_value = chain_data[top_name];
                    ref.setState({chain: chain_data, top_location: top_location_value});
                }
                else {
                    ref.setState({chain: chain_data});
                }
            }
        });
    }

    // Function for getting all of the characters linked locations
    get_all_locations() {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            refresh_type: "Normal"
        };

        fetch(baseURL+"location/get/all", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let location_data = myJson['data'];
                console.log(location_data);
                location_data = location_data;
                ref.setState({location: location_data});
            }
        });
    }

    update_wormhole_mask() {

        let ref = this;
        console.log(this.state.update_system_input)

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            system_name: this.state.update_system_input
        };

        fetch(baseURL+"setting/wormhole/add", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let settings_data = myJson['data'];
                console.log("Recieved setting data of " + settings_data);
                ref.setState({settings: settings_data, top_location_name: ref.state.update_system_input});

                // Okay now lets get the full chain from the new system
                ref.get_chain(ref.state.update_system_input);

            }
        });
    }

    ///////////////
    // Mounting //
    //////////////
    componentDidMount() {
        // Lets update our location based information
        this.get_location();
        this.get_user_options();
    }

    // Handling changing tabs for the options tab
    handleTabChange(event, value) {
        this.setState({selected_tab: value})
    }

    ///////////////////////
    /// Render Function ///
    ///////////////////////

    render() {

        // Determining from options what our top location is
        let top_location = this.get_top_location();

        // Some display info
        let displayAdd = false;

        // Getting tab value
        let tab_value = this.state.selected_tab;
        let active_tab = [];
        active_tab[tab_value] = "active_tab";

        // Building the list of sig tabs to display, from the given wormhole options
        let sig_tab = []

        if (this.state.settings != null) {
            console.log("Settings")
            console.log(this.state.settings);
            let wormhole_mask = this.state.settings['wormhole_mask'];
            console.log(wormhole_mask);

            let index_val = 0;
            
            for (let entry in wormhole_mask) {
                console.log(entry);

                let active_tab = ""
                if (this.state.select_mask_index == entry) {
                    active_tab = "active_sig_tab"
                }

                let tmp_index_val = index_val;
                

                let tab = <div onClick = {() => {this.setDisplayView(wormhole_mask[entry]['systemName'],tmp_index_val)}} className = {"sig_tab_holder_tab " + active_tab}>{wormhole_mask[entry]['systemName']}&nbsp;&nbsp;<i onClick = {() => {this.deleteSystemMask(wormhole_mask[entry]['systemName'])}}className = "fa fa-trash" /></div>;
                sig_tab.push(tab);
                index_val = index_val + 1;
            }

            // Adding the plus to the end
            if (sig_tab.length > 0)
                sig_tab.push(<div onClick = {() => {this.setState({select_mask_index: index_val})}} className = {"sig_tab_holder_tab"}>+</div>);
        }

        if (this.state.select_mask_index == sig_tab.length - 1 || sig_tab.length <= 0 && this.state.loaded) {
            displayAdd = true;
        }

        return (
            <div className = "main_holder">
                <div className = "sig_tab_holder">
                    {sig_tab}
                </div>
                <div className = "sig_holder">
                    <PoggerView 
                        location = {this.state.location} 
                        top_location = {top_location}
                        options = {this.state.options} 
                        sig_data = {this.state.sig_data}
                        set_selected_system = {this.set_selected_system}
                        selected_system = {this.state.selected_system}
                        chain = {this.state.chain}
                        update_input_system = {this.update_input_system}
                        update_system_input = {this.state.update_system_input}
                        update_wormhole_mask = {this.update_wormhole_mask}
                        displayAdd = {displayAdd}
                    />
                </div>
                
                <div className = "info_holder">
                    <div className = "sig_list_holder">
                        <SigList 
                            displayPoggerPopup = {this.displayPoggerPopup} 
                            selected_system = {this.state.selected_system} 
                            system_sigs = {this.state.sigs[this.state.selected_system]}
                            chain = {this.state.chain}
                        />
                    </div>

                    <div className = "lower_options_tab">
                        <div className = "lower_options_tabs">
                            <div onClick = {() => {this.handleTabChange(0,0)}} className = {"lower_options_tab_obj " + active_tab[0]}><i className={"fa fa-sticky-note"}/>&nbsp; Notes</div>
                            <div onClick = {() => {this.handleTabChange(0,1)}} className = {"lower_options_tab_obj " + active_tab[1]}><i className={"fa fa-list"}/>&nbsp; Details</div>
                            <div onClick = {() => {this.handleTabChange(0,2)}} className = {"lower_options_tab_obj " + active_tab[2]}><i className={"fa fa-hourglass"}/>&nbsp; History</div>
                        </div>
                        {tab_value === 0 && <PoggerNotes></PoggerNotes>}
                        {tab_value === 1 && <PoggerNotes></PoggerNotes>}
                        {tab_value === 2 && <PoggerNotes></PoggerNotes>}
                    </div>
                </div>

                <PoggerSig 
                    location = {this.state.location} 
                    top_location = {top_location}
                    options = {this.state.options} 
                    sig_data = {this.state.sig_data}
                    set_selected_system = {this.set_selected_system}
                    selected_system = {this.state.selected_system}
                    chain = {this.state.chain}
                    update_input_system = {this.update_input_system}
                    update_system_input = {this.state.update_system_input}
                    update_wormhole_mask = {this.update_wormhole_mask}
                    displayPopup = {this.state.displayPopup}
                    popupType = {this.state.popupType}
                    displayPoggerPopup = {this.displayPoggerPopup}

                    character_id = {this.props.character_id}
                    character_auth_code = {this.props.character_auth_code}

                    newSigID = {this.state.newSigID}
                    newSigNum = {this.state.newSigNum}
                    newSigName = {this.state.newSigName}
                    newSigGroup = {this.state.newSigGroup}

                    updateNewSig = {this.updateNewSig}
                />
            </div>
        )
    }
}

// Sig Options Header
class SigOptionsHeader extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        let selected_style_sys = "option_disabled";
        let selected_style_sig = "option_disabled";
        let edit = null
        let delete_obj = null;

        if (this.props.selected_system != null) {
            selected_style_sys = "";
        }

        if (false) {
            edit = <i onClick = {() => {this.props.displayPoggerPopup(true, 'edit')}} class={"fa fa-edit options_icon " + selected_style_sig}>&nbsp; Edit</i>;
            delete_obj = <i onClick = {() => {this.props.displayPoggerPopup(true, 'delete')}} class={"fa fa-trash options_icon " + selected_style_sig}>&nbsp; Delete</i>;
        }
        
        return (
            <div className = "sigOptionsHeaderHolder">
                <i onClick = {() => {this.props.displayPoggerPopup(true, 'add')}} class={"fa fa-plus options_icon " + selected_style_sys}>&nbsp; Add</i>
                {edit}
                {delete_obj}
                
            </div>
        )
    }
}

// Sig List Class
class SigList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let selected_system = "Selected " + this.props.selected_system;
        if (this.props.selected_system == null) {
            selected_system = "No System Selected"
        }

        // Building the sig list

        let sig_list = []

        if (this.props.selected_system != null && this.props.system_sigs != null) {
            for (let i = 0; i < this.props.system_sigs.length; i++) {
                let sig = this.props.system_sigs[i];
                sig_list.push(<SigListEntry sig_tag = "ABC-123" sig_type = "Wormhole" age = "16:51" sig_name = "Wormhole" sig_wh = "N766"/>)
            }
        }

        return (
            <div className = "sig_list_main">
                <div className = "sig_selected_system">{selected_system}</div>
                <SigOptionsHeader displayPoggerPopup = {this.props.displayPoggerPopup} selected_system = {this.props.selected_system}/>
                <SigListHeader />

                <div className = "sig_scroll_view">
                    {sig_list}
                </div>
                
            </div>
        )
    }
}

class SigListHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "sig_list_header">
                <div className = "sig_list_header_tab">ID</div>
                <div className = "sig_list_header_tab">Type</div>
                <div className = "sig_list_header_tab">Age</div>
                <div className = "sig_list_header_tab">Name</div>
                <div className = "sig_list_header_tab">Hole</div>
            </div>
        )
    }
}

class SigListEntry extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "sig_list_entry">
                <div className = "sig_list_entry_text">{this.props.sig_tag}</div>
                <div className = "sig_list_entry_text">{this.props.sig_type}</div>
                <div className = "sig_list_entry_text">{this.props.age}</div>
                <div className = "sig_list_entry_text">{this.props.sig_name}</div>
                <div className = "sig_list_entry_text">{this.props.sig_wh}</div>
            </div>
        )
    }
}