import { EM } from "../main";
import DeliveryTutorial from "./DeliveryTutorial";
import GameOverTutorial from "./GameOverTutorial";
import LoadFreighterTutorial from "./LoadFreighterTutorial";
import SelectPlanetTutorial from "./SelectPlanetTutorial";
import SelectTutorial from "./SelectTutorial";
import SendTutorial from "./SendTutorial";
import SortingTutorial from "./SortingTutorial";

export default class TutorialControl
{
    constructor(gameWorld)
    {
        this.renderLayer = "TUTORIAL";
        this.gameWorld = gameWorld;
        //this.player = gameWorld.player;

        this.currentStep = -1;

        this.tutorial = [
            new SortingTutorial(this),
            new SelectTutorial(this),
            new SendTutorial(this),
            new SelectPlanetTutorial(this),
            new LoadFreighterTutorial(this),
            new DeliveryTutorial(this),
            new GameOverTutorial(this)
        ];

        EM.RegisterEntity(this);
        this.SetStep(0);
    }

    TutorialOn()
    {
        return this.currentStep >= 0 && this.tutorial.length > 0;
    }

    NextStep()
    {
        let nextStep = this.currentStep + 1;
        
        if(nextStep >= this.tutorial.length)
        {
            this.currentStep = -1;
        }
        else
        {
            this.SetStep(nextStep);
        }
    }

    SetStep(step)
    {
        this.currentStep = step;
        this.tutorial[this.currentStep].Activate();
    }

    Update(deltaTime)
    {
        if(this.TutorialOn())
        {
            if(this.tutorial[this.currentStep].CheckTutorialEnd(deltaTime))
            {
                this.NextStep();
            }
        }
    }

    Draw()
    {
        EM.hudLog.push(`Tutorial: ${this.TutorialOn()}`);

        if(this.TutorialOn())
        {
            this.tutorial[this.currentStep].DrawTutorial();
        }
    }
}