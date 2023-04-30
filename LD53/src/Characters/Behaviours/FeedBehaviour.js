import BeastBehaviour from "./BeastBehaviour";

export default class FeedBehaviour extends BeastBehaviour
{
    constructor(beast, feedOn)
    {
        super(beast, "FEED");

        this.feedOn = feedOn;

        this.feedOn.behaviours = [];

        this.feedOn.phys.setZeroForce();
        this.feedOn.velocity = [0, 0];
        this.feedTime = 4;
        this.feedTimer = 0;
    }

    Act(deltaTime)
    {
        if(this.feedTimer < this.feedTime)
        {
            this.feedTimer += deltaTime;

            if(this.feedTimer >= this.feedTime)
            {
                this.feedTimer = this.feedTime;
                this.feedOn.DeleteBeast();
                this.beast.DefaultBehaviour();
            }
        }
    }
}