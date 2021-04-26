import { ContactMaterial, FrictionEquationPool } from "p2";
import Chart from "./Chart";
import { CLAM_TILES, consoleLog, STORAGE_KEY } from "./main";

export default class ProgressTracker
{
    constructor(saveData)
    {
        if(saveData)
        {
            this.startTanks = saveData.startTanks;
            this.oxygenUpgradesFound = saveData.oxygenUpgradesFound;
            this.chartDiscoveryData = saveData.chartDiscoveryData;
            this.retrievedPearls = saveData.retrievedPearls;
            this.maps = saveData.maps;
            this.keys = saveData.keys;
            this.oxygenTopUp = saveData.oxygenTopUp;
            this.jetCount = saveData.jetCount;
            this.diverUpgrades = saveData.diverUpgrades;
        }
        else
        {
            this.startTanks = 3;
            this.oxygenUpgradesFound = 0;

            this.chartDiscoveryData = [];

            this.retrievedPearls = [];
            this.maps = [];
            //this.keys = [ { keyType: "RED" }, { keyType: "GREEN" }, { keyType: "PURPLE" }];
            this.keys = [];

            this.oxygenTopUp = 0;

            this.jetCount = 0;

            this.diverUpgrades = [];
        }

        this.hints = assets.hintData.hints;
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

    SaveOxygenTopUps(diver)
    {
        this.oxygenTopUp = diver.oxygenTopUps;
    }

    GetOxygenTopUps()
    {
        return this.oxygenTopUp;
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

    SaveJet(diver)
    {
        if(this.jetCount === 0 && diver.hasJet)
        {
            this.jetCount = 1;
        }
    }

    GetJetCount()
    {
        return this.jetCount;
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
        consoleLog("SAVED MAPS....");
        consoleLog(mapList);

        for(var i = 0; i < mapList.length; i ++)
        {
            var mapFound = false;
            var newMap = mapList[i];

            var getHint = this.maps.length;

            this.maps.push(mapList[i]);

            if(getHint < this.hints.length)
            {
                var hint = this.hints[getHint];
                
                newMap.targetTile = hint.targetTile;

                consoleLog("REVEAL TILE: ");
                consoleLog(newMap.targetTile);

                /*
                for(var j = 0; j < this.maps.length; j ++)
                {
                    var storedMap = this.maps[j];

                    if(newMap.targetTile.x === storedMap.targetTile.x && newMap.targetTile.y === storedMap.targetTile.y)
                    {
                        mapFound = true;
                        break;
                    }
                }*/

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
                    chartRecord.contentsKnown = true;

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
                    break;
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
                coords: { x: clam.initialTilePos.mapX, y: clam.initialTilePos.mapY },
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
                coords: { x: chest.initialTilePos.mapX, y: chest.initialTilePos.mapY },
                state: chest.state
            });

            if(chest.state === 1)
            {
                foundChestsCount ++;
            }
        }

        chartRecord.foundChestsCount = foundChestsCount;

        chartRecord.contentsKnown = chartRecord.contentsKnown ? chartRecord.contentsKnown : (chartRecord.foundChestsCount > 0 || chartRecord.foundClamsCount > 0 || seaBed.minDepthReached);

        chartRecord.doors = [];

        for(var i = 0; i < seaBed.doors.length; i++)
        {
            var door = seaBed.doors[i];

            chartRecord.doors.push({
                coords: { x: door.initialTilePos.mapX, y: door.initialTilePos.mapY },
                state: door.state
            })
            chartRecord.doors.push()
        }

        if(pushRecord)
        {
            this.chartDiscoveryData.push(chartRecord);
        }
        
        consoleLog("SAVED STATE");
        consoleLog(chartRecord);
        consoleLog(this.chartDiscoveryData);
    }

    Persist()
    {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
    }
}