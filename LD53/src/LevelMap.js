import BerryBush from "./BerryBush";
import BeastCluster from "./Characters/BeastCluster";
import BeastFactory from "./Characters/BeastFactory";
import Player from "./Characters/Player";
import MapLayer from "./MapLayer";
import TutorialMenu from "./Menus/TutorialMenu";
import WinMenu from "./Menus/WinMenu";
import Obstacle from "./Obstacle";
import Village from "./Villages/Village";
import { EM, consoleLog, getObjectConfig, getPlayerPref } from "./main";

export default class LevelMap
{
    /*
        levelData = {
            playerSpawn: { },
            "terrain": [
                { "mapName": "curious_terrain", "offset": { "x": 0, "y": 0 } }  
            ],
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
        this.villages = [];

        this.levelData = levelData;

        this.beastFactory = new BeastFactory();
        this.BuildTerrain(levelData);
        this.SpawnPlayer(levelData);
        this.SpawnVillages(levelData);
        this.SpawnBeasts(levelData);

        EM.AddEntity("LEVEL_MANAGER", this)

        this.tutNumber = 0;

        if(this.levelData.tutorials && this.levelData.tutorials.length > 0);
        {
            this.ShowCurrentTutorial();
        }
    }   

    ShowCurrentTutorial()
    {
        let displayed = false;

        if(this.levelData.tutorials && this.levelData.tutorials.length > this.tutNumber)
        {
            let tut = this.levelData.tutorials[this.tutNumber];

            let seen = getPlayerPref(`seenTutorial_${tut.tutorialId}`);

            if(!seen)
            {
                let tutConfig = getObjectConfig(tut.config);

                new TutorialMenu(tut.tutorialId, tutConfig);
                EM.pause = true;

                displayed = true;
            }
            else 
            {
                this.NextTutorial();
            }
        }

        return displayed;
    }

    NextTutorial()
    {
        this.tutNumber ++;

        let showing = this.ShowCurrentTutorial();

        if(!showing || this.tutNumber >= this.levelData.tutorials.length)
        {
            EM.pause = false;
        }
    }

    VillageRequestCompleted()
    {
        let allComplete = true;

        for(let i = 0; i < this.villages.length; i ++)
        {
            if(!this.villages[i].requestCompleted)
            {
                allComplete = false;
                break;
            }
        }

        if(allComplete)
        {
            let winConf = getObjectConfig("WinMenu", true);

            new WinMenu(this.levelData, winConf);
        }

    }

    BuildTerrain(levelData)
    {
        if(levelData.terrain)
        {
            for(let i = 0; i < levelData.terrain.length; i ++)
            {
                let tmap = levelData.terrain[i];

                let map = getMap(tmap.mapName);

                if(map)
                {
                    this.ScanMap(map, !tmap.hide)
                }
                else
                {
                    console.warn(`Could not find map to scan: ${tmap.mapName}`);
                }
            }
        }
    }

    ScanMap(map, renderMap)
    {
        consoleLog("SCAN MAP");
        consoleLog(map)

        let scanableTiles = assets.objectConfig.objectMap.filter(om => !!om.scanIndex);

        for(let i = 0; i < scanableTiles.length; i ++)
        {
            let tileType = scanableTiles[i];

            let scanTiles = map.find(tileType.scanIndex);

            for(let ti = 0; ti < scanTiles.length; ti ++)
            {
                if(["Coast", "CoastCorner", "CoastCornerIn", "Sea"].indexOf(tileType.name) >= 0)
                {
                    new Obstacle(scanTiles[ti], tileType.obstacleType);
                }
                else if(["BerryBush"].indexOf(tileType.name) >= 0)
                {
                    new BerryBush(scanTiles[ti], tileType.obstacleType);
                }
            }
        }

        if(renderMap)
        {
            //consoleLog("Renderable map...");
            new MapLayer(map);
        }
        
    }

    SpawnPlayer(levelData)
    {
        let startInventory = levelData.inventory;

        let player = new Player(levelData.playerSpawn, startInventory);

        EM.AddEntity("PLAYER", player);
    }

    SpawnVillages(levelData)
    {
        for(let i = 0; i< levelData.villages.length; i ++)
        {
            let v = levelData.villages[i];

            let village = new Village(v.pos);

            if(v.requests)
            {
                for(let r = 0; r < v.requests.length; r ++)
                {
                    village.AddRequest(v.requests[r]);
                }
            }

            if(v.shop)
            {
                village.AddShop(v.shop);
            }

            this.villages.push(village);
        }
    }

    SpawnBeasts(levelData)
    {
        if(levelData.beasts)
        {
            for(let i = 0; i < levelData.beasts.length; i ++)
            {
                let beast = levelData.beasts[i];
                if(beast.beastType)
                {
                    this.beastFactory.BuildABeast(beast);
                }
                else if(beast.clusterType)
                {
                    new BeastCluster(beast);
                }

                
            }
        }
    }
}