import { consoleLog, EM } from  "./main"

export default class RenderLayer
{
    constructor(name, order, ySort)
    {
        this.name = name;
        this.order = order;
        this.ySort = ySort ? true : false;
        this.renders = [];
        
    }

    AddRender(render)
    {
        this.renders.push(render);

        consoleLog("Render added to layer");
        consoleLog(this);
    }

    RemoveRender(renderer, log)
    {
        for(let i = 0; i < this.renders.length; i ++)
        {
            if(this.renders[i] === renderer)
            {
                this.renders.splice(i, 1);
                if(log) 
                {
                    consoleLog("Renderer removed!");
                    consoleLog(renderer);
                }
                break;            
            }
        }
    }

    Render()
    {
        for(let i = 0; i < this.renders.length; i ++)
        {
            if(!this.renders[i].hide)
            {
                this.renders[i].Draw();
            }

            if(EM.drawColliders && this.renders[i].phys)
            {
                this.DrawColliders(this.renders[i].phys);
            }
        }
    }

    DrawColliders(phys)
    {
        for(var i = 0; i < phys.shapes.length; i ++)
        {
            var shape = phys.shapes[i];

            var box = { x: (phys.position[0]-(0.5*shape.width)), y: -(phys.position[1] + (0.5*shape.height)), width: shape.width, height: shape.height };
            
            pen(42);
            rect(box.x, box.y, box.width, box.height);
        }
    }
}