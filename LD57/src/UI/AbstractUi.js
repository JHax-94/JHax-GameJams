import { PIXEL_SCALE, setFont, UTIL } from "../main";

export default class AbstractUi
{
    constructor()
    {

    }

    GridHeight(grid)
    {
        return grid.length;
    }

    GridWidth(grid)
    {
        let width = 0;
        for(let i = 0; i < grid.length; i ++)
        {
            if(grid[i].length > width)
            {
                width = grid[i].length;
            }
        }

        return width;
    }

    DrawGridCentred(grid, y, rectAround = false)
    {
        let width =this.GridWidth(grid);
        let x = (this.dims.x + (this.dims.w - width) * 0.5);
        //let height = this.GridHeight(grid);

        if(rectAround)
        {
            paper(3);
            pen(12);

            rectf(x * PIXEL_SCALE - 2, y * PIXEL_SCALE - 2, width * PIXEL_SCALE + 4, PIXEL_SCALE + 4);
            rect(x * PIXEL_SCALE - 2, y * PIXEL_SCALE - 2, width * PIXEL_SCALE + 4, PIXEL_SCALE + 4);
        }

        for(let i = 0; i < grid.length; i ++)
        {
            for(let j = 0; j < grid[i].length; j ++)
            {
                if(grid[i][j] !== null)
                {
                    let item = grid[i][j];

                    let drawAt = { x: (x+j)* PIXEL_SCALE ,  y: (y+i) * PIXEL_SCALE };

                    let h = false;
                    let v = false;
                    let r = false;

                    let off = {
                        x: 0, 
                        y: 0
                    };

                    let index = 0;

                    if(item.sprite)
                    {
                        index = item.sprite;
                        h = item.h ?? false;
                        v = item.v ?? false;
                        r = item.r ?? false;

                        off.x = item.off?.x ?? 0;
                        off.y = item.off?.y ?? 0;
                    }
                    else
                    {
                        index = grid[i][j];
                    }

                    sprite(index, drawAt.x + off.x, drawAt.y + off.y, h, v, r);
                }
            }
        }
    }

    DrawCentredSprite(index, y, rectC = null)
    {
        let drawAt = { x: this.dims.x * PIXEL_SCALE + 0.5 * (this.dims.w - 1) * PIXEL_SCALE , y: (this.dims.y + y) * PIXEL_SCALE }

        if(rectC !== null)
        {
            paper(rectC);
            pen(12);
            rectf(drawAt.x - 2, drawAt.y - 2, PIXEL_SCALE + 4, PIXEL_SCALE + 4);
            rect(drawAt.x - 2, drawAt.y -2, PIXEL_SCALE + 4, PIXEL_SCALE + 4);
        
        }

        sprite(index, drawAt.x, drawAt.y );
    }

    DrawCentredText(text, y)
    {
        setFont(this.font);
        let textW = UTIL.GetTextWidth(text, this.font);
        print(text, this.dims.x * PIXEL_SCALE + 0.5 * (this.dims.w - textW) * PIXEL_SCALE, (this.dims.y + y) * PIXEL_SCALE);
    }
}