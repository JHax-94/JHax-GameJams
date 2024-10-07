import { EM } from "../main";
import DroneTutorial from "./DroneTutorial";
import EndGameTutorial from "./EndGameTutorial";
import EnemyTutorial from "./EnemyTutorial";
import HiveTutorial from "./HiveTutorial";
import MoveTutorial from "./MoveTutorial";
import WaggleTutorial from "./WaggleTutorial";

export default class TutorialControl
{
    constructor(gameWorld)
    {
        this.renderLayer = "TUTORIAL";
        this.gameWorld = gameWorld;
        this.player = gameWorld.player;

        this.currentStep = -1;

        this.tutorial = [
            new MoveTutorial(this),
            new HiveTutorial(this),
            new DroneTutorial(this),
            new WaggleTutorial(this),
            new EnemyTutorial(this),
            new EndGameTutorial(this)
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
        if(this.TutorialOn())
        {
            this.tutorial[this.currentStep].DrawTutorial();
        }
    }
}