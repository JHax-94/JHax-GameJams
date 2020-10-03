import Component from "./Component";

export default class Transistor extends Component
{
    constructor(tilePos, spriteData, transistor)
    {
        super(tilePos, spriteData, "POWERED");

        this.chargesRequired = transistor.chargesRequired;
        this.connections = transistor.connections;

        this.resetOnFullyCharged = true;
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