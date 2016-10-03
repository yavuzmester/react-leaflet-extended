"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
require("leaflet.markercluster");
const RL_MapLayer = require("react-leaflet").MapLayer;

const propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired
        })
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

function datumToMarker(datum={} /*: object */) /*: L.Marker */ {
    const marker = L.marker([datum.lat, datum.lng], {icon: markerIcon}),
        popupHtml = datumToPopupHtml(datum);

    marker.bindPopup(popupHtml);
    return marker;
}

function datumToPopupHtml(datum={} /*: object */) /*: string */ {
    return Object.keys(datum).reduce((memo, key) => {
        if (key !== "lat" && key !== "lng") {
            return memo + `<br/><b>${key}:</b>  ${datum[key]}`;
        }
        else {
            return memo;
        }
    }, "").join("\n");
}

class MarkerClusterGroupLayer extends RL_MapLayer {
    componentWillMount() {
        super.componentWillMount();
        this.leafletElement = L.markerClusterGroup();
    }

    componentDidMount() {
        super.componentDidMount();

        this.leafletElement.addLayers(
            this.props.data.map(d => datumToMarker(d))
        );
    }

    render() {
        return null;
    }

    shouldComponentUpdate() {
        return false;
    }
}

MarkerClusterGroupLayer.propTypes = propTypes;
MarkerClusterGroupLayer.defaultProps = defaultProps;

module.exports = MarkerClusterGroupLayer;
