import { consoleLog, EM, REVERSE_DIRECTION } from "../main";
import Explosion from "../World/Explosion";
import Action from "./Action";

export default class BasicAttackAction extends Action
{
    constructor()
    {
        super("Attack");

        this.targetTile = null;

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

    ExecuteAction(player)
    {
        this.targetPlayer = player;

        this.targetTile = this.GetTargetTile(player.direction, player.tilePos);

        this.explosion = new Explosion(this.targetTile, this.explosionAnim, player);

        let explodes = EM.GetEntitiesStartingWith("Explode");

        let maxExplode = -1;

        for(let i = 0; i < explodes.length; i ++)
        {
            consoleLog("WORK OUT EXPLOSION NUMBER");
            consoleLog(explodes[i]);

            let explodeNum = parseInt(explodes[i].ENTITY_NAME.substring("Explode".length));

            if(explodeNum > maxExplode)
            {
                maxExplode = explodeNum;
            }
        }

        EM.AddEntity(`Explode${maxExplode+1}`, this.explosion);

        this.CheckForHits(this.targetPlayer, this.targetTile);   
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);
        this.explosion.SetProgress(this.GetProgress());
    }

    ActionComplete()
    {
        EM.RemoveEntity(this.explosion);
        super.ActionComplete();
        
    }
    
}