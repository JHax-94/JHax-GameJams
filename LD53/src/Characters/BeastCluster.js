import { EM } from "../main";
import BeastFactory from "./BeastFactory";

export default class BeastCluster
{
    constructor(settings)
    {
        this.beastFactory = new BeastFactory();
        this.clusterType = settings.clusterType;

        this.corePos = settings.pos;

        this.spawnedBeasts = [];

        this.SpawnBeasts(3);

        EM.RegisterEntity(this);
    }

    Update(deltaTime)
    {
        for(let i = 0; i < this.spawnedBeasts.length; i ++)
        {
            if(this.spawnedBeasts[i].deleted)
            {
                this.spawnedBeasts.splice(i, 1);
                i --;
            }
        }

        if(this.spawnedBeasts.length === 0)
        {
            this.SpawnBeasts(3);
        }
    }

    SpawnBeasts(count)
    {
        let radius = 0;

        for(let spwn = 0; spwn < count; spwn ++)
        {
            let angle = Math.random() * Math.PI * 2;

            let offset = { x: radius * Math.cos(angle), y: Math.sin(angle) };

            let newBeast = this.beastFactory.BuildABeast({
                beastType: this.clusterType,
                pos: {
                    x: this.corePos.x + offset.x,
                    y: this.corePos.y + offset.y
                }
            });

            this.spawnedBeasts.push(newBeast);
        }
    }

}