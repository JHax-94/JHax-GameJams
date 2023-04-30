import { consoleLog } from "../main";
import Beast from "./Beast";
import FeedBehaviour from "./Behaviours/FeedBehaviour";
import FleeBehaviour from "./Behaviours/FleeBehaviour";
import FollowBehaviour from "./Behaviours/FollowBehaviour";
import HuntBehaviour from "./Behaviours/HuntBehaviour";

export default class HunterBeast extends Beast
{
    constructor(startPos)
    {
        super(startPos, "HUNTER");

        this.default = "hunt";

        this.moveSpeed = {
            hunt: 5000 * this.phys.mass,
            follow: 8500 * this.phys.mass,
            flee: 8000 * this.phys.mass
        };

        this.sprite = 20;
        this.texture = this.BuildTexture();

        this.shadow.offset.y = 6;
    }

    DefaultBehaviour()
    {
        this.behaviours = [ new HuntBehaviour(this) ]; 
    }

    ReactTo(stimulus)
    {
        super.ReactTo(stimulus);
        if(stimulus.stimType === "SEEN")
        {
            let seen = stimulus.seenBody;
            if(seen)
            {
                if(seen.obj.beastType && seen.obj.beastType !== this.beastType)
                {
                    if(seen.obj.FollowTarget() !== this)
                    {
                        this.behaviours = [ new FollowBehaviour(this, seen.obj, { minDist: 0, followToDistance: 0 }) ];

                        seen.obj.ReactTo({
                            stimType: "HUNTED",
                            huntedBy: this
                        });
                    }
                }
                else if(seen.tag === "VILLAGE")
                {
                    this.behaviours = [ new FleeBehaviour(this, seen.obj) ];
                }
            }
        }
        else if(stimulus.stimType === "COLLISION")
        {
            if(stimulus.collisionWith.beastType && stimulus.collisionWith.beastType !== this.beastType)
            {
                consoleLog("Feed on: ");
                consoleLog(stimulus.collisionWith);
                this.behaviours = [ new FeedBehaviour(this, stimulus.collisionWith) ]; 
            }
        }
    }
}