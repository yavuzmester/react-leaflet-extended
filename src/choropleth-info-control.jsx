"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("react-leaflet");
const L = require("leaflet");

const defaultProps = {
    position: "bottomleft"
};

class ChoroplethInfoControl extends MapControl {
    componentWillMount() {
        const leafletElement = L.control(this.props);

        leafletElement.onAdd = function() {
            const container = L.DomUtil.create("div", "geo-choropleth-info");
            leafletElement._container = container;
            return container;
        };

        this.leafletElement = leafletElement;
    }

    update(where="" /*: string */, what="" /*: string */) {
        const visibility = where && what;

        this.leafletElement._container.innerHTML = `
                <b>${where || ""}</b>
                <br/>
                <b>${what || ""}</b>
            `;

        this.leafletElement._container.style.visibility = visibility ? "visible" : "hidden";
    }

    reset() {
        this.update();
    }
}

ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
