import Menu from "./Menu";
import { consoleLog, EM, PIXEL_SCALE} from "../main";

export default class PauseMenu extends Menu
{
    constructor(menuConf)
    {
        super(menuConf, { title: "Pause" });
        this.flowManager = null;
        this.hintText = null;

        this.HintText()?.SetVisibility(true, { rect: this.GetHintRect(), parent: this });
    }

    GetHintRect()
    {
        let marginX = 0.25

        let pauseMenuHintRect = {
            x: marginX,
            y: this.baseDims.h - 3,
            w: this.baseDims.w - 2 * marginX,
            h: 2.75
        };

        return pauseMenuHintRect;
    }

    HintText()
    {
        if(!this.hintText)
        {
            this.hintText = EM.GetEntity("Hint");
        }

        return this.hintText;
    }

    FlowManager()
    {
        if(!this.flowManager)
        {
            this.flowManager = EM.GetEntity("FlowManager");
        }

        return this.flowManager;
    }

    Update(deltaTime)
    {
        super.Update(deltaTime);

        let flowManager = this.FlowManager();

        if(flowManager)
        {
            flowManager.Update(deltaTime);
        }

        let hintText = this.HintText();

        if(hintText)
        {
            hintText.Update(deltaTime);
        }
    }

    Resume()
    {
        EM.Pause();
    }

    ButtonStartClick()
    {
        this.Resume();
    }

    Close()
    {
        super.ClearComponents();
        EM.RemoveEntity(this);
        this.HintText()?.SetVisibility(false);
    }
}