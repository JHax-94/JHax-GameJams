import { getDefaultTweener } from "tina";
import { EM, getFont, PIXEL_SCALE, setFont, TILE_WIDTH, UTIL } from "../main";

export default class PlayerStatusUi
{
    constructor(player)
    {
        this.renderLayer = "UI";

        this.font = getFont("LargeNarr");

        this.maxLevelWidth = UTIL.GetTextWidth("Level 000", this.font) * PIXEL_SCALE;

        this.swarmRegionW = UTIL.GetTextWidth("---SWARM---", this.font) * PIXEL_SCALE;

        this.player = player;
        EM.RegisterEntity(this);
    }

    DrawProgressBar(x, y, w, h, value)
    {
        paper(6);
        rectf(x, y, w, h);

        paper(11);
        rectf(x,y,w*value,h);
    }

    GetPaddedLevelString(level)
    {
        let lvlString = level;

        if(level < 10)
        {
            lvlString = `00${level}`;
        }
        else if(level < 100)
        {
            lvlString = `0${level}`;
        }
        else if(level > 999)
        {
            lvlString = "999";
        }
        return lvlString;
    }

    Draw()
    {
        let lvlString = `Level ${this.GetPaddedLevelString(this.player.level)}`.toUpperCase();
        let swarmString = `SWARM`;
        let swarmCount = `${this.player.bugs.length}/${this.player.maxBugs}`;

        let lineHeight = UTIL.GetTextHeight("", this.font) *PIXEL_SCALE + 1;
        let swarmRegionX = TILE_WIDTH * PIXEL_SCALE - this.swarmRegionW; 
        let swarmX = swarmRegionX + 0.5 * (this.swarmRegionW - UTIL.GetTextWidth(swarmString, this.font) * PIXEL_SCALE);
        let swarmCountX = swarmRegionX + 0.5 * (this.swarmRegionW - UTIL.GetTextWidth(swarmCount, this.font) * PIXEL_SCALE);

        paper(8);
        pen(12);
        rectf(-1, -1, (UTIL.GetTextWidth(lvlString, this.font)) * PIXEL_SCALE + 3, (lineHeight * 2) - 1);
        rect(-1, -1, (UTIL.GetTextWidth(lvlString, this.font)) * PIXEL_SCALE + 3, (lineHeight * 2) - 1);
        
        rectf(swarmRegionX, -1, this.swarmRegionW + 1, (lineHeight * 3));
        rect(swarmRegionX, -1, this.swarmRegionW + 1, (lineHeight * 3));



        setFont(this.font);
        pen(1);
        
        print(lvlString, 0,1);

        this.DrawProgressBar(1, lineHeight+1, this.maxLevelWidth-1, 4, this.player.exp / this.player.ExpForNextLevel());

        print(swarmString, swarmX, 1);
        print(swarmCount, swarmCountX, lineHeight + 1);

        let spawnProgress = 1;
        if(this.player.SpawningBugs())
        {
            //let progx = UTIL.GetTextWidth(swarmString, this.font) * PIXEL_SCALE + 4;
            
            //print(`[${(this.player.SpawnProgress() * 100).toFixed(1)}%] {${this.player.bugSpawnTimer.toFixed(3)}/${this.player.bugSpawnTime.toFixed(3)}}`.toUpperCase(), progx, lineHeight);
            spawnProgress = this.player.SpawnProgress();
        }
        
        let inset = 2;

        this.DrawProgressBar(swarmRegionX + inset, lineHeight * 2 + 2, this.swarmRegionW-2*inset + 1, 4, spawnProgress);
    }
    
}