"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("react-leaflet");
const L = require("leaflet");

const propTypes = {
    where: PropTypes.string,
    what: PropTypes.string
};

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

    componentDidUpdate() {
        super.componentDidUpdate();

        const {where, what} = this.props,
            visibility = where && what;

        this.leafletElement._container.innerHTML = `
                <b>${where || ""}</b>
                <br/>
                <b>${what || ""}</b>
            `;

        this.leafletElement._container.style.visibility = visibility ? "visible" : "hidden";
    }
}

ChoroplethInfoControl.propTypes = ChoroplethInfoControl.propTypes;
ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
