"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
const RL_GeoJson = require("@yavuzmester/react-leaflet").GeoJson;
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    geoJsonVal: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired
        })
    ),
    categoryFromFeature: PropTypes.func,
    onFeatureMouseOver: PropTypes.func,
    onFeatureMouseOut: PropTypes.func,
    onFeatureClick: PropTypes.func
};

const defaultProps = {
    data: []
};

class ChoroplethLayer extends RL_GeoJson {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.style = this.style.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
    }

    componentWillMount () {
        const {geoJsonVal} = this.props,
            options = {
                style: this.style,
                onEachFeature: this.onEachFeature
            };

        this.leafletElement = L.geoJson(geoJsonVal, options);
    }

    style(feature /*: object */) /*: object */ {
        const {data, categoryFromFeature} = this.props;

        const category = categoryFromFeature(feature),
            color = (data.find(d => d.category === category) || {color: undefined}).color;

        return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.6
        };
    }

    onEachFeature(feature /*: object */, layer /*: object */) {
        const {onFeatureMouseOver, onFeatureMouseOut, onFeatureClick} = this.props;

        layer.on({
            mouseover: onFeatureMouseOver,
            mouseout: onFeatureMouseOut,
            click: onFeatureClick
        });
    }

    componentDidUpdate() {
        this.setStyle(this.style);
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
