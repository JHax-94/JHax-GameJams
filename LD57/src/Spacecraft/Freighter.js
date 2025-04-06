import ParcelStore from "../GameWorld/ParcelStore";
import Spacecraft from "./Spacecraft";

export default class Freighter extends Spacecraft
{
    constructor(atStation, title, gameWorld)
    {
        super(atStation, title, gameWorld, 0);
        this.parcelStore = new ParcelStore(this, 3);
        this.maxFuel = 200;
        this.fuel = this.maxFuel;
    }

    GetTooltip()
    {
        return "Right click on a planet or station to send this Freighter to it";
    }
}
