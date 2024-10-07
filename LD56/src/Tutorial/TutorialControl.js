import { EM } from "../main";
import MoveTutorial from "./MoveTutorial";

export default class TutorialControl
{
    constructor(gameWorld)
    {
        this.renderLayer = "SUPER_UI";
        this.gameWorld = gameWorld;
        this.player = gameWorld.player;

        this.currentStep = 0;

        this.tutorial = [
            new MoveTutorial(this)
        ];

        EM.RegisterEntity(this);
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
            this.currentStep = nextStep;
        }
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
        if(this.TutorialOn())
        {
            this.tutorial[this.currentStep].DrawTutorial();
        }
    }
}