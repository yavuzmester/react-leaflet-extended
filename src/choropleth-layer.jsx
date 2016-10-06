"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
const {GeoJson} = require("react-leaflet");

const propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    categoryData: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    categoryTitles: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            categoryTitle: PropTypes.string.isRequired
        })
    ),
    categoryFromFeature: PropTypes.func,
    onFeatureMouseOver: PropTypes.func,
    onFeatureMouseOut: PropTypes.func,
    onFeatureClick: PropTypes.func
};

const defaultProps = {
    data: [],
    categoryTitles: []
};

class ChoroplethLayer extends GeoJson {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.style = this.style.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
    }

    componentWillMount () {
        const {data} = this.props,
            options = {
                style: this.style,
                onEachFeature: this.onEachFeature
            };

        this.leafletElement = L.geoJson(data, options);
    }

    style(feature /*: object */) /*: object */ {
        const {categoryData, categoryFromFeature} = this.props;

        const category = categoryFromFeature(feature),
            color = categoryData.find(d => d.category === category).color;

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

    shouldComponentUpdate() {
        return false;
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
