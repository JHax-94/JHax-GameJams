import { consoleLog, EM } from "../main";
import PhysEvent from "./PhysEvent";

let REGEX_GROUPS = {
    EVENT_TYPE: 1,
    METHOD_NAME: 2,
    METHOD_TYPE: 3
}

export default class PhysEventRegistry
{
    constructor()
    {

    }

    GetMethodsList(obj)
    {
        let methods = [];

        //methods.push(...Object.getOwnPropertyNames(obj));

        let layerProps = Object.getOwnPropertyNames(obj);

        for(let i = 0 ; i < layerProps.length; i ++)
        {
            let prop = layerProps[i];
            if(typeof obj[prop] === 'function' && obj instanceof PhysEventRegistry && prop !== "constructor")
            {
                methods.push({
                    name: prop,
                    method: obj[prop]
                });
            }
        }

        let nextLayer = Object.getPrototypeOf(obj);

        if(nextLayer) 
        {
            methods.push(...this.GetMethodsList(nextLayer));
        }

        return methods;
    }

    AddEventMethod(eventList, eventInfo)
    {
        let evt = eventList.find(el => el.eventType === eventInfo.eventType && el.methodName === eventInfo.methodName);

        if(!evt)
        {
            evt = {
                eventType: eventInfo.eventType,
                methodName: eventInfo.methodName
            };

            eventList.push(evt);
        }

        if(eventInfo.methodType === "Check")
        {
            evt.CheckMethod = eventInfo.method;
        }
        else if(eventInfo.methodType === "Resolve")
        {
            evt.ResolveMethod = eventInfo.method;
        }
    }

    RegisterEvents()
    {
        /*consoleLog(" --- Register phys events ---");
        consoleLog(this);*/
        let functionList = this.GetMethodsList(this);
        
        let regex = /([A-z]*)_([A-z]*)_([A-z]*)/;

        let events = [];

        for(let i = 0; i < functionList.length; i ++)
        {
            let f = functionList[i];
            let matches = f.name.match(regex);

            /*consoleLog(`Function ${f.name} matches:`);
            consoleLog(matches);*/

            this.AddEventMethod(events, {
                eventType: matches[REGEX_GROUPS.EVENT_TYPE],
                methodName: matches[REGEX_GROUPS.METHOD_NAME],
                methodType: matches[REGEX_GROUPS.METHOD_TYPE],
                method: f.method
            });
        }

        /*consoleLog("Events:");
        consoleLog(events);*/
        
        for(let i = 0; i < events.length; i ++)
        {
            let evt = events[i];
            
            if(evt.eventType === "Begin")
            {
                EM.physContainer.AddBeginContactEvent(new PhysEvent(evt.CheckMethod, evt.ResolveMethod));
            }
            else if(evt.eventType === "PreSolve")
            {
                EM.physContainer.AddPreSolveEvent(new PhysEvent(evt.CheckMethod, evt.ResolveMethod));
            }
            else if(evt.eventType === "PreSolveFriction")
            {
                EM.physContainer.AddPreSolveFrictionEvent(new PhysEvent(evt. CheckMethod, evt.ResolveMethod));
            }
            else if(evt.eventType === "End")
            {
                EM.physContainer.AddEndContactEvent(new PhysEvent(evt.CheckMethod, evt.ResolveMethod));
            }
        }
    }
}