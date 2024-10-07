import Upgrade from "./Upgrade";

export default class UpgradeFlowerPopulation extends Upgrade
{
    constructor(amount)
    {
        super(`Scouts Per Flower +${amount}`);
        this.amount = amount;
    }

    ApplyUpgrade()
    {
        let flowerSpawner = this.GameWorld().flowerSpawner;

        flowerSpawner.IncreaseFlowerLimit(this.amount);
    }

}