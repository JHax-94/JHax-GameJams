import { EM } from "../main";
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
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;

        this.targetTile = this.GetTargetTile(player.direction, player.tilePos);

        this.explosion = new Explosion(this.targetTile, this.explosionAnim);
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