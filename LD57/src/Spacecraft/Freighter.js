import { UPGRADE_STRINGS } from "../Enums/UpgradeStrings";
import ParcelStore from "../GameWorld/ParcelStore";
import PermanentUpgrades from "../GameWorld/PermanentUpgrades";
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
        }
        return upgrades;
    }

    GetTooltip()
    {
        return "Right click on a planet or station to send this Freighter to it";
    }
}
