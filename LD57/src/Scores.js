export default class Scores
{
    constructor()
    {
        this.highScore = 0;


        this.useBrowserStorage = false;

        try
        {   
            window.localStorage.setItem("gameLoaded", getDate());
            this.useBrowserStorage = true;
        }
        catch(e)
        {
            console.error("Can't save high scores to browser, use memory");
        }

        if(this.useBrowserStorage)
        {
            let highScore = window.localStorage.getItem("highScore");

            if(!highScore)
            {
                this.highScore = 0;
            }
        }
    }

    ClearAll()
    {
        if(this.useBrowserStorage)
        {
            window.localStorage.clear();
        }

        this.highScore = 0;
    }

    GetHighScore()
    {
        return this.highScore;
    }

    SetHighScore(score)
    {
        this.highScore = score;

        if(this.useBrowserStorage)
        {
            window.localStorage.setItem("highScore", this.highScore);
        }
    }
}