import BeastFactory from "./Characters/BeastFactory";
import Player from "./Characters/Player";
import Village from "./Villages/Village";
import { consoleLog } from "./main";

export default class LevelMap
{
    /*
        levelData = {
            playerSpawn: { },
            villages: [
                { 
                    pos: { },
                    requests: {
                        beastType: "",
                        quantity: 3
                    }
                }
            ],
            beasts: [
                { beastType: "", pos: {}} } ...
            ]
        }
    */

    constructor(levelData)
    {
        this.beastFactory = new BeastFactory();
        this.SpawnPlayer(levelData);
        this.SpawnVillages(levelData);
        this.SpawnBeasts(levelData);
    }   

    SpawnPlayer(levelData)
    {
        new Player(levelData.playerSpawn);
    }

    SpawnVillages(levelData)
    {
        for(let i = 0; i< levelData.villages.length; i ++)
        {
            let v = levelData.villages[i];

            let village = new Village(v.pos);
            for(let r = 0; r < v.requests.length; r ++)
            {
                village.AddRequest(v.requests[r]);
            }
        }
    }

    SpawnBeasts(levelData)
    {
        for(let i = 0; i < levelData.beasts.length; i ++)
        {
            let beast = levelData.beasts[i];

            this.beastFactory.BuildABeast(beast);
        }
    }
}