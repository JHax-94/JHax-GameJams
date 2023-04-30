import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog } from "../main";
import Shadow from "./Shadow";
import GrazeBehaviour from "./Behaviours/GrazeBehaviour";
import FollowBehaviour from "./Behaviours/FollowBehaviour";
import Whistle from "../PlayerActions/Whistle";
import Beast from "./Beast";
import FleeBehaviour from "./Behaviours/FleeBehaviour";

let BEAST_BEHAVIOUR = {
    GRAZE: 0,
    WANDER: 1
};

export default class WhistleBeast extends Beast
{

    constructor(startPos)
    {
        super(startPos, "WHISTLE");

        this.sprite = 18;

        this.texture = this.BuildTexture();

        this.default = "graze";

        this.moveSpeed = {
            graze: 1000 * this.phys.mass,
            follow: 6000 * this.phys.mass,
            flee: 8000 * this.phys.mass
        };

        this.whistle = new Whistle(this);
    }

    DefaultBehaviour()
    {
        this.behaviours = [ new GrazeBehaviour(this) ]
    }

    ReactTo(stimulus)
    {
        super.ReactTo(stimulus);

        if(stimulus.stimType === "WHISTLE")
        {
            consoleLog("Heard whistle!");
            let source = stimulus.GetSource();

            if((source.FollowTarget && source.FollowTarget() !== this))
            {
                this.behaviours = [ new FollowBehaviour(this, stimulus.GetSource()) ]; 
            }
        }
        else if(stimulus.stimType === "HORN")
        {
            let source = stimulus.GetSource();
            
            this.behaviours = [ new FleeBehaviour(this, source)];

        }
        else if(stimulus.stimType === "COLLISION")
        {
            if(stimulus.collisionWith.beastType === this.beastType)
            {
                if(stimulus.chosen && this.HasBehaviour("FOLLOW") === false)
                {
                    this.whistle.Activate();
                }
            }
        }
        else if(stimulus.stimType === "HUNTED")
        {
            this.behaviours = [ new FleeBehaviour(this, stimulus.huntedBy )]
        }
    }

    DeleteBeastInternal()
    {
        EM.RemoveEntity(this.whistle);
    }

    UpdateInternal(deltaTime)
    {
        this.whistle.Act(deltaTime);
    }
}