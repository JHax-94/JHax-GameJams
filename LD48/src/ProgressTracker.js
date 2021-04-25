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
}