import ButtonList from "./ButtonList";

export default class Menu
{
    constructor(menuConfig)
    {
        this.components = [];
        this.BuildComponents(menuConfig.components);
    }

    BuildComponents(components)
    {
        for(let i = 0; i < components.length; i ++)
        {
            if(components[i].type === "ButtonList")
            {
                this.components.push(new ButtonList(components[i]));
            }
        }
    }
}