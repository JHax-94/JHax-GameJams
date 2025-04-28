import { consoleLog } from "./main";

export default class Scores
{
    constructor()
    {
        this.scoreStore = {
            highScore: this.CreateHighScoreObject(),
            chillModeHighScore: this.CreateHighScoreObject()
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
            this.scoreStore.highScore = this.FetchHighScoreObject("highScore");
            this.scoreStore.chillModeHighScore = this.FetchHighScoreObject("chillModeHighScore");    
        
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

    FetchHighScoreObject(keyName)
    {
        let highScore = window.localStorage.getItem(keyName);

        let highScoreObj = null;

        if(!highScore)
        {
            highScoreObj = this.CreateHighScoreObject();
        }
        else
        {
            let parsedHighscore = JSON.parse(highScore);

            if(parsedHighscore.score == undefined)
            {
                highScoreObj = {
                    score: parsedHighscore,
                    days: 0,
                    parcels: 0
                }
            }
            else
            {
                highScoreObj = parsedHighscore;
            }
        }

        return highScoreObj;
    }

    CreateHighScoreObject()
    {
        return {
            score: 0,
            days: 0,
            parcels: 0
        };
    }

    ClearAll()
    {
        if(this.useBrowserStorage)
        {
            window.localStorage.clear();
        }

        for(let key in this.scoreStore)
        {
            this.scoreStore[key] = this.CreateHighScoreObject();
        }
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

    GetHighScore(scoreKey)
    {
        return this.scoreStore[scoreKey];
    }

    SetHighScore(score, scoreKey)
    {
        this.scoreStore[scoreKey] = score;
        
        if(this.useBrowserStorage)
        {
            window.localStorage.setItem(scoreKey, JSON.stringify(score));
        }
    }
}