import { UPGRADE_STRINGS } from "../Enums/UpgradeStrings";
import ParcelStore from "../GameWorld/ParcelStore";
import PermanentUpgrades from "../GameWorld/PermanentUpgrades";
import { consoleLog, CONSTANTS, EM } from "../main";
import Spacecraft from "./Spacecraft";

export default class Freighter extends Spacecraft
{
    constructor(atStation, title, gameWorld)
    {
        super(atStation, title, gameWorld, 0);
        this.parcelStore = new ParcelStore(this, 3);
        this.maxFuel = 200;
        this.fuel = this.maxFuel;

        this.permanentUpgrades = new PermanentUpgrades();
    }

    AvailableUpgrades()
    {
        let upgrades = []

        if(this.dockedStation)
        {   
            if(this.dockedStation.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_CARGO_ON_STATION) > 
                    this.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_CARGO))
            {
                upgrades.push ({ text: ["Extra Cargo Space"], cost: 200, upkeep: 5, type: "UpgradeCargo" });
            }
            
            if(this.dockedStation.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_SPEED_ON_STATION) > 
                    this.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_SPEED))
            {
                upgrades.push ({ text: ["Speed Increase"], cost: 100, upkeep: 5, type: "UpgradeSpeed" });    
            }

            if(this.dockedStation.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_FUEL_ON_STATION) > 
                    this.permanentUpgrades.PermanentUpgradeLevel(UPGRADE_STRINGS.FREIGHTER_FUEL))
            {
                upgrades.push ({ text: ["Fuel Capacity"], cost: 150, upkeep: 5, type: "UpgradeFuel" });    
            }
        }
        return upgrades;
    }

    GetSecondaryTooltip()
    {
        let tooltip = null;

        if(this.dockedStation !== null && this.parcelStore.Count() > 0)
        {
            tooltip = "Right click on a piece of cargo to transfer it instantly";
        }

        return tooltip;
    }

    GetTooltip()
    {
        let baseTooltip = "Right click on a planet/station to send this Freighter there";

        if(this.parcelStore.UnsortedParcels() > 0)
        {
            baseTooltip += CONSTANTS.SORT_TOOLTIP;
        }

        return baseTooltip;
    }
}
