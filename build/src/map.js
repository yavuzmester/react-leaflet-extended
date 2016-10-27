"use strict";

const RL_Map = require("react-leaflet").Map;
const L = require("leaflet");

class Map extends RL_Map {
    //react-leaflet puts "map" on state, we prevent it by overriding setState.
    setState(obj /*: Object */) {
        const newObj = _.omit(obj, "map");

        if (Object.keys(newObj).length > 0) {
            super.setState(newObj);
        }
    }

    componentDidUpdate(prevProps /*: object */) {
        //Do nothing here, as it seems we are better without it.
    }
}

module.exports = Map;