"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
L.MarkerClusterGroup = require("leaflet.markercluster");
const RL_MapLayer = require("react-leaflet").MapLayer;
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired
        }).isRequired
    ).isRequired
};

const defaultProps = {
    data: []
};

const markerIcon = L.icon({
    iconUrl: "https://asmaloney.com/wp-content/themes/asmaloney/maps_cluster/images/pin24.png",
    iconRetinaUrl: "https://asmaloney.com/wp-content/themes/asmaloney/maps_cluster/images/pin48.png",
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

function datumToMarker(datum /*: object */) /*: L.Marker */ {
    const marker = L.marker([datum.lat, datum.lng], {icon: markerIcon}),
        popupHtml = datumToPopupHtml(datum);

    return marker.bindPopup(popupHtml);
}

function datumToPopupHtml(datum /*: object */) /*: string */ {
    return Object.keys(datum).reduce((memo, key) => {
        if (key !== "lat" && key !== "lng") {
            return memo + `<br/><b>${key}:</b>  ${datum[key]}`;
        }
        else {
            return memo;
        }
    }, "");
}

class MarkerClusterGroupLayer extends RL_MapLayer {
    name() {
        return this.props.name;
    }

    componentWillMount() {
        super.componentWillMount();
        this.leafletElement = new L.MarkerClusterGroup();
    }

    componentDidMount() {
        super.componentDidMount();

        this.leafletElement.addLayers(
            this.props.data.map(d => datumToMarker(d))
        );
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

MarkerClusterGroupLayer.propTypes = propTypes;
MarkerClusterGroupLayer.defaultProps = defaultProps;

module.exports = MarkerClusterGroupLayer;
