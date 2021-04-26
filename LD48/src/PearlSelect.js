import { ContactEquation } from "p2";
import ChartSheet from "./ChartSheet";
import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class PearlSelect
{
    constructor(tileBounds, pearlData, collectedPearls)
    {
        this.excludeTiles = [
            { x:0, y: 3},
            { x:2, y: 3}
        ]

        this.pearlSelectIndex = 22;

        this.tileBounds = tileBounds;
        this.pearlData = pearlData;

        this.collectedPearls = collectedPearls;

        this.pearlCollectedIndex = 37;
        
        consoleLog("PEARL DATA:");
        consoleLog(pearlData);

        consoleLog("COLLECTED PEARLS");
        consoleLog(this.collectedPearls);
        this.highlightPos = null;

        em.AddRender(this);
        em.AddHover(this);
        em.AddClickable(this);
    }

    Bounds() 
    {
        return { x: this.tileBounds.x * PIXEL_SCALE, y: this.tileBounds.y * PIXEL_SCALE, w: this.tileBounds.w * PIXEL_SCALE, h: this.tileBounds.h * PIXEL_SCALE };
    }
    
    GetPearlTileScreenPosition(x, y)
    {
        return { x: (x + this.tileBounds.x)*PIXEL_SCALE, y: (y + this.tileBounds.y)*PIXEL_SCALE };
    }

    IsExcludedTile(tile)
    {
        var isExcluded = false;

        if(tile)
        {
            for(var i = 0; i < this.excludeTiles.length; i ++)
            {
                if(tile.x === this.excludeTiles[i].x && tile.y === this.excludeTiles[i].y)
                {
                    isExcluded = true;
                    break;
                }
            }
        }
        else 
        {
            isExcluded = true;
        }
        
        return isExcluded;
    }

    Hover(onOff, mousePos)
    {
        if(onOff)
        {
            var internalOffset = {
                x: mousePos.x - this.tileBounds.x * PIXEL_SCALE,
                y: mousePos.y - this.tileBounds.y * PIXEL_SCALE
            };
    
            var newHoverTile = { 
                x: Math.floor(internalOffset.x / PIXEL_SCALE),
                y: Math.floor(internalOffset.y / PIXEL_SCALE)
            };    
        }

        if(this.IsExcludedTile(newHoverTile) || onOff === false)
        {
            this.hoverTile = null;
        }
        else
        {
            this.hoverTile = newHoverTile;
            this.highlightPos = this.GetPearlTileScreenPosition(this.hoverTile.x, this.hoverTile.y);
            /*
            var hasPearl = false;

            consoleLog("NEW HOVER TILE: ");
            consoleLog(newHoverTile);
            
            var index = this.GetPearlIndex(newHoverTile);
            consoleLog("INDEX: " + index);

            consoleLog("CHECK LIST:");
            consoleLog(this.collectedPearls);
            for(var i = 0; i < this.collectedPearls.length; i ++)
            {
                if(this.collectedPearls[i].pearlId === index)
                {
                    hasPearl = true;
                    break;
                }
            }

            if(hasPearl)
            {
                consoleLog("HAS PEARL!");
                this.hoverTile = newHoverTile;
                this.highlightPos = this.GetPearlTileScreenPosition(this.hoverTile.x, this.hoverTile.y);
            }
            else 
            {
                this.hoverTile = null;
            }*/
        }
    }

    GetPearlIndex(tile)
    {  
        consoleLog("GET TILE INDEX TILE: ");
        consoleLog(tile);
        var pearlIndex = -1;

        var tileFound = false;

        for(var y = 0; y < this.tileBounds.h; y ++)
        {
            for(var x = 0; x < this.tileBounds.w; x ++)
            {
                consoleLog("CHECK GRID: " + x + ", " + y);
                if(!this.IsExcludedTile({x: x, y: y}))
                {
                    consoleLog("NOT EXCLUDED, INCREMENT PEARL INDEX");
                    pearlIndex ++;
                    consoleLog(pearlIndex);
                }


                if(x == tile.x && y == tile.y)
                {
                    tileFound = true;
                    break;
                }
            }

            if(tileFound)
            {
                break;
            }
        }

        consoleLog("RETURN: " + pearlIndex);

        return pearlIndex;
    }

    GetPearlTile(index)
    {
        var tile = {};

        var x = index % this.tileBounds.w;
        var y = Math.floor(index / this.tileBounds.w);

        //consoleLog(index + " FIRST GUESS: (" + x + ", " + y + ")");
        
        while(this.IsExcludedTile({x: x, y: y }))
        {
            index ++;
            x = index % this.tileBounds.w;
            y = Math.floor(index / this.tileBounds.w);

            if(index > this.tileBounds.w * this.tileBounds.h)
            {
                break;
            }
        }
        
        tile.x = x;
        tile.y = y;

        /*
        consoleLog("RETURN TILE:");
        consoleLog(tile);
        */
        return tile;
    }

    Click(button)
    {
        var pearlIndex = this.GetPearlIndex(this.hoverTile);

        if(pearlIndex >= 0)
        {
            var hasPearl = false;
            consoleLog("Is PEARL: " + pearlIndex + " among collection?");
            consoleLog(this.collectedPearls);

            for(var i = 0; i < this.collectedPearls.length; i ++)
            {
                if(this.collectedPearls[i].pearlId === pearlIndex)
                {
                    hasPearl = true;
                    break;
                }
            }   

            if(hasPearl)
            {
                consoleLog("HAS PEARL!");
                var pearl = null;
                for(var i = 0; i < this.pearlData.length; i ++)
                {
                    if(this.pearlData[i].pearlId === pearlIndex)
                    {
                        pearl = this.pearlData[i];
                        break;
                    }
                }

                var components = [];

                for(var i = 0; i < pearl.pearlText.length; i ++)
                {
                    components.push(
                        {
                            type: "Label",
                            id: "PEARL_" + i,
                            text: pearl.pearlText[i],
                            pos: {x: 0.5, y: 0.5 + i },
                            font: assets.charsets.large_font
                        });
                }

                var pearlSheet = new ChartSheet(
                    {
                        x: 5,
                        y: 3,
                        w: 12,
                        h: 1+components.length
                    },
                    {
                        foreground: 34,
                        shadow: 0,
                        text: 53,
                        hover: 32
                    },
                    components,
                    true);

                pearlSheet.logging = true;
            }
        }
    }

    Draw()
    {
        for(var i = 0; i < this.collectedPearls.length; i ++)
        {
            var pearl = this.collectedPearls[i];
            /*
            consoleLog("DRAW TILE");
            consoleLog(pearl);
            */
            var pearlTile = this.GetPearlTile(pearl.pearlId);

            //consoleLog(pearlTile);

            sprite(this.pearlCollectedIndex, (this.tileBounds.x + pearlTile.x) * PIXEL_SCALE, (this.tileBounds.y + pearlTile.y) * PIXEL_SCALE);
        }

        if(this.hoverTile)
        {
            sprite(this.pearlSelectIndex, this.highlightPos.x, this.highlightPos.y);
        }

        
    }
}