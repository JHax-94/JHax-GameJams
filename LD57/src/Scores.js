import { consoleLog } from "./main";

export default class Scores
{
    constructor()
    {
        this.highScore = {
            score: 0,
            days: 0,
            parcels: 0
        };

        this.userPrefs = {
            tutorialOn: true,
            chillMode: false,
        };

        this.useBrowserStorage = false;

        try
        {   
            window.localStorage.setItem("gameLoaded", Date.now());    
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
                this.highScore = {
                    score: 0,
                    days: 0,
                    parcels: 0
                };
            }
            else
            {
                let parsedHighscore = JSON.parse(highScore);

                if(parsedHighscore.score == undefined)
                {
                    this.highScore = {
                        score: parsedHighscore,
                        days: 0,
                        parcels: 0
                    }
                }
                else
                {
                    this.highScore = parsedHighscore;
                }
            }
        
            let tutorialOn = window.localStorage.getItem("tutorialOn");
            
            if(tutorialOn !== null)
            {
                this.userPrefs.tutorialOn = tutorialOn.toLowerCase() === "true";
            }

            let chillMode = window.localStorage.getItem("chillMode");
            
            if(chillMode !== null)
            {
                this.userPrefs.chillMode = chillMode.toLowerCase() === "true";
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

    SetPrefs(prefsObject)
    {
        this.userPrefs = prefsObject;

        if(this.useBrowserStorage)
        {
            for(let key in this.userPrefs)
            {
                window.localStorage.setItem(key, this.userPrefs[key]);
            }
        }
    }

    GetPrefs()
    {
        return this.userPrefs;
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
            window.localStorage.setItem("highScore", JSON.stringify(this.highScore));
        }
    }
}