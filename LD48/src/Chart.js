import Button from "./Button";
import ChartSheet from "./ChartSheet";
import { consoleLog, em, PIXEL_SCALE, LoadDive, PEARL_DATA } from "./main";
import Pearl from "./Pearl";
import PearlSelect from "./PearlSelect";
import PlayerShip from './PlayerShip.js';

export default class Chart
{
    constructor(chartName, shipPosition, mapOffset)
    {
        this._LETTERS = [ "A", "B", "C", "D", "E", "F", "G", "H"];
        this._NUMBERS = [ "1", "2", "3", "4", "5", "6", "7", "8"];

        this.map = getMap(chartName);

        em.AddRender(this);
        em.AddUpdate(this);

        this.mapOffset = mapOffset; 

        this.highlightTileSprite = 100;

        this.chartBounds = { w: 15, h: 11 };

        this.mapDims = { w: 8, h: 8 };

        this.topLeft = { x: 2, y: 2 };
        
        this.dataSheet = new ChartSheet(
            { x: mapOffset.x + 1, y: mapOffset.y + this.chartBounds.h + 1, w: 5, h: 4.5 },
            { foreground: 34, text: 51 },
            [ 
                {
                    type: "Label",
                    id: "COORDS",
                    text: "Co-ordinates: A0",
                    pos: {x: 0.5, y: 0.5 }
                },
                {
                    type: "Label",
                    id: "DEPTH",
                    text: "Depth: 100m",
                    pos: {x: 0.5, y: 1.5 }
                },
                {
                    type: "Label",
                    id: "TREASURE",
                    text: "Treasure: ? / ?",
                    pos: {x: 0.5, y: 2.5 }
                },
                {
                    type: "Label",
                    id: "Pearls",
                    text: "Pearls: ? / ?",
                    pos: {x: 0.5, y: 3.5 }
                }
            ]);

        new Button({ 
            x: mapOffset.x + 7, y: mapOffset.y + this.chartBounds.h + 2, w: 4, h: 3}, 
            "DIVE!", 
            { shadow: 0, foreground: 34, text: 51, hover: 32 },
            "DIVE",
            this);

        this.playerShip = new PlayerShip(this, shipPosition);

        var pearlBounds = {
            x: 11,
            y: 6,
            w: 3,
            h: 4
        };

        this.pearlGrid = new PearlSelect(
            {
                x: this.mapOffset.x + pearlBounds.x,
                y: this.mapOffset.y + pearlBounds.y,
                w: pearlBounds.w,
                h: pearlBounds.h
            },
            PEARL_DATA)

        this.lastMousePos = { x: 0, y: 0 };
        this.hover = false;

        em.AddHover(this);    
        em.AddClickable(this);

        this.hoverTile = {x: 0, y:0};
        this.hoverTilePos = this.GetMapTileScreenPosition(0, 0);
    }

    ButtonClicked(button)
    {
        if(button)
        {
            if(button.type === "DIVE")
            {
                LoadDive(this.hoverTile);
            }
        }
    }

    Bounds()
    {
        return { x: this.topLeft.x * PIXEL_SCALE, y: this.topLeft.y * PIXEL_SCALE, w: this.mapDims.w * PIXEL_SCALE, h: this.mapDims.h * PIXEL_SCALE };
    }

    Hover(onOff, mousePos)
    {
        //consoleLog("HOVER");
        this.hover = onOff;
        if(onOff)
        {
            if(this.hoverTile)
            {
                this.lastMousePos = mousePos;

                var internalOffset = { x: this.lastMousePos.x - this.topLeft.x * PIXEL_SCALE, y: this.lastMousePos.y - this.topLeft.y * PIXEL_SCALE };
                /*consoleLog("INTERNAL OFFSET");
                consoleLog(internalOffset);*/

                this.hoverTile = { 
                    x: Math.floor(internalOffset.x / PIXEL_SCALE),
                    y: Math.floor(internalOffset.y / PIXEL_SCALE)
                };

                /*consoleLog("HOVER TILE");
                consoleLog(this.hoverTile);*/

                this.hoverTilePos = this.GetMapTileScreenPosition(this.hoverTile.x, this.hoverTile.y);
            }   
        }
    }

    CoordinateString(x, y)
    {
        return "Co-ordinates: " + this._LETTERS[x] + this._NUMBERS[y];
    }

    Click(mouseButton)
    {
        if(this.hover)
        {
            this.playerShip.SetChartPos(this.hoverTile.x, this.hoverTile.y);
            
            this.dataSheet.SetLabelText("COORDS", this.CoordinateString(this.hoverTile.x, this.hoverTile.y));
        }
    }

    GetMapTileScreenPosition(x, y)
    {
        return { x: (x + this.topLeft.x)*PIXEL_SCALE, y: (y + this.topLeft.y)*PIXEL_SCALE };
    }

    Update(deltaTime)
    {

    }

    Draw()
    {
        draw(this.map, this.mapOffset.x, this.mapOffset.y);

        if(this.hover)
        {
            sprite(this.highlightTileSprite, this.hoverTilePos.x, this.hoverTilePos.y);
        }
    }

}
