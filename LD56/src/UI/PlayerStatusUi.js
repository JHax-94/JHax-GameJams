import { getDefaultTweener } from "tina";
import { EM, getFont, PIXEL_SCALE, setFont, UTIL } from "../main";

export default class PlayerStatusUi
{
    constructor(player)
    {
        this.renderLayer = "UI";

        this.font = getFont("LargeNarr");

        this.player = player;
        EM.RegisterEntity(this);
    }

    Draw()
    {
        setFont(this.font);
        pen(1);
        let lineHeight = UTIL.GetTextHeight("", this.font) *PIXEL_SCALE + 1;

        let lvlString = `Level ${this.player.level} [${this.player.exp}/${this.player.ExpForNextLevel()}]`.toUpperCase();
        print(lvlString, 0, 0);

        let swarmString = `Swarm: ${this.player.bugs.length}/${this.player.maxBugs}`.toUpperCase();
        print(swarmString, 0, lineHeight);
        if(this.player.SpawningBugs())
        {
            let progx = UTIL.GetTextWidth(swarmString, this.font) * PIXEL_SCALE + 4;

            print(`[${(this.player.SpawnProgress() * 100).toFixed(1)}%] {${this.player.bugSpawnTimer.toFixed(3)}/${this.player.bugSpawnTime.toFixed(3)}}`.toUpperCase(), progx, lineHeight);
        }
    }
    
}