import { EM, PIXEL_SCALE, UTIL } from "../main";

export default class PlayerStatusUi
{
    constructor(player)
    {
        this.player = player;
        EM.RegisterEntity(this);
    }

    Draw()
    {
        let lineHeight = UTIL.GetTextHeight("", null) *PIXEL_SCALE + 1;

        let lvlString = `Level ${this.player.level} [${this.player.exp}/${this.player.ExpForNextLevel()}]`;
        print(lvlString, 0, 0);

        let swarmString = `Swarm: ${this.player.bugs.length}/${this.player.maxBugs}`;
        print(swarmString, 0, lineHeight);
        if(this.player.SpawningBugs())
        {
            let progx = UTIL.GetTextWidth(swarmString) * PIXEL_SCALE + 4;

            print(`[${(this.player.SpawnProgress() * 100).toFixed(1)}%]`, progx, lineHeight);
        }
    }
    
}