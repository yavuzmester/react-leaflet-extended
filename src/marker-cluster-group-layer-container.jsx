"use strict";

const React = require("react"),
    {Component, PropTypes} = React;
const {LayerGroup} = require("@yavuzmester/react-leaflet");
const MarkerClusterGroupLayer = require("./marker-cluster-group-layer");
const NwInfraCompassControl = require("./nw-infra-compass-control");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired
        }).isRequired
    ).isRequired,
    visibility: PropTypes.bool
};

const defaultProps = {
    data: [],
    visibility: false
};

class MarkerClusterGroupLayerContainer extends Component {
    name() {
        return this.props.name;
    }

    render() {
        const {name, data, visibility} = this.props;

        return (
            <LayerGroup>
                <MarkerClusterGroupLayer name={name} data={data}/>

                {
                    name.includes("nw-cases") ?
                        <NwInfraCompassControl visibility={visibility}/> :
                        ""
                }
            </LayerGroup>
        );
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

MarkerClusterGroupLayerContainer.propTypes = propTypes;
MarkerClusterGroupLayerContainer.defaultProps = defaultProps;

module.exports = MarkerClusterGroupLayerContainer;
