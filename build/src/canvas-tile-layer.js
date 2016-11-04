"use strict";

const { PropTypes } = require("react");
const RL_CanvasTileLayer = require("@yavuzmester/react-leaflet").CanvasTileLayer;
const _ = require("underscore");

class CanvasTileLayer extends RL_CanvasTileLayer {
    tileCanvases() {
        return _.values(this.leafletElement._tiles);
    }
}

module.exports = CanvasTileLayer;