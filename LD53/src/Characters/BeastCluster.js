import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE, consoleLog, getObjectConfig, getObjectConfigByProperty } from "../main";
import BeastFactory from "./BeastFactory";

export default class BeastCluster
{
    constructor(settings)
    {
        this.beastFactory = new BeastFactory();
        this.clusterType = settings.clusterType;

        this.corePos = settings.pos;

        this.spawnedBeasts = [];

        this.beastsMax = 3;

        this.radiusScale = 2;
        this.spawnTimer = 3;
        this.timeSinceLastSpawn = 0;

        this.incubators = [];

        this.SpawnBeasts(this.beastsMax);

        this.respawns = true;

        if(settings.respawns === false)
        {
            this.respawns = settings.respawns;
        }

        EM.RegisterEntity(this);
    }

    TotalSpawns()
    {
        return (this.spawnedBeasts.length + this.incubators.length);
    }

    Update(deltaTime)
    {
        this.timeSinceLastSpawn += deltaTime;

        for(let i = 0; i < this.spawnedBeasts.length; i ++)
        {
            if(this.spawnedBeasts[i].deleted)
            {
                this.spawnedBeasts.splice(i, 1);
                i --;
            }
        }

        if(this.respawns)
        {
            if(this.TotalSpawns() < this.beastsMax && this.timeSinceLastSpawn > this.spawnTimer)
            {
                this.GrowBeast();
            }    
        }
        
        for(let i = 0; i < this.incubators.length; i ++)
        {
            this.incubators[i].progress += deltaTime * 0.2;

            if(this.incubators[i].progress >= 1)
            {
                let inc = this.incubators[i];
                this.incubators.splice(i, 1);
                i --;

                this.CreateBeast(inc.pos);
            }
        }
    }

    GrowBeast()
    {
        let radius = this.TotalSpawns() * this.radiusScale;
        let angle = Math.random() * Math.PI * 2;
        let offset = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

        let beastConfig = getObjectConfigByProperty("beastType", this.clusterType);

        let beastTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        beastTex.sprite(beastConfig.boardSprite, 0, 0);
        let hatch = {
            texture: beastTex,
            pos: {
                x: this.corePos.x + offset.x,
                y: this.corePos.y + offset.y
            },
            progress: 0
        };

        this.timeSinceLastSpawn = 0;

        this.incubators.push(hatch);
    }

    CreateBeast(pos)
    {
        let newBeast = this.beastFactory.BuildABeast({
            beastType: this.clusterType,
            pos: {
                x: pos.x,
                y: pos.y
            }
        });

        this.spawnedBeasts.push(newBeast);
    }

    SpawnBeasts(count)
    {
        

        for(let spwn = 0; spwn < count; spwn ++)
        {
            let radius = spwn * this.radiusScale;

            let angle = Math.random() * Math.PI * 2;

            let offset = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

            consoleLog("Spawn at offset: ");
            consoleLog(offset);

            this.CreateBeast({ x: this.corePos.x + offset.x, y: this.corePos.y + offset.y });
        }
    }

    Draw()
    {
        for(let i = 0; i < this.incubators.length; i ++)
        {
            let inc = this.incubators[i];
            inc.texture._drawEnhanced(inc.pos.x * PIXEL_SCALE, inc.pos.y * PIXEL_SCALE, { scale: inc.progress, maintainCentre: true });
        }
    }

}