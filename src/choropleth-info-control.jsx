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
            container.innerHTML = "<br/><br/>";
            container.visibility = "hidden";

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
                <br/>
            `;

        this.leafletElement._container.style.visibility = visibility ? "visible" : "hidden";
    }

    reset() {
        this.leafletElement.container.innerHTML = "<br/><br/>";
        this.leafletElement.container.visibility = "hidden";
    }
}

ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
