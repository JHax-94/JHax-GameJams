import { FrictionEquationPool } from "p2";
import Chart from "./Chart";
import { CLAM_TILES, consoleLog } from "./main";

export default class ProgressTracker
{
    constructor()
    {
        this.startTanks = 3;
        this.oxygenUpgradesFound = 0;

        this.chartDiscoveryData = [];

        this.retrievedPearls = [];
        this.maps = [];
        this.keys = [];

        this.diverUpgrades = [];
    }

    SetSavedTanks(amount)
    {
        this.oxygenUpgradesFound = amount - this.startTanks;
    }

    GetOxygenUpgrades()
    {
        return this.oxygenUpgradesFound;
    }

    GetOxygenTanks()
    {
        return this.startTanks + this.oxygenUpgradesFound;
    }

    GetMapCount()
    {
        return this.maps.length;
    }

    GetKeyCount(keyType)
    {
        var count = 0;

        for(var i = 0; i < this.keys.length; i ++)
        {
            if(this.keys[i].keyType === keyType)
            {
                count ++;
            }
        }

        return count;
    }

    GetKeys()
    {
        return this.keys;
    }

    GetChartDiscovery(chartCoords)
    {
        var entry = null;

        for(var i = 0; i < this.chartDiscoveryData.length; i ++)
        {
            if(this.chartDiscoveryData[i].coords.x === chartCoords.x && this.chartDiscoveryData[i].coords.y === chartCoords.y)
            {
                entry = this.chartDiscoveryData[i];
                break;
            }
        }

        return entry;
    }

    
    SetSavedMaps(mapList)
    {
        for(var i = 0; i < mapList.length; i ++)
        {
            var mapFound = false;
            var newMap = mapList[i];

            for(var j = 0; j < this.maps.length; j ++)
            {
                var storedMap = this.maps[j];

                if(newMap.targetTile.x === storedMap.targetTile.x && newMap.targetTile.y === storedMap.targetTile.y)
                {
                    mapFound = true;
                    break;
                }
            }

            if(!mapFound)
            {
                this.maps.push(newMap);

                var chartDiscovery = this.GetChartDiscovery(newMap.targetTile);
                var addToChartList = false;

                if(chartDiscovery === null)
                {
                    var chartRecord = {};
                    addToChartList = true;
                    chartRecord.coords = { x: newMap.targetTile.x, y: newMap.targetTile.y };

                    chartRecord.foundClamsCount = 0;
                    chartRecord.foundChestsCount = 0;
                    chartRecord.clams = [];
                    chartRecord.chests = [];

                    this.chartDiscoveryData.push(chartRecord);
                }
            }
        }
    }

    SetSavedKeys(keyList)
    {
        for(var i = 0; i < keyList.length; i ++)
        {
            this.keys.push(keyList[i]);
        }
    }

    SetUsedKeys(usedKeyList)
    {
        for(var i = 0; i < usedKeyList.length; i ++)
        {
            for(var j = 0; j < this.keys.length; j ++)
            {
                if(this.keys[j].keyType === usedKeyList[i].keyType)
                {
                    this.keys.splice(j, 1);
                    break
                }
            }
        }
    }

    SetSavedPearls(pearlList)
    {
        for(var i = 0; i < pearlList.length; i ++)
        {
            var pearlFound = false;

            var newPearl = pearlList[i];

            for(var j = 0; j < this.retrievedPearls.length; j ++)
            {
                var storedPearl = this.retrievedPearls[j];

                if(newPearl.pearlId === storedPearl.pearlId)
                {
                    pearlFound = true;
                    break;
                }
            }

            if(!pearlFound)
            {
                this.retrievedPearls.push(newPearl);
            }
        }
    }

    SaveSeaBedProgress(seaBed)
    {
        consoleLog("SAVING SEA BED...");
        consoleLog(seaBed);
        consoleLog("Look for chart entry...");
        var chartRecord = this.GetChartDiscovery(seaBed.chartEntry.location);

        var pushRecord = false;

        if(chartRecord === null)
        {
            chartRecord = {};

            pushRecord = true;
            chartRecord.coords = { x: seaBed.chartEntry.location.x, y: seaBed.chartEntry.location.y };
        }

        
        // SAVE CLAM STATES
        chartRecord.clams = [];
        consoleLog("SAVE CLAMS");
        consoleLog(seaBed.clams);      
        var foundClamsCount = 0;
        
        for(var i = 0; i < seaBed.clams.length; i ++)
        {
            var clam = seaBed.clams[i];
            
            chartRecord.clams.push({
                coords: clam.initialTilePos,
                state: clam.state
            });

            if(clam.state === 1)
            {
                foundClamsCount ++;
            }
        }
        chartRecord.foundClamsCount = foundClamsCount;

        chartRecord.chests = [];
        consoleLog("SAVE CHESTS");
        consoleLog(seaBed.chests);

        var foundChestsCount = 0;
        for(var i = 0; i < seaBed.chests.length; i ++)
        {
            var chest = seaBed.chests[i];

            chartRecord.chests.push({
                coords: chest.initialTilePos,
                state: chest.state
            });

            if(chest.state === 1)
            {
                foundChestsCount ++;
            }
        }

        chartRecord.foundChestsCount = foundChestsCount;

        chartRecord.contentsKnown = chartRecord.contentsKnown ? chartRecord.contentsKnown : (chartRecord.foundChestsCount > 0 || chartRecord.foundClamsCount > 0 || seaBed.minDepthReached);

        if(pushRecord)
        {
            this.chartDiscoveryData.push(chartRecord);
        }
        
        consoleLog("SAVED STATE");
        consoleLog(chartRecord);
        consoleLog(this.chartDiscoveryData);
    }
}