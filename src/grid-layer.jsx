"use strict";

const {PropTypes} = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");

const propTypes = {
    noWrap: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tx: PropTypes.number.isRequired,
            ty: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired
        })
    ),
    opacity: PropTypes.number,
    hidden: PropTypes.bool
};

const defaultProps = {
    noWrap: true,
    data: [],
    opacity: 1,
    hidden: false
};

class GridLayer extends CanvasTileLayer {
    tileText(tile={} /*: object */) /*: string */ {
        const {data} = this.props;
        return data.find(d => d.tx === tile.x && d.ty === tile.y).text;
    }

    draw() {
        const {hidden} = this.props;

        this.leafletElement._reset();

        if (!hidden) {
            this.leafletElement._update();
            this.tileCanvases().forEach(tc => this._drawTileCanvas(tc));
        }
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
