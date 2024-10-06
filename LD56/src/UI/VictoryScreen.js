import EndScreen from "./EndScreen";

export default class VictoryScreen extends EndScreen
{
    constructor()
    {
        super("Victory!");

        this.BuildButtons([ "Play Again" ]);
    }

    Draw()
    {
        super.Draw();

        this.DrawCentredText("The hive has successfully relocated!");
    }
}