import InventoryItem from "./InventoryItem";
import { em } from "./main";

export default class InventoryDisplay
{
    constructor(tileRect, dataStore)
    {
        this.data = dataStore;

        this.oxygenDisplay = new InventoryItem(tileRect, 142, dataStore.GetOxygenUpgrades());
    }
}