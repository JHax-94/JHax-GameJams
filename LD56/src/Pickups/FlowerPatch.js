import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import Swarm from "../TinyCreatures/Swarm";

export default class FlowerPatch extends Swarm
{
    constructor(pos, flowerPop)
    {
        super(pos, 
        { 
            tag: "FLOWER", 
            collisionGroup: COLLISION_GROUP.PLAYER, 
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY),
            renderLayer: "WORLD"
        });
    
        this.bugType = {
            colors: [9, 10],
            tag: "PLAYER_BUG",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.ENEMY | COLLISION_GROUP.PLAYER | COLLISION_GROUP.PICKUP),
            perceptionTag: "PLAYER_PERCEPTION",
            perceptionMask: (COLLISION_GROUP.ENEMY | COLLISION_GROUP.PICKUP),
            speed: 2.5 * PIXEL_SCALE,
            onFlower: true
        };

        this.maxBugs = flowerPop;

        this.sprites = [6, 7, 22, 23];
        this.sprite = this.sprites[random(this.sprites.length)]

        this.SpawnBug();
        consoleLog("--FLOWER SPAWNED BUG--");
        consoleLog(this.bugs);

        this.player = null;

        this.respawnTimer = 0;
    }

    Player()
    {
        if(this.player === null)
        {
            this.player = this.GameWorld().player;
        }

        return this.player;
    }

    RespawnTime()
    {
        let player = this.Player();

        let respawnTime = player.bugSpawnTime * 2;

        return respawnTime;
    }

    Update(deltaTime)
    {
        if(this.bugs.length < this.maxBugs)
        {
            this.respawnTimer += deltaTime * this.Player().bugRespawnRate;

            if(this.respawnTimer > this.RespawnTime())
            {
                this.respawnTimer -= this.RespawnTime();
                this.SpawnBug();
            }
        }
    }

    Draw()
    {
        //EM.hudLog.push(`Flower bugs: ${this.bugs.length} [ ${this.respawnTimer.toFixed(3)}/${this.RespawnTime().toFixed(3)}]`);
        let screenPos = this.GetScreenPos();

        sprite(this.sprite, screenPos.x, screenPos.y);
    }
}