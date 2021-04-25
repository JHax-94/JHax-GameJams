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

        chartRecord.contentsKnown = chartRecord.contentsKnown ? chartRecord.contentsKnown : (chartRecord.foundChestsCount > 0 || chartRecord.foundClamsCount > 0);

        if(pushRecord)
        {
            this.chartDiscoveryData.push(chartRecord);
        }
        
        consoleLog("SAVED STATE");
        consoleLog(chartRecord);
        consoleLog(this.chartDiscoveryData);
    }
}