import { UP, RIGHT, DOWN, LEFT } from "./main";
import Component from "./Component";

export default class Transistor extends Component
{
    constructor(tilePos, spriteData, transistor)
    {
        super(tilePos, spriteData, "POWERED");

        this.chargesRequired = transistor.chargesRequired;
        this.connections = transistor.connections;

        this.resetOnFullyCharged = true;

        this.SetBarDirections(transistor);

        this.chargeProgress = this.AddProgressBar(this.chargeBarDir, { bg: 4, fg: 15 });
        this.ResetProgressBars();
    }

    AddCharge()
    {
        super.AddCharge();
        console.log("TRANSISTOR CHARGE:" + this.currentCharges + " / " + this.chargesRequired);
    }

    Charged()
    {
        for(var i = 0; i < this.connections.length; i ++)
        {
            this.connections[i].AddCharge();
        }
    }
}