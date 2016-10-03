"use strict";

const {PropTypes} = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");

const propTypes = {
    noWrap: PropTypes.bool,
    data: PropTypes.shape({
        tiles: PropTypes.arrayOf(
            PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                text: PropTypes.string.isRequired
            })
        )
    }),
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    data: {
        tiles: []
    },
    opacity: 1
};

class GridLayer extends CanvasTileLayer {
    tileText(tile={} /*: object */) /*: string */ {
        const {data} = this.props;
        return (data.tiles.find(t => t.x === tile.x && t.y === tile.y) || {text: ""}).text;
    }

    draw() {
        if (this.leafletElement._tileContainer) {
            this.leafletElement._reset();
        }

        this.leafletElement._update();
        this.tileCanvases().forEach(tc => this._drawTileCanvas(tc));
    }

    _drawTileCanvas(tileCanvas={} /*: object */) {
        const ctx = tileCanvas.getContext("2d"),
            tile = tileCanvas._tilePoint,
            tileText = this.tileText(tile);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "white";
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stroke();

        ctx.font = "10pt sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(tileText, 10, 256 - 10);
    }

    componentDidMount() {
        super.componentDidMount();
        this.draw();
    }

    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        this.draw();
    }
}

GridLayer.propTypes = propTypes;
GridLayer.defaultProps = defaultProps;

module.exports = GridLayer;
