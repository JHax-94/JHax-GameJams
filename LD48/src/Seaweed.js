import BubbleCluster from "./BubbleCluster";
import { consoleLog, em, JET_SPRITE, SEAWEED_TILES } from "./main";

export default class Seaweed 
{
    constructor(position, spriteIndex, map)
    {
        consoleLog("SEAWEED POSITION");
        consoleLog(position);
        this.initialTilePos = position;
        this.spriteIndex = spriteIndex; 
        var physicsParams = {
            tileTransform: { 
                x: position.x,
                y: position.y,
                w: 1,
                h: 1
            },
            isSensor: true,
            isKinematic: true,
            tag: "SEAWEED",
            mass: 1
        };

        em.AddPhys(this, physicsParams);
        em.AddRender(this);

        this._wiggleTime = 0.4;
        this.wiggleTimer = this._wiggleTime;

        this._spawnTime = this.SpawnTime();
        this.spawnTimer = random(9);

        map.remove(this.initialTilePos.mapX, this.initialTilePos.mapY);

        this.flip = random(2) == 1;

        em.AddUpdate(this);
    }

    SpawnTime()
    {
        return 16 + random(8);
    }

    SpawnPos()
    {
        var spawnPos = {x: this.initialTilePos.x, y: this.initialTilePos.y - 0.5};

        return spawnPos;
    }

    SpawnBubble()
    {
        new BubbleCluster(this.SpawnPos());
    }

    Update(deltaTime)
    {
        this.wiggleTimer -= deltaTime;

        if(this.wiggleTimer <= 0)
        {
            this.wiggleTimer = this._wiggleTime;
            this.flip = !this.flip;
        }

        this.spawnTimer -= deltaTime;
        
        if(this.spawnTimer <= 0)
        {
            this.spawnTimer = this.SpawnTime();
            this.SpawnBubble();
        }
    }

    Draw()
    {
        var position = em.GetPosition(this);
        
        sprite(SEAWEED_TILES[this.flip ? 1 : 0], position.x, position.y);
    }

}