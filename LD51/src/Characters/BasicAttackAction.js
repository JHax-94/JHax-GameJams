import { consoleLog, EM, REVERSE_DIRECTION } from "../main";
import Explosion from "../World/Explosion";
import Action from "./Action";

export default class BasicAttackAction extends Action
{
    constructor()
    {
        super("Attack", "Attack");

        this.targetTiles = [];
        this.explosions = [];

        this.explosionAnim = [
            { time: 0.1, sprite: 233 },
            { time: 0.15, sprite: 231 },
            { time: 0.15, sprite: 230 },
            { time: 0.15, sprite: 231 },
            { time: 0.15, sprite: 230 },
            { time: 0.15, sprite: 231 },
            { time: 0.15, sprite: 230 }
        ];

        this.hitPlayers = [];
    }

    GetMaxExplodeNumber()
    {
        let maxExplode = -1;

        let explodes = EM.GetEntitiesStartingWith("Explode");

        for(let i = 0; i < explodes.length; i ++)
        {
            let explodeNum = parseInt(explodes[i].ENTITY_NAME.substring("Explode".length));

            if(explodeNum > maxExplode)
            {
                maxExplode = explodeNum;
            }
        }

        return maxExplode;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;

        this.targetTiles = [];
        let pattern = this.targetPlayer.stance.pattern;
        let explodeNum = this.GetMaxExplodeNumber();

        for(let i = 0; i < pattern.length; i ++)
        {
            let targetTile = this.GetOffsetTile(player.direction, player.tilePos, pattern[i]);
            this.targetTiles.push(targetTile);

            let explosion = new Explosion(targetTile, this.explosionAnim, player);

            EM.AddEntity(`Explode${explodeNum + i + 1}`, explosion);

            this.explosions.push(explosion);
        }
        
        for(let i = 0; i < this.targetTiles.length; i ++)
        {
            this.CheckForHits(this.targetPlayer, this.targetTiles[i]);   
        }
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);
        for(let i = 0; i < this.explosions.length; i ++)
        {
            this.explosions[i].SetProgress(this.GetProgress());
        }
    }

    ActionComplete()
    {
        for(let i = 0; i < this.explosions.length; i ++)
        {
            EM.RemoveEntity(this.explosions[i]);
        }
        
        super.ActionComplete();
    }
}