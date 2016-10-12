"use strict";

const React = require("react"),
    {Component, PropTypes} = React;
const {LayerGroup} = require("react-leaflet");
const ChoroplethLayer = require("./choropleth-layer");
const ChoroplethInfoControl = require("./choropleth-info-control");
const ChoroplethLegendControl = require("./choropleth-legend-control");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    geojson: PropTypes.oneOfType([
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
    categoryTitles: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            categoryTitle: PropTypes.string.isRequired
        })
    ),
    extents: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string.isRequired,
            extent: PropTypes.arrayOf(
                PropTypes.number.isRequired
            ).isRequired
        })
    ),
    visibility: PropTypes.bool
};

const defaultProps = {
    data: [],
    categoryTitles: [],
    extents: [],
    visibility: false
};

class ChoroplethLayerContainer extends Component {
    name() {
        return this.props.name;
    }

    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.categoryFromFeature = this.categoryFromFeature.bind(this);
        this.titleForCategory = this.titleForCategory.bind(this);
        this.onFeatureMouseOver = this.onFeatureMouseOver.bind(this);
        this.onFeatureMouseOut = this.onFeatureMouseOut.bind(this);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    render() {
        const {geojson, data, extents, visibility} = this.props;

        return (
            <LayerGroup>
                <ChoroplethLayer ref="geo-choropleth-layer"
                    geojson={geojson}
                    data={data}
                    categoryFromFeature={this.categoryFromFeature}
                    onFeatureMouseOver={this.onFeatureMouseOver}
                    onFeatureMouseOut={this.onFeatureMouseOut}
                    onFeatureClick={this.onFeatureClick}/>

                <ChoroplethInfoControl ref="geo-choropleth-info-control"/>

                <ChoroplethLegendControl extents={extents} visibility={visibility}/>
            </LayerGroup>
        );
    }

    geoChoroplethLayer() {
        return this.refs["geo-choropleth-layer"];
    }

    geoChoroplethInfoControl() {
        return this.refs["geo-choropleth-info-control"];
    }

    titleForCategory(category /*: string */) /*: string */ {
        const {categoryTitles} = this.props;
        return (categoryTitles.find(ct => ct.category === category) || {categoryTitle: category}).categoryTitle;
    }

    categoryFromFeature(feature /*: object */) /*: string */ {
        return Number(feature.properties.tags["ISO3166-2"].split("-")[1]).toString();
    }

    onFeatureMouseOver(e /*: object */) {
        const {data} = this.props;

        if (data.length > 0) {
            const layer = e.target,
                feature = layer.feature,
                category = this.categoryFromFeature(feature),
                categoryTitle = this.titleForCategory(category),
                value = data.find(d => d.category === category).value;

            layer.setStyle({
                weight: 5,
                color: "#666666",
                dashArray: "",
                fillOpacity: 0.8
            });

            layer.bringToFront();

            this.geoChoroplethInfoControl().update(categoryTitle, value);
        }
    }

    onFeatureMouseOut(e /*: object */) {
        this.geoChoroplethLayer().leafletElement.resetStyle(e.target);  //uses our style function to reset styles
        this.geoChoroplethInfoControl().reset();
    }

    onFeatureClick(e /*: object */) {
        e.target._map.fitBounds(e.target.getBounds());
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

ChoroplethLayerContainer.propTypes = propTypes;
ChoroplethLayerContainer.defaultProps = defaultProps;

module.exports = ChoroplethLayerContainer;
