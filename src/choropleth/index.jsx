"use strict";

const {PropTypes} = require("react");
const {GeoJson} = require("react-leaflet");

const propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    categoryData: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
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

class ChoroplethLayer extends GeoJson {
    constructor(props={} /*: object */, context={} /*: object */) {
        props.style = this.style.bind(this);
        props.onEachFeature = this.onEachFeature.bind(this);
        super(props, context);

        this.onFeatureMouseOver = this.onFeatureMouseOver.bind(this);
        this.onFeatureMouseOut = this.onFeatureMouseOut.bind(this);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    categoryTitle(category) {
        const {categoryTitles} = this.props;
        return (categoryTitles.find(ct => ct.category === category) || {categoryTitle: category}).categoryTitle;
    }

    style(feature /*: object */) /*: object */ {
        const {categoryData} = this.props;

        if (categoryData.length > 0) {
            const category = this._categoryFromFeature(feature),
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
                category = this._categoryFromFeature(feature),
                datum = categoryData.find(d => d.category === category),
                categoryTitle = this.categoryTitle(datum.category),
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
        this.resetStyle(e.target);      //uses our style function to reset styles
        //this._infoBox.reset();
    }

    onFeatureClick(e={} /*: object */) {
        e.target._map.fitBounds(e.target.getBounds());
    }

    _categoryFromFeature(feature /*: object */) /*: string */ {
        return Number(feature.properties.tags["ISO3166-2"].split("-")[1]).toString();
    }

    shouldComponentUpdate() {
        return false;
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
