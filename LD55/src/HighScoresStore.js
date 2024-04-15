import { consoleLog } from "./main";

export default class HighScoresStore
{
    constructor()
    {
        this.scores = {};
    }

    SaveHighScore(level, score)
    {
        this.scores[level] = score;

        consoleLog("Score saved:");
        consoleLog(this);
    }

    GetHighScore(level)
    {
        //consoleLog(`Get High Score for ${level}`);
        let highScore = 0;
        if(this.scores[level])
        {
            highScore = this.scores[level];
        }
        return highScore;
    }

}