"use strict";

const RL_Map = require("react-leaflet").Map;

class Map extends RL_Map {
    componentDidUpdate(prevProps /*: object */) {
        //Do nothing here, as it seems we are better without it.
    }
}

module.exports = Map;
