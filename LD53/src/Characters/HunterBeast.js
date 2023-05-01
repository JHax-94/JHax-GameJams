import { consoleLog } from "../main";
import Beast from "./Beast";
import ChaseBehaviour from "./Behaviours/ChaseBehaviour";
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

        this.fedTime = 16;
        this.fedTimer = 0;

        this.shadow.offset.y = 6;
    }

    IsHungry()
    {
        let isHungry = this.fedTimer <= 0;
        consoleLog(`Is hungry? ${this.fedTimer}: ${isHungry}`);
        return isHungry;
    }

    UpdateInternal(deltaTime)
    {
        if(this.fedTimer > 0)
        {
            this.fedTimer -= deltaTime;

            if(this.fedTimer <= 0)
            {
                this.fedTimer = 0;
                if(this.HasBehaviour("FOLLOW"))
                {
                    this.DefaultBehaviour();
                }
            }
        }
    }

    DefaultBehaviour(lastBehaviour)
    {
        consoleLog("Revert to default...");

        if(lastBehaviour && lastBehaviour.behaviourType === "FEED")
        {
            this.fedTimer = this.fedTime;
        }

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
                        this.behaviours = [ new ChaseBehaviour(this, seen.obj) ];

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
            let hit = stimulus.collisionWith;

            if((hit.beastType && hit.beastType !== this.beastType) || (hit.baitType && hit.baitType === "Meat"))
            {
                this.behaviours = [ new FeedBehaviour(this, stimulus.collisionWith) ]; 
            }
        }
        else if(stimulus.stimType === "SMELL")
        {
            if(stimulus.dealtBy.baitType === "Meat")
            {
                this.behaviours = [ new ChaseBehaviour(this, stimulus.dealtBy) ];
            }
        }
        else if(stimulus.stimType === "WHISTLE")
        {
            if(!this.IsHungry())
            {
                consoleLog("Not hungry! Follow player...");
                let source = stimulus.GetSource();

                if(!source.beastType)
                {
                    consoleLog("FOLLOW PLAYER!");
                    this.behaviours = [ new FollowBehaviour(this, stimulus.GetSource()) ]; 
                }
            }
        }
        else if(stimulus.stimType === "HORN")
        {
            let source = stimulus.GetSource();
            
            if(this.IsHungry() && this.HasBehaviour("CHASE") === false)
            {
                this.behaviours = [ new FleeBehaviour(this, source)];
            }
        }
    }
}