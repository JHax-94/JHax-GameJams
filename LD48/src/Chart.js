import Button from "./Button";
import ChartSheet from "./ChartSheet";
import GridOverlay from "./GridOverlay";
import InventoryDisplay from "./InventoryDisplay";
import { consoleLog, em, PIXEL_SCALE, LoadDive, PEARL_DATA, DATA_STORE, GetDiveData, ResetGame, EMPTY_MAP_ICON, SFX, SOUND, COMPLETED_ICON, STUFF_TO_FIND_ICON, LARGE_FONT, JET_SPRITE, TOP_UP_SPRITE, INTERACT } from "./main";
import Pearl from "./Pearl";
import PearlSelect from "./PearlSelect";
import PlayerShip from './PlayerShip.js';

export default class Chart
{
    constructor(chartName, shipPosition, mapOffset, dead)
    {
        this._LETTERS = [ "A", "B", "C", "D", "E", "F", "G", "H"];
        this._NUMBERS = [ "1", "2", "3", "4", "5", "6", "7", "8"];

        tilesheet(assets.tilesheet);

        this.map = getMap(chartName).copy();

        em.bgColour = 15;
        em.AddRender(this);
        em.AddUpdate(this);

        this.mapOffset = mapOffset; 

        this.highlightTileSprite = 100;

        this.chartBounds = { w: 15, h: 11 };

        this.mapDims = { w: 8, h: 8 };

        this.topLeft = { x: 2, y: 2 };
        
        this.dataStore = DATA_STORE;

        this.dataSheet = new ChartSheet(
            { x: mapOffset.x + 1, y: mapOffset.y + this.chartBounds.h + 1, w: 9, h: 4.5 },
            { foreground: 34, text: 51, shadow: 0 },
            [ 
                {
                    type: "Label",
                    id: "COORDS",
                    text: this.CoordinateString(0, 0), ///"Co-ordinates: A0",
                    pos: {x: 0.5, y: 0.5 },
                    font: assets.charsets.large_font
                },
                {
                    type: "Label",
                    id: "DEPTH",
                    text: this.DepthString(100),
                    pos: {x: 0.5, y: 1.5 },
                    font: assets.charsets.large_font
                },
                {
                    type: "Label",
                    id: "TREASURE",
                    text: this.TreasureString(0, 0, true),
                    pos: {x: 0.5, y: 2.5 },
                    font: assets.charsets.large_font
                },
                {
                    type: "Label",
                    id: "PEARLS",
                    text: this.PearlString(0, 0, true),
                    pos: {x: 0.5, y: 3.5 },
                    font: assets.charsets.large_font
                }
            ]);

        new Button({ 
            x: mapOffset.x + 11, y: mapOffset.y + this.chartBounds.h + 1, w: 3, h: 1}, 
            "DIVE!", 
            { shadow: 0, foreground: 34, text: 51, hover: 32 },
            "DIVE",
            this);

            /*
        new Button(
            { x: 24, y: 2, w: 6.5, h: 1 },
            "Toggle Sound",
            { shadow: 0, foreground: 34, text: 51, hover: 32 },
            "SOUND",
            this);*/

        new Button({ x: 24, y: 3.5, w: 6.5, h: 1 },
            "Reset Save",
            { shadow: 0, foreground: 34, text: 51, hover: 32 },
            "RESET",
            this);


        consoleLog("CHART DATA");
        consoleLog(this.dataStore.chartDiscoveryData);

        for(var i = 0; i < this.dataStore.chartDiscoveryData.length; i ++)
        {
            var gridData = this.dataStore.chartDiscoveryData[i];

            consoleLog(gridData);
            if(gridData.contentsKnown)
            {
                var diveData = GetDiveData(gridData.coords);

                if(diveData)
                {
                    consoleLog("==== DIVE DATA ====");
                    consoleLog(diveData);
                    consoleLog("==== GRID DATA ====");
                    consoleLog(gridData);
                    var foundAllClams = gridData.foundClamsCount === diveData.clamCount;
                    var foundAllChests = gridData.foundChestsCount === diveData.chestCount;

                    var noContents = diveData.clamCount === 0 && diveData.chestCount === 0;

                    consoleLog("FOUND ALL CLAMS: " + foundAllClams);
                    consoleLog("FOUND ALL CHESTS: " + foundAllChests);
                    consoleLog("NO CONTENTS: " + noContents)

                    if(noContents || !foundAllChests || !foundAllClams)
                    {
                        consoleLog(" no contents or still need to find stuff: icon = " + STUFF_TO_FIND_ICON)
                        new GridOverlay(this.GetMapTileScreenPosition(gridData.coords.x, gridData.coords.y), STUFF_TO_FIND_ICON);
                    }
                    else if(foundAllClams && foundAllChests)
                    {
                        consoleLog("Found everything!");
                        new GridOverlay(this.GetMapTileScreenPosition(gridData.coords.x, gridData.coords.y), COMPLETED_ICON);                    
                    }
                    else
                    {
                        new GridOverlay(this.GetMapTileScreenPosition(gridData.coords.x, gridData.coords.y), EMPTY_MAP_ICON);
                    }
                }
            }
        }

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
            PEARL_DATA,
            this.dataStore.retrievedPearls);

        this.inventory = new InventoryDisplay({ x: 16, y: 2 }, this.dataStore);

        this.lastMousePos = { x: 0, y: 0 };
        this.hover = false;

        em.AddHover(this);    
        em.AddClickable(this);

        this.hoverTile = {x: 0, y:0};
        this.hoverTilePos = this.GetMapTileScreenPosition(0, 0);

