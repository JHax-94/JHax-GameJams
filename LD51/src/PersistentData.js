import { consoleLog } from "./main";

export default class PersistentData
{
    constructor()
    {
        this.SetDefaultValues();
    }

    SetDefaultValues()
    {
        this.player1Wins = 0;
        this.player2Wins = 0;
    }

    ResetScores()
    {
        this.player1Wins = 0;
        this.player2Wins = 0;
    }

    SetPlayer1Wins(amnt)
    {
        this.player1Wins = amnt;
    }

    SetPlayer2Wins(amnt)
    {
        this.player1Wins = amnt;
    }

    IncrementPlayerScore(player, by)
    {
        consoleLog(`Increment score:`)
        consoleLog(player);
        consoleLog(by);

        if(player === 1)
        {
            this.SetPlayer1Wins(this.player1Wins + by);
        }
        else if(player === 2)
        {
            this.SetPlayer2Wins(this.player2Wins + by);
        }
    }
}