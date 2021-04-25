import ChartSheet from "./ChartSheet";
import { em, PIXEL_SCALE } from "./main";

export default class PearlSelect
{
    constructor(tileBounds, pearlData)
    {
        this.excludeTiles = [
            { x:0, y: 3},
            { x:2, y: 3}
        ]

        this.pearlSelectIndex = 22;

        this.tileBounds = tileBounds;
        this.pearlData = pearlData;

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

    IsExludedTile(tile)
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

        if(this.IsExludedTile(newHoverTile) || onOff === false)
        {
            this.hoverTile = null;
        }
        else
        {
            this.hoverTile = newHoverTile;
            this.highlightPos = this.GetPearlTileScreenPosition(this.hoverTile.x, this.hoverTile.y);
        }
    }

    GetPearlIndex(tile)
    {  
        var pearlIndex = -1;

        for(var x = 0; x < this.tileBounds.w; x ++)
        {
            for(var y = 0; y < this.tileBounds.h; y ++)
            {
                if(!this.IsExludedTile(x, y))
                {
                    pearlIndex ++;
                }

                if(x == tile.x && y == tile.y)
                {
                    break;
                }
            }
        }

        return pearlIndex;
    }

    Click(button)
    {
        var pearlIndex = this.GetPearlIndex(this.hoverTile);

        

        if(pearlIndex >= 0)
        {
            var pearl = this.pearlData[0];

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
                    h: 3
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

    Draw()
    {
        if(this.hoverTile)
        {
            sprite(this.pearlSelectIndex, this.highlightPos.x, this.highlightPos.y);
        }
    }
}