// Loading the react components
import React from 'react';
import keydown from 'react-keydown';

// CSS
import "../../css/pogger.css"
import PoggerView from './PoggerView';
import PoggerNotes from './PoggerNotes';
import PoggerSig from './PoggerSig';
import 'font-awesome/css/font-awesome.min.css';
import Icon from '@material-ui/core/Icon';

// Material UI
import Checkbox from '@material-ui/core/Checkbox';

// SET THIS FLAG TO TRUE WHEN READY
const ENABLE_AUTO_REFRESH = false;

// Exporting the base API url
const baseURL = "http://vs-eve.com:5000/";

export default class Poggers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Location based data
            location: null,
            settings: null,
            selected_system: null,
            sigs: {},
            sig_list_id: {},
            wormhole_data: {},
            wormhole_all_types_index: {},
            system_all_types: {},
            system_all_types_index: {},
            display_selected_sig: -1,
            sig_select_json: {},

            // Misc data
            selected_tab: 0,
            display_sidebar_info: false,
            most_recent_key_press: 0,

            // Data primarily pertaining to display
            chain: null,
            top_location: null,
            top_location_name: null,
            update_system_input: "",
            select_mask_index: 0,
            loaded: false,

            displayPopup: false,
            popupType: null,


            // Data relevant to making new sigs
            newSigID: "",
            newSigNum: "",
            newSigGroup: "",
            newSigName: "",
            newSigWormholeType: "",
            newSigWormholeLifeHours: "",
            newSigWormholeDestination: "",
            newSigWormholeDestinationClass: "",
            newSigMass: "Stable",
            newSigLifespan: "Stable",
            newSigDestinationType: ""
        };

        // Function binding
        this.check_selected = this.check_selected.bind(this);
        this.set_selected_system = this.set_selected_system.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.update_input_system = this.update_input_system.bind(this);
        this.update_wormhole_mask = this.update_wormhole_mask.bind(this);
        this.displayPoggerPopup = this.displayPoggerPopup.bind(this);
        this.updateNewSig = this.updateNewSig.bind(this);
        this.addNewSig = this.addNewSig.bind(this);
        this.refreshAllSigsLoop = this.refreshAllSigsLoop.bind(this);
        this.update_input_nickname = this.update_input_nickname.bind(this);
        this.set_selected_sig = this.set_selected_sig.bind(this);
        this.saveEditSig = this.saveEditSig.bind(this);
        this.handleUserPaste = this.handleUserPaste.bind(this);
        this.deleteSig = this.deleteSig.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.setSystemHomeSig = this.setSystemHomeSig.bind(this);
    }

    //////////////////////////////
    // Basic Sig Management ... //
    //////////////////////////////
    addNewSig() {
        // Function that will now, given our sig data, add it into the system :o
        // Deleting
        let ref = this;
        //console.log(this.state.update_system_input);

        // Building the wormhole data...
        let newSigWormholeData = {
            'wormhole_type': this.state.newSigWormholeType,
            'wormhole_destination': this.state.newSigWormholeDestination,
            'destination_class': this.state.newSigWormholeDestinationClass,
            'destination_type': this.state.newSigDestinationType
        };

        let minutes = 60 * this.state.newSigWormholeLifeHours;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            sig_id_num: this.state.newSigNum,
            sig_id_letter: this.state.newSigID,
            sig_type: this.state.newSigGroup,
            sig_name: this.state.newSigName,
            sig_age: minutes,
            sig_wormhole_data: JSON.stringify(newSigWormholeData),
            sig_system: this.state.selected_system,
            sig_mass: this.state.newSigMass,
            sig_display_lifespan: this.state.newSigLifespan,
            sig_destination_type: this.state.newSigDestinationType
        };

        fetch(baseURL+"sig/add", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            ref.refreshAllSigs();
        });
    }

    saveEditSig() {
        // Function that will now, given our sig data, add it into the system :o
        // Deleting
        let ref = this;
        //console.log(this.state.update_system_input);

        // Building the wormhole data...
        let newSigWormholeData = {
            'wormhole_type': this.state.newSigWormholeType,
            'wormhole_destination': this.state.newSigWormholeDestination,
            'destination_class': this.state.newSigWormholeDestinationClass,
            'destination_type': this.state.newSigDestinationType
        };

        // Setting to "" if our wormhole type is empty
        if (newSigWormholeData['wormhole_type'].length <= 0) {
            newSigWormholeData['destination_class'] = "";
        }

        let minutes = 60 * this.state.newSigWormholeLifeHours;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            sig_id_num: this.state.newSigNum,
            sig_id_letter: this.state.newSigID,
            sig_type: this.state.newSigGroup,
            sig_name: this.state.newSigName,
            sig_age: minutes,
            sig_wormhole_data: JSON.stringify(newSigWormholeData),
            sig_system: this.state.selected_system,
            sig_id: this.state.display_selected_sig,
            sig_mass: this.state.newSigMass,
            sig_display_lifespan: this.state.newSigLifespan,
        };

        fetch(baseURL+"sig/edit", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            ref.refreshAllSigs();
        });
    }

    deleteSig() {
        // Lets delete this sig...
        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            sig_id_list: this.state.sig_select_json
        };

        fetch(baseURL+"sig/delete", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            ref.refreshAllSigs();
        });

    }

    refreshAllSigs() {

        let ref = this;

        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
        };

        // We will be building TWO lists here
        // One where we identify sigs by ID
        // One where we identify sigs by system
        let sig_system_list = {};
        let sig_id_list = {};

        fetch(baseURL+"sig/get", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            //console.log(myJson);

            // Iterating on all sigs
            let output = myJson['data']

            for (let index in output) {
                let sig = output[index];
                //console.log(sig);
                let system = sig['sig_system'];
                let sig_id = sig['sig_id'];

                // Appending into the sig ID list
                sig_id_list[sig_id] = sig;

                // Checking if our system is contained within our sig_system_list
                if (sig_system_list.hasOwnProperty(system)) {
                    // Appending to existing list
                    sig_system_list[system][sig_id] = sig;

                }
                else {
                    sig_system_list[system] = {};
                    sig_system_list[system][sig_id] = sig;
                }
            }

            // Adjusting state
            ref.setState({
                sig_list_id: sig_id_list,
                sigs: sig_system_list
            });

            ref.get_chain("active");
        });
    }

    //////////////////////////////
    /// Modification functions ///
    //////////////////////////////
    set_selected_system(system, event) {

        if (this.state.display_sidebar_timeout !== undefined)
            clearTimeout(this.state.display_sidebar_timeout);

        if (this.state.selected_system === system)
            this.setState({selected_system: null, display_sidebar_info: false});
        else {
            let ref = this;
            let display_sidebar_time = setTimeout(function() {
                ref.setState({display_sidebar_info: true});
            }, 200);
            this.setState({selected_system: system, display_sidebar_timeout: display_sidebar_time});
        }
    }

    check_selected(system) {
        return (this.state.selected_system == system);
    }

    get_top_location() {
        return this.state.top_location;
    }

    update_input_system(system) {
        let val = system.target.value;

        //console.log("Updating value to " + val);
        this.setState({update_system_input: val})
    }

    set_selected_sig(sig_id) {

        // Getting the existing sig array
        let existing_sig_select_json = this.state.sig_select_json;
        let new_display_selected_sig = sig_id;


        if (sig_id === this.state.display_selected_sig) {
            new_display_selected_sig = -1;
        }

        // Checking for multiple select
        if (this.state.most_recent_key_press === 17) {

            if (existing_sig_select_json[sig_id] !== undefined && existing_sig_select_json[sig_id] !== null) {
                // Already exists!
                if (existing_sig_select_json[sig_id] === 1)
                    existing_sig_select_json[sig_id] = 0;
                else
                    existing_sig_select_json[sig_id] = 1
            }
            else {
                existing_sig_select_json[sig_id] = 1;
            }
            this.setState({sig_select_json: existing_sig_select_json, display_selected_sig: new_display_selected_sig});
        }
        else {
            // Simple select
            let new_sig_select_json = {};
            if (new_display_selected_sig !== -1) {
                new_sig_select_json[new_display_selected_sig] = 1;
            }

            this.setState({sig_select_json: new_sig_select_json, display_selected_sig: new_display_selected_sig});
        }
    }

    update_input_nickname(nickname) {
        let val = nickname.target.value;

        //console.log("Updating value to " + val);
        this.setState({update_system_nickname: val})
    }

    displayPoggerPopup(value, type) {
        this.setState({displayPopup: value, popupType: type});

        // Dealing with enabling the editing
        if (type === "edit") {
            // Moving this data into the newSig datalist because thats where we are putting it...
            let sig_data = this.state.sig_list_id[this.state.display_selected_sig];

            // Checking if we have wormhole data to edit...
            let wormhole_data = JSON.parse(sig_data['sig_wormhole_data']);
            //console.log(wormhole_data);

            let new_wormhole_destination = "";
            let new_wormhole_sig_type = "";
            let sig_destination_type = "";
            let new_destination_class = "";

            if ("wormhole_destination" in wormhole_data) {
                new_wormhole_destination = wormhole_data['wormhole_destination'];
            }
            if ("wormhole_type" in wormhole_data) {
                new_wormhole_sig_type = wormhole_data['wormhole_type'];
            }
            if ("destination_class" in wormhole_data) {
                new_destination_class = wormhole_data['wormhole_type'];
            }
            if ("destination_class" in wormhole_data) {
                sig_destination_type = wormhole_data['destination_type'];
            }

            this.setState({
                newSigID: sig_data['sig_id_letter'],
                newSigNum: sig_data['sig_id_num'],
                newSigGroup: sig_data['sig_type'],
                newSigName: sig_data['sig_name'],
                newSigWormholeType: new_wormhole_sig_type,
                newSigWormholeLifeHours: 24,
                newSigWormholeDestinationClass: new_destination_class,
                newSigWormholeDestination: new_wormhole_destination,
                newSigDestinationType: sig_destination_type
            })
        }

        if (type === "add") {
            // Deleting previous stuff
            this.setState({
                newSigID: "",
                newSigNum: "",
                newSigGroup: "",
                newSigName: "",
                newSigWormholeType: "",
                newSigWormholeLifeHours: "",
                newSigWormholeDestination: "",
                newSigDestinationType: ""
            });
        }
    }

    deleteSystemMask(systemName) {
        // Deleting
        let ref = this;
        //console.log(this.state.update_system_input)

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
                //console.log("Recieved setting data of ");
                //console.log(myJson);
                let settings_data = myJson['data'];
                //console.log("Recieved setting data of " + settings_data);
                ref.setState({settings: settings_data, selected_system: null});
            }
        });
    }

    setDisplayView(systemName, mask_index) {
        if (this.state.select_mask_index === mask_index) {
            return;
        }

        this.get_chain(systemName);
        let display_value = false;
        if (this.state.display_sidebar_info) {
            display_value = true;
        }

        this.setState({select_mask_index: mask_index, display_sidebar_info: display_value, top_location_name: systemName, selected_system: systemName});
        this.set_selected_system(systemName);
    }

    updateNewSig(type, value) {
        //console.log(value);
        if (type === 'group')
            this.setState({newSigGroup: value});
        else if (type === 'letter' && (this.state.newSigID.length < 3 || value.length < 3) ) {
            value = value.toUpperCase();
            this.setState({newSigID: value});
        }
        else if (type === 'number'  && (this.state.newSigNum.length < 3 || value.length < 3) )
            this.setState({newSigNum: value});
        else if (type === 'name')
            this.setState({newSigName: value});
        else if (type === 'newSigWormholeType' && value.length <= 4) {
            value = value.toUpperCase();
            this.setState({newSigWormholeType: value});
        }
        else if (type === "newSigWormholeLifeHours") {
            this.setState({newSigWormholeLifeHours: value});
        }
        else if (type === "newSigWormholeDestination") {
            this.setState({newSigWormholeDestination: value});
        }
        else if (type === "newSigWormholeDestinationClass") {
            this.setState({newSigWormholeDestinationClass: value});
        }
        else if (type === "display_mass") {
            this.setState({newSigMass: value});
        }
        else if (type === "display_lifespan") {
            this.setState({newSigLifespan: value});
        }
        else if (type === "destination_type") {
            this.setState({newSigDestinationType: value});
        }
    }

    display_sig_info() {
        alert("display_sig_info");
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
                //console.log(location_data);
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
                //console.log("Recieved setting data of " + settings_data);
                //console.log(settings_data);
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

        // Checking if we are getting chain of the active system
        if (input_name === "active") {
            if (this.state.top_location === null || this.state.top_location === undefined) {
                return;
            }

            input_name = this.state.top_location['solarSystemName'];
            if (input_name === null || input_name === undefined) {
                return;
            }

        }

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
                //console.log(location_data);
                location_data = location_data;
                ref.setState({location: location_data});
            }
        });
    }

    update_wormhole_mask() {

        let ref = this;
        //console.log(this.state.update_system_input);
        //console.log(this.state.update_system_nickname)

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code,
            system_name: this.state.update_system_input,
            system_nickname: this.state.update_system_nickname
        };

        fetch(baseURL+"setting/wormhole/add", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let settings_data = myJson['data'];
                //console.log("Recieved setting data of " + settings_data);
                ref.setState({settings: settings_data, top_location_name: ref.state.update_system_input});

                // Okay now lets get the full chain from the new system
                ref.get_chain(ref.state.update_system_input);

            }
        });
    }

    // Function that loads all of the wormhole types
    get_all_wormhole_types() {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        fetch(baseURL+"static/wormholes", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let wormhole_data = myJson['data'];

                let wormhole_indexed_data = {};
                for (let entry in wormhole_data) {
                    let entry_value = wormhole_data[entry];
                    wormhole_indexed_data[entry_value['name']] = entry_value;
                }

                // Indexing

                ref.setState({wormhole_all_types: wormhole_data, wormhole_all_types_index: wormhole_indexed_data})
            }
        });
    }

    get_all_systems() {

        let ref = this;

        // Getting the players most up-to-date location information
        let params = {
            character_id: this.props.character_id,
            character_auth_code: this.props.auth_code
        };

        fetch(baseURL+"static/systems", {
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            if (myJson['code'] == 200) {
                let system_data = myJson['data'];
                //console.log(system_data);

                let system_indexed_data = {};
                for (let entry in system_data) {
                    let entry_value = system_data[entry];
                    system_indexed_data[entry_value['solarSystemName']] = entry_value;
                }

                ref.setState({system_all_types: system_data, system_all_types_index: system_indexed_data});
            }
        });
    }

    onMouseEnterSigTabs(index) {
        this.setState({mouseHoverSigTabs: index});
    }

    onMouseLeaveSigTabs() {
        this.setState({mouseHoverSigTabs: -1})
    }

    handleUserPaste(data) {

        // Ignoring a paste if we have no selected system
        if (this.state.selected_system === null || this.state.selected_system === undefined || this.state.selected_system.length <= 0) {
            // NO PASTE
            return;
        }

        // Attempting to parse through the data now...
        // This will be frustrating a littlebit lol
        //console.log(data);
        let paste_data = data.split('\n');
        //console.log(paste_data);
        let upload_output = {};
        for (let line_index in paste_data) {
            // Getting the line
            let line = paste_data[line_index];

            // Error handling
            if (line === undefined) {
                continue;
            }

            let line_split_tabs = line.split('\t');

            // Error handling
            if (line_split_tabs.length !== 6) {
                continue;
            }

            // Okay we made it this far
            let id = line_split_tabs[0];
            let type = line_split_tabs[1];
            let group = line_split_tabs[2];
            let name = line_split_tabs[3];
            let scan_strength = line_split_tabs[4];

            // Building the output
            let tmp_output = {
                "id": id,
                "type": type,
                "group": group,
                "name": name,
                "scan_strength": scan_strength
            }

            upload_output[id] = tmp_output;
        }

        // Okay lets see
        // If our length is good, we will perform a mass upload
        if (Object.keys(upload_output).length > 0) {
            // UPLOADING TO MASS UPLOAD SYSTEM!
            let ref = this;

            let handlePasteRemoveMissing = window.confirm("Delete missing sigs?");
            let delete_type = "none";
            if (handlePasteRemoveMissing) {
                delete_type = "missing";
            }

            let params = {
                character_id: this.props.character_id,
                character_auth_code: this.props.auth_code,
                sig_list: upload_output,
                system: this.state.selected_system,
                delete: delete_type
            };

            fetch(baseURL+"sig/add_multiple", {
                method: "POST",
                body: JSON.stringify(params)
            }).then(function(response) {
                return response.json();
            }).then(function(myJson) {
                //console.log(myJson);
                ref.refreshAllSigs();
            });
        }
    }

    // Handling when someone has decided to set the home sig for a system..
    setSystemHomeSig(sig_id) {
        console.log(sig_id);
        console.log(this.state.sig_list_id);
        console.log(this.state.chain);
        console.log("Setting home sig of " + this.state.selected_system + " to " + this.state.sig_list_id[sig_id]);
    }

    ///////////////
    // Mounting //
    //////////////
    componentDidMount() {
        // Lets update our location based information
        document.title = "ＶＳ -    Pogger";

        this.get_location();
        this.get_user_options();
        this.get_all_wormhole_types();
        this.refreshAllSigsLoop();

        // Adding the user paste...
        let ref = this;
        document.addEventListener('paste', function (evt) {
            ref.handleUserPaste(evt.clipboardData.getData('text/plain'));
        });
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyDownHandler, false);
        document.removeEventListener("keyup", this.keyUpHandler, false);
    }

    // Handling changing tabs for the options tab
    handleTabChange(event, value) {
        this.setState({selected_tab: value})
    }

    ///////////////////////
    // Advanced Mounting //
    ///////////////////////
    refreshAllSigsLoop() {
        this.refreshAllSigs();

        if (!ENABLE_AUTO_REFRESH)
            return;

        let ref = this;
        setTimeout(function() {
            ref.refreshAllSigsLoop();
        }, 5000)
    }

    //////////////////
    // Key Handling //
    //////////////////
    keyUpHandler(event) {
        this.setState({most_recent_key_press: null});
    }

    keyDownHandler(event) {

        // Checking for holding down keys
        if (event.keyCode === this.state.most_recent_key_press) {
            return;
        }

        // Checking for escape button
        if (event.keyCode === 27) {
            this.handleEscape();
            return null;
        }

        // Checking for control-a
        else if (event.keyCode === 65 && this.state.most_recent_key_press === 17) {
            this.handleControlA();
        }

        // Checking for enter
        else if (event.keyCode === 13) {
            // Handling enter
            this.handleEnter();
        }

        // Making sure we are updating our most recent
        this.setState({most_recent_key_press: event.keyCode});
    }

    handleControlA() {
        // Function for handling control A...
        // Lets make sure we aren't in any sort of popup
        if (this.state.displayPopup === false && this.state.selected_system !== null && this.state.selected_system !== undefined) {
            // Okay not in a popup
            // Why not; lets enable all the sigs in our selected view
            let selected_system = this.state.selected_system;
            let all_system_sigs = this.state.sigs[selected_system];

            let select_sig_list = {};
            let sig = 0;
            for (sig in all_system_sigs) {
                // Lets build the new selected sig list
                select_sig_list[sig] = 1;
            }

            this.setState({display_selected_sig: sig, sig_select_json: select_sig_list});
        }
    }

    handleEnter() {
        if (this.state.display_selected_sig !== -1) {
            this.displayPoggerPopup(true, 'edit');
        }
    }

    handleEscape() {
        // Deciding what to do if someone pressed the escape button...
        if (this.state.displayPopup) {
            this.setState({displayPopup: false});
            return null;
        }
        else if (this.state.display_selected_sig !== -1) {
            this.setState({
                display_selected_sig: -1,
                sig_select_json: {}
            })
        }
    }


    ///////////////////////
    /// Render Function ///
    ///////////////////////

    render() {

        //console.log(this.state.sig_select_json);

        // Determining from options what our top location is
        let top_location = this.get_top_location();

        // Some display info
        let displayAdd = false;

        // Getting tab value
        let tab_value = this.state.selected_tab;
        let active_tab = [];
        active_tab[tab_value] = "active_tab";

        // Building the list of sig tabs to display, from the given wormhole options
        let sig_tab = [];

        if (this.state.settings != null) {
            //console.log("Settings")
            //console.log(this.state.settings);
            let wormhole_mask = this.state.settings['wormhole_mask'];
            //console.log(wormhole_mask);

            let index_val = 0;
            
            for (let entry in wormhole_mask) {
                //console.log(entry);

                let active_tab = "";
                if (this.state.select_mask_index == entry) {
                    active_tab = "active_sig_tab"
                }

                let tmp_index_val = index_val;
                

                let sig_tab_holder_tab = "sig_tab_holder_tab";
                let sig_jtag = null;
                if (entry === this.state.mouseHoverSigTabs) {
                    sig_tab_holder_tab = "sig_tab_holder_tab_MAX";
                    sig_jtag = <div className = "sig_tab_holder_tab_system_name">{wormhole_mask[entry]['systemName']}</div>;
                }
                let tab =
                    <div
                        onClick = {() => {this.setDisplayView(wormhole_mask[entry]['systemName'],tmp_index_val)}}
                        className = {sig_tab_holder_tab +" "+ active_tab}
                        onMouseEnter={() => {this.onMouseEnterSigTabs(entry)}}
                        onMouseLeave={() => {this.onMouseLeaveSigTabs()}}
                    >
                        <i onClick = {() => {this.deleteSystemMask(wormhole_mask[entry]['systemName'])}}className = "fa fa-trash sig_trash_icon" />
                        <div className = "sig_tab_holder_tab_nickname">{wormhole_mask[entry]['systemNickname']}</div>
                        {sig_jtag}
                        &nbsp;&nbsp;
                    </div>;
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

        // // // // // // // // // // // // // // // // // // // // // // // // // //
        // HERE WE CHECK IF WE ARE DISPLAYING FULL POGGERS VIEW OR SIMPLIFIED VIEW //
        let pogger_sig_holder_class_name = "sig_holder";
        let pogger_info_holder =
        <div className = "info_holder">
            <div className = "sig_list_holder">
                <SigList
                    selected_sig = {this.state.display_selected_sig}
                    set_selected_sig = {this.set_selected_sig}
                    displayPoggerPopup = {this.displayPoggerPopup}
                    selected_system = {this.state.selected_system}
                    system_sigs = {this.state.sigs[this.state.selected_system]}
                    chain = {this.state.chain}
                    handle_paste = {this.handleUserPaste}
                    deleteSig = {this.deleteSig}
                    display_sig_info = {this.display_sig_info}
                    sig_select_json = {this.state.sig_select_json}
                    setSystemHomeSig = {this.setSystemHomeSig}
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

        if ( (this.state.selected_system === null || this.state.selected_system === undefined || this.state.selected_system.length <= 0)) {
            pogger_sig_holder_class_name = "sig_holder_max";
            pogger_info_holder = null;
        }

        if (this.state.display_sidebar_info === false) {
            pogger_info_holder = null;
        }

        return (
            <div className = "main_holder" >
                <div className = "sig_tab_holder">
                    {sig_tab}
                </div>
                <div id = "sig_holder" className = {"sig_holder " + pogger_sig_holder_class_name}>
                    <PoggerView 
                        location = {this.state.location} 
                        top_location = {top_location}
                        options = {this.state.options} 
                        sig_data = {this.state.sig_data}

                        sigs_list_system = {this.state.sigs}
                        sig_list_id = {this.state.sig_list_id}
                        set_selected_system = {this.set_selected_system}
                        selected_system = {this.state.selected_system}
                        chain = {this.state.chain}

                        update_input_system = {this.update_input_system}
                        update_nickname_system = {this.update_input_nickname}

                        update_system_nickname = {this.state.update_system_nickname}
                        update_system_input = {this.state.update_system_input}


                        update_wormhole_mask = {this.update_wormhole_mask}
                        displayAdd = {displayAdd}
                    />
                </div>
                
                {pogger_info_holder}

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
                    newSigWormholeType = {this.state.newSigWormholeType}
                    newSigWormholeLifeHours = {this.state.newSigWormholeLifeHours}
                    newSigWormholeDestination = {this.state.newSigWormholeDestination}
                    newSigMass = {this.state.newSigMass}
                    newSigLifespan = {this.state.newSigLifespan}
                    newSigDestinationType = {this.state.newSigDestinationType}

                    updateNewSig = {this.updateNewSig}

                    wormhole_all_types = {this.state.wormhole_all_types}
                    wormhole_all_types_index = {this.state.wormhole_all_types_index}
                    system_all_types = {this.state.system_all_types}
                    system_all_types_index = {this.state.system_all_types_index}

                    addNewSig = {this.addNewSig}
                    saveEditSig = {this.saveEditSig}
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
        let edit = null;
        let add =
        <div onClick={() => {this.props.displayPoggerPopup(true, 'add')}} className = "sig_options_header_holder">
            <i className={"fa fa-plus options_icon"}/> &nbsp;
            <div className = "sig_options_header_text">Add</div>
        </div>;

        let delete_obj = null;
        let from_clipboard = null; /*
        <div className = "sig_options_header_holder">
            <i onClick = {() => {this.props.handle_paste()}} className={"fa fa-clipboard options_icon"} />&nbsp;
            <div className = "sig_options_header_text">Paste</div>
        </div>;*/

        if (this.props.selected_system != null) {
            selected_style_sys = "";
        }

        if (this.props.selected_sig > 0) {
            selected_style_sig = "option";
            edit =
            <div onClick = {() => {this.props.displayPoggerPopup(true, 'edit')}} className = "sig_options_header_holder">
                <i className={"fa fa-edit options_icon " + selected_style_sig} /> &nbsp;
                <div className = "sig_options_header_text">Edit</div>
            </div>;
            delete_obj =
            <div onClick = {() => {this.props.deleteSig()}} className = "sig_options_header_holder">
                <i className={"fa fa-trash options_icon " + selected_style_sig} />&nbsp;
                <div className = "sig_options_header_text">Delete</div>
            </div>;


        }
        
        return (
            <div className = "sigOptionsHeaderHolderMain">
                <div className = "sigOptionsHeaderHolder">
                    {add}
                    {from_clipboard}
                    {edit}
                    {delete_obj}

                </div>

                <div className = "sigOptionsHeaderHolder">
                    <div className = "sig_options_header_holder" style = {{fontSize: 18}}>
                        <Checkbox style = {{marginTop: -5}}/>

                        <i className = "fa fa-trash sig_trash_icon"
                            style = {{color: "black", paddingLeft: 2, marginTop: 3}}
                        />

                        <div style = {{marginTop: 0, marginLeft: 5}}>
                            Autodelete
                        </div>
                    </div>

                    <div className = "sig_options_header_holder" style = {{fontSize: 18}}>
                        <Checkbox style = {{marginTop: -5}}/>

                        <i className = "fa fa-compass sig_trash_icon"
                           style = {{color: "black", paddingLeft: 2, marginTop: 4}}
                        />

                        <div style = {{marginTop: 0, marginLeft: 7}}>
                            Track
                        </div>
                    </div>
                </div>
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

        let selected_system = this.props.selected_system;
        if (this.props.selected_system == null) {
            selected_system = "No System Selected"
        }

        // Building the sig list

        let sig_list = [];

        //console.log("SIG INSIDE SIG LIST");
        //console.log(this.props.system_sigs);
        //console.log(this.props.selected_system);

        if (this.props.selected_system !== null && this.props.system_sigs !== null) {

            for (let sig_id in this.props.system_sigs) {
                let sig = this.props.system_sigs[sig_id];
                let sig_wormhole_data = sig['sig_wormhole_data'];
                sig_wormhole_data = JSON.parse(sig_wormhole_data);

                let init_date = sig['sig_init'];

                init_date.replace(" ",":");
                init_date = init_date + '.000Z';
                init_date = new Date(init_date);
                let now = new Date();
                ////console.log(init_date);
                ////console.log(now);

                let diff = now - init_date;
                let minutes = Math.floor(diff / 1000 / 60);

                let age_minutes = sig['sig_age'];

                let remaining_age = age_minutes - minutes;

                if (age_minutes === 0) {
                    // Okay, we do NOT want to display it like this...
                    remaining_age = minutes - age_minutes;
                }

                let sig_age = "";
                let hours = Math.floor( remaining_age / 60 );
                remaining_age = remaining_age - (60 * hours);
                if (remaining_age < 10) {
                    remaining_age = "0" + remaining_age;
                }

                sig_age = sig_age + hours + ":" + remaining_age;

                let sig_name = sig['sig_name'];
                if (sig_name.length <= 0 || sig_name === "Unstable Wormhole") {
                    sig_name = sig_wormhole_data['wormhole_destination'];
                }

                // Scan Strength datapoints
                let scan_strength = "" + sig['sig_scan_strength'];
                if (scan_strength === "0") {
                    scan_strength = "00.0"
                }
                else if (parseInt(scan_strength) < 10) {
                    scan_strength = "0" + scan_strength;
                }

                // Checking for .
                if (scan_strength.indexOf(".") === -1) {
                    scan_strength = scan_strength + ".0"
                }



                sig_list.push(
                <SigListEntry
                    sig_tag = {sig['sig_id_letter'] + "-" + sig['sig_id_num']}
                    sig_type = {sig['sig_type']}
                    sig_id = {sig_id}
                    display_sig_info = {this.props.display_sig_info}
                    sig_max_age = {sig['sig_age']}
                    age = {sig_age}
                    chain = {this.props.chain}
                    sig_select_json = {this.props.sig_select_json}
                    sig_name = {sig_name}
                    sig_wh = {sig_wormhole_data['wormhole_type']}
                    set_selected_sig = {this.props.set_selected_sig}
                    selected_sig = {this.props.selected_sig}
                    scan_strength = {scan_strength}
                    system_home_sig_json = {null}
                    setSystemHomeSig = {this.props.setSystemHomeSig}
                />)
            }
        }

        ////console.log(sig_list);

        return (
            <div className = "sig_list_main">
                <div className = "sig_selected_system">Editing: {selected_system} Pilot: {selected_system}</div>
                <SigOptionsHeader
                    selected_sig = {this.props.selected_sig}
                    deleteSig = {this.props.deleteSig}
                    displayPoggerPopup = {this.props.displayPoggerPopup}
                    selected_system = {this.props.selected_system}
                    handle_paste = {this.props.handle_paste}
                />
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
                <div className = "sig_list_header_tab_scan_strength">%</div>
                <div className = "sig_list_header_tab">ID</div>
                <div className = "sig_list_header_tab">Type</div>
                <div className = "sig_list_header_tab_age">Age</div>
                <div className = "sig_list_header_tab_name">Name</div>
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
        let sig_list_entry_class = "sig_list_entry";
        if (this.props.selected_sig === this.props.sig_id) {
            sig_list_entry_class = "sig_list_entry_active";
        }

        // Checking for selected json array...
        if (this.props.sig_select_json[this.props.sig_id] === 1) {
            sig_list_entry_class = "sig_list_entry_active";
        }

        let sig_age_direction = <i className = "fa fa-chevron-down" style = {{textAlign: "right", marginLeft: 2, marginRight: 2, float: "right", color: "#FF8888"}}/>;
        if (this.props.sig_max_age === 0) {
            sig_age_direction = <i className = "fa fa-chevron-up" style = {{textAlign: "right", marginLeft: 2, marginRight: 2, float: "right", color: "#88FF88"}}/>;
        }

        let sig_name = this.props.sig_name;

        // Custom styling of the type based on the type
        let custom_type_style = "sig_list_type_" + this.props.sig_type;

        // Parsing and displaying if scan strength is good enough!
        let scan_strength = this.props.scan_strength;
        scan_strength = parseInt(scan_strength.substring(0, scan_strength.indexOf(".")));

        let scan_strength_class = "scan_strength_0";
        if (scan_strength >= 100) {
            scan_strength_class = "scan_strength_100";
        }

        // Determining if we get to display the home button
        let sig_home_button = null;
        if (this.props.system_home_sig_json === null && (this.props.sig_type === "Unknown" || (this.props.sig_type === "Wormhole" && (this.props.sig_name === undefined || this.props.sig_name.length <= 0) ))) {
            sig_home_button =
            <i onClick = {() => {this.props.setSystemHomeSig(this.props.sig_id)}} className = "fa fa-home sig_list_set_home_data" style = {{marginRight: 5, color: "gray"}} />;
        }

        let info_icon = <i onClick = {() => {this.props.display_sig_info()}} className = "fa fa-info info_icon_sig_list_entry" style = {{marginRight: 5, color: "gray"}}/>

        return (
            <div className = {sig_list_entry_class} onClick = {() => {this.props.set_selected_sig(this.props.sig_id)}}>
                <div className = {"sig_list_header_tab_scan_strength_entry " + scan_strength_class}>{info_icon}{this.props.scan_strength}%</div>
                <div className = "sig_list_entry_text">{this.props.sig_tag}</div>
                <div className = {custom_type_style + " sig_list_entry_text"}>{this.props.sig_type}</div>
                <div className = "sig_list_entry_text_age">{this.props.age}{sig_age_direction}</div>
                <div className = "sig_list_entry_text_name">{sig_home_button}{sig_name}</div>
                <div className = "sig_list_entry_text_hole">{this.props.sig_wh}</div>
            </div>
        )
    }
}

class SideAlert extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "poggerside_main_holder">

            </div>
        )
    }
}