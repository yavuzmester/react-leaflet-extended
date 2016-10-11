"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
const {GeoJson} = require("react-leaflet");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    geojson: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
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

class ChoroplethLayer extends GeoJson {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.style = this.style.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
    }

    componentWillMount () {
        const {geojson} = this.props,
            options = {
                style: this.style,
                onEachFeature: this.onEachFeature
            };

        this.leafletElement = L.geoJson(geojson, options);
    }

    style(feature /*: object */) /*: object */ {
        const {data, categoryFromFeature} = this.props;

        const category = categoryFromFeature(feature),
            color = data.find(d => d.category === category).color;

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

    shouldComponentUpdate() /*: boolean */ {
        return false;
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