        if(this.dataStore.playerShip)
        {
            consoleLog("SET SHIP POSITION:");
            consoleLog(this.dataStore.playerShip);
            this.hoverTile = this.dataStore.playerShip;
            this.hoverTilePos = this.GetMapTileScreenPosition(this.hoverTile.x, this.hoverTile.y);
        }

        this.infoChart = new ChartSheet(
            { x: mapOffset.x + 17.75, y: 5.5, w: 13.5, h: 13.5 },
            { foreground: 34, text: 51, shadow: 0 },
            [
                {
                    type:"Label",
                    text: "Click the map to choose",
                    pos: { x: 0.25, y: 0.5 },
                    font: LARGE_FONT
                },
                {
                    type:"Label",
                    text: "to choose a dive location!",
                    pos: { x: 0.25, y: 1.5 },
                    font: LARGE_FONT
                },
                { 
                    type: "Label",
                    text: "Arrow Keys:",
                    pos: { x: 0.25, y: 3 },
                    font: LARGE_FONT
                },
                { 
                    type: "Label",
                    text: "Control Diver",
                    pos: { x: 0.25, y: 4 },
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "W key: Use Booster",
                    pos: {x: 0.25, y: 5.5 },
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "R Key: Use 02 Top Up",
                    pos: {x: 0.25, y: 6.5 },
                    font: LARGE_FONT
                },
                {
                    type:"Label",
                    text: "Space: Interact " ,
                    pos: {x: 0.25, y: 7.5},
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "Get pearls and treasure",
                    pos: { x: 0.25, y: 9.5},
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "then return to your ship!",
                    pos: { x: 0.25, y: 10.5 },
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "Find maps to reveal",
                    pos: {x: 0.25, y: 11.5},
                    font: LARGE_FONT
                },
                {
                    type: "Label",
                    text: "treasure locations!",
                    pos: {x: 0.25, y: 12.5},
                    font: LARGE_FONT
                },
                {
                    type: "Sprite",
                    pos: { x:11.5, y: 5.25 },
                    sprite: 158                    
                },
                {
                    type: "Sprite",
                    pos: { x: 11.5, y: 6.25 },
                    sprite: 126
                },
                {
                    type: "Sprite",
                    pos: { x: 11.5, y: 7.25 },
                    sprite: 25
                },
                {
                    type: "Sprite",
                    pos: { x: 10.75, y: 11.5 },
                    sprite: 110
                }
            ]);

        if(dead)
        {
            this.deadSheet = new ChartSheet(
                { x: mapOffset.x + 11, y: mapOffset.y + this.chartBounds.h + 3, w: 14, h: 3 },
                { foreground: 34, text: 51, shadow: 0, hover: 32 },
                [ 
                    {
                        type: "Label",
                        text: "Uh oh - you drowned!",
                        pos: {x: 0.5, y: 0.5 },
                        font: assets.charsets.large_font
                    },
                    {
                        type: "Label",
                        text: "Never mind... Try again!",
                        pos: {x: 0.5, y: 1.5 },
                        font: assets.charsets.large_font
                    }
                ],
                true);
        }

        this.UpdateSelectedTile(true);
    }

    DepthString(depth)
    {
        return "Depth: " + depth + "m";
    }

    TreasureString(found, total, unknown)
    {
        var one = unknown ? "?" : found;
        var two = unknown ? "?" : total;    
    
        return "Treasure: " + one + " / " + two;
    }

    PearlString(found, total, unknown)
    {
        var one = unknown ? "?" : found;
        var two = unknown ? "?" : total;    
    
        return "Pearls: " + one + " / " + two;
    }

    ButtonClicked(button)
    {
        if(button)
        {
            if(button.type === "DIVE")
            {
                sfx(SFX.dive);

                LoadDive(this.playerShip.chartPos);
            }
            else if(button.type === "RESET")
            {
                ResetGame();
            }
            else if(button.type === "SOUND")
            {
                SOUND.Toggle();
            }
        }
    }

    UpdateSelectedTile(noSfx)
    {
        consoleLog("CHANGING SELECTED TILE:");
        consoleLog(this.hoverTile);

        this.playerShip.SetChartPos(this.hoverTile.x, this.hoverTile.y, noSfx);
        this.dataSheet.SetLabelText("COORDS", this.CoordinateString(this.hoverTile.x, this.hoverTile.y));

        var chartEntry = GetDiveData(this.hoverTile);
        var chartRecord = this.dataStore.GetChartDiscovery(this.hoverTile);

        consoleLog("CHART ENTRY");
        consoleLog(chartEntry);

        consoleLog("CHART RECORD");
        consoleLog(chartRecord);

        if(chartEntry)
        {
            this.dataSheet.SetLabelText("DEPTH", this.DepthString(chartEntry.depth));
        }

        if(chartRecord)
        {
            consoleLog("Set display for chart record");
            consoleLog(chartRecord);

            var unknown = !chartRecord.contentsKnown;

            this.dataSheet.SetLabelText("TREASURE", this.TreasureString(chartRecord.foundChestsCount, chartEntry.chestCount, unknown));
            this.dataSheet.SetLabelText("PEARLS", this.PearlString(chartRecord.foundClamsCount, chartEntry.clamCount, unknown));
        }
        else
        {
            this.dataSheet.SetLabelText("TREASURE", this.TreasureString(0, 0, true));
            this.dataSheet.SetLabelText("PEARLS", this.PearlString(0, 0, true));
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
            this.UpdateSelectedTile();
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
