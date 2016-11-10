"use strict";

const React = require("react");
const { MapControl } = require("@yavuzmester/react-leaflet");
const { control, DomUtil } = require("leaflet");
require("leaflet-measure");
const ReactDOM = require("react-dom");

const defaultProps = {
    position: "topleft"
};

class MeasureControl extends MapControl {
    componentWillMount() {
        const leafletElement = control.measure(this.props);

        leafletElement.onAdd = function () {
            const container = DomUtil.create("div", "geo-measure-control");
            leafletElement._container = container;
            return container;
        };

        this.leafletElement = leafletElement;
    }
}

MeasureControl.defaultProps = defaultProps;

module.exports = MeasureControl;