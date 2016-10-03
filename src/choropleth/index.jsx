"use strict";

const {PropTypes} = require("react");
const L = require("leaflet");
const {GeoJson} = require("react-leaflet");

const propTypes = {
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
    ),
    categoryTitles: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            categoryTitle: PropTypes.string.isRequired
        })
    )
};

const defaultProps = {
    data: [],
    categoryData: [],
    categoryTitles: []
};

function categoryFromFeature(feature /*: object */) /*: string */ {
    return Number(feature.properties.tags["ISO3166-2"].split("-")[1]).toString();
}

class ChoroplethLayer extends GeoJson {
    constructor(props={} /*: object */, context={} /*: object */) {
        super(props, context);

        this.style = this.style.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.onFeatureMouseOver = this.onFeatureMouseOver.bind(this);
        this.onFeatureMouseOut = this.onFeatureMouseOut.bind(this);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    componentWillMount () {
        const {data} = this.props,
            options = {
                style: this.style,
                onEachFeature: this.onEachFeature
            };

        this.leafletElement = L.geoJson(data, options);
    }

    titleForCategory(category /*: string */) /*: string */ {
        const {categoryTitles} = this.props;
        return (categoryTitles.find(ct => ct.category === category) || {categoryTitle: category}).categoryTitle;
    }

    style(feature /*: object */) /*: object */ {
        const {categoryData} = this.props;

        if (categoryData.length > 0) {
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
        else {
            return {
                opacity: 0,
                fillOpacity: 0
            };
        }
    }

    onEachFeature(feature /*: object */, layer /*: object */) {
        layer.on({
            mouseover: this.onFeatureMouseOver,
            mouseout: this.onFeatureMouseOut,
            click: this.onFeatureClick
        });
    }

    onFeatureMouseOver(e={} /*: object */) {
        const {categoryData} = this.props;

        if (categoryData.length > 0) {
            const layer = e.target,
                feature = layer.feature,
                category = categoryFromFeature(feature),
                datum = categoryData.find(d => d.category === category),
                categoryTitle = this.titleForCategory(datum.category),
                value = datum.value;

            layer.setStyle({
                weight: 5,
                color: "#666666",
                dashArray: "",
                fillOpacity: 0.8
            });

            layer.bringToFront();

            //this._infoBox.update(categoryTitle, value);
        }
    }

    onFeatureMouseOut(e={} /*: object */) {
        this.leafletElement.resetStyle(e.target);      //uses our style function to reset styles
        //this._infoBox.reset();
    }

    onFeatureClick(e={} /*: object */) {
        e.target._map.fitBounds(e.target.getBounds());
    }

    shouldComponentUpdate() {
        return false;
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
