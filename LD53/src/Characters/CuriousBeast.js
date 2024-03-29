import { EM, consoleLog } from "../main";
import Beast from "./Beast";
import FleeBehaviour from "./Behaviours/FleeBehaviour";
import FollowBehaviour from "./Behaviours/FollowBehaviour";
import SeekBehaviour from "./Behaviours/SeekBehaviour";

export default class CuriousBeast extends Beast
{
    constructor(startPos)
    {
        super(startPos, "CURIO");

        this.default = "seek";

        this.moveSpeed = {
            seek: 5000 * this.phys.mass,
            follow: 6000 * this.phys.mass,
            flee: 8000 * this.phys.mass
        };

        this.sprite = 19;
        this.texture = this.BuildTexture();
    }

    DefaultBehaviour()
    {
        this.behaviours = [ new SeekBehaviour(this) ]; 
    }

    ReactTo(stimulus)
    {
        super.ReactTo(stimulus);

        if(stimulus.stimType === "SEEN")
        {
            let seen = stimulus.seenBody;
            if(seen)
            {
                if(seen.tag === "PLAYER")
                {
                    this.behaviours = [ new FollowBehaviour(this, seen.obj) ];
                }
                else if(seen.obj.beastType === this.beastType)
                {
                    consoleLog("==== Try to follow beast ====");

                    if(seen.obj.FollowTarget() !== this)
                    {
                        this.behaviours = [ new FollowBehaviour(this, seen.obj) ];
                    }
                }
                else if(seen.tag === "VILLAGE")
                {
                    this.behaviours = [ new FleeBehaviour(this, seen.obj) ];
                }
            }
        }
        else if(stimulus.stimType === "WHISTLE" || stimulus.stimType === "HORN")
        {
            this.behaviours = [ new FleeBehaviour(this, stimulus.GetSource()) ]; 
        }
        else if(stimulus.stimType === "HUNTED")
        {
            this.behaviours = [ new FleeBehaviour(this, stimulus.huntedBy )]
        }
    }
}