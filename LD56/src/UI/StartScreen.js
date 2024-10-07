
import { consoleLog, EM, PIXEL_SCALE } from "../main";
import EndScreen from "./EndScreen";

export default class StartScreen extends EndScreen
{
    constructor()
    {
        super("", { w: 28, h: 20});

        let _this = this;

        this.BuildButtons([ { text: "CLICK TO START", callback: () => _this.StartGame() }]);

        this.insetY = 1;

        this.lineHeight= 1.5;

        this.intro = [
            "This old bee hive has",
            "seen better days!",
            { sprite: 1, rect: 3 },            
            "Guide the colony to",
            "a shiny new hive!",
            { sprite: 4, rect: 3 }
        ];

        this.titleGrid = [
            [ 176, 177, 178, ],
            [  null, 193, 194 ],
            [  null, 209, 210, 211, null],
            [  null, 225 ]
        ];

        this.overGrid = [
            [ null, null, null, null, 35 ],
            [ 212, null, null, null, 216 ],
            [ null, 229, 230, 231, 232 ]
        ]

        this.grassGrid = [ 
            [ 86, 70, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 71, 86 ]
        ];

        this.trailGrid = [
          [  null, 118, 119, 118, 119, 118, 119, 118, 119, 118, 119, 118, null ]
        ];
        this.trailOverGrid = [
            [ null, 1, null, 135, null, 134, null, { sprite: 35, v: true, r: true}, null, null, null, null, null, 4, null ]
        ]

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

    StartGame()
    {
        EM.Unpause();
        this.Destroy();
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

                    let index = 0;

                    if(item.sprite)
                    {
                        index = item.sprite;
                        h = item.h ?? false;
                        v = item.v ?? false;
                        r = item.r ?? false;
                    }
                    else
                    {
                        index = grid[i][j];
                    }

                    sprite(index, drawAt.x, drawAt.y, h, v, r);
                }
            }
        }
    }

    Draw()
    {
        super.Draw();

        this.DrawGridCentred(this.titleGrid, this.dims.y + this.insetY);

        this.DrawGridCentred(this.overGrid, this.dims.y + this.insetY + 1);

        for(let i = 0; i < this.intro.length; i ++)
        {
            pen(1)
            let item = this.intro[i];

            if(item.sprite)
            {
                this.DrawCentredSprite(item.sprite, this.insetY + 4.5 + i * this.lineHeight, item.rect);
            }
            else
            {
                this.DrawCentredText(item,  this.insetY + 4.5 + i * this.lineHeight);
            }
        }

        this.DrawGridCentred(this.grassGrid, this.dims.y + 15, true);
        this.DrawGridCentred(this.trailGrid, this.dims.y + 15);
        this.DrawGridCentred(this.trailOverGrid, this.dims.y + 15);
    }
}