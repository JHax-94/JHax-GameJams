import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class PlayerEvents extends PhysEventRegistry
{
    constructor()
    {
        super();
    }

    Begin_PlayerStructure_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_SWARM", "HIVE"); }
    Begin_PlayerStructure_Resolve(container, manager, evt)
    {
        consoleLog("PLAYER HIVE COLLISION!");
        let player = container.BodyWithTag(evt, "PLAYER_SWARM");
        let hive = container.BodyWithTag(evt, "HIVE");

        let sourceStruct = player.obj.GetSourceStructure();

        if(!hive.obj.isConnected)
        {
            sourceStruct.AddTargetStructure(hive.obj);
        }

        if(hive.obj.isConnected)
        {
            player.obj.TouchedStructure(hive.obj);
        }
    }

    Begin_BugStructure_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_BUG", "HIVE"); }
    Begin_BugStructure_Resolve(container, manager, evt)
    {
        let bug = container.BodyWithTag(evt, "PLAYER_BUG");
        let hive = container.BodyWithTag(evt, "HIVE");

        bug.obj.StructureTouched(hive.obj);
    }

    Begin_BugPerception_Check(container, manager, evt) 
    { 
        return manager.CompareTags(evt, "PLAYER_PERCEPTION", "ENEMY_BUG") || manager.CompareTags(evt, "ENEMY_PERCEPTION", "PLAYER_BUG");
    }
    Begin_BugPerception_Resolve(container, manager, evt)
    {
        let perceiver = manager.GetPerceivingBug(container, evt);
        let perceived = manager.GetPerceivedBug(container, evt);

        if(perceiver && perceived)
        {
            perceiver.obj.scout.PerceiveBug(perceived.obj);
        }
        else
        {
            consoleLog("Not like for like perception");
            consoleLog(evt);
        }
    }

    End_BugPerception_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_PERCEPTION", "ENEMY_BUG") || manager.CompareTags(evt, "ENEMY_PERCEPTION", "PLAYER_BUG"); }
    End_BugPerception_Resolve(container, manager, evt)
    {
        let perceiver = manager.GetPerceivingBug(container, evt);
        let perceived = manager.GetPerceivedBug(container, evt);

        if(perceived && perceiver)
        {
            perceiver.obj.scout.RemovePerceivedBug(perceived.obj);
        }
    }


    Begin_BugPerceptionPlayer_Check(container, manager, evt) { return manager.CompareTags(evt, "ENEMY_PERCEPTION", "PLAYER_SWARM"); }
    Begin_BugPerceptionPlayer_Resolve(container, manager, evt)
    {
        let enemyPerception = container.BodyWithTag(evt, "ENEMY_PERCEPTION");
        let playerSwarm = container.BodyWithTag(evt, "PLAYER_SWARM");

        enemyPerception.obj.scout.PerceiveBug(playerSwarm.obj);
    }

    Begin_BugOnPlayer_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_SWARM", "ENEMY_BUG"); }
    Begin_BugOnPlayer_Resolve(container, manager, evt)
    {
        let player = container.BodyWithTag(evt, "PLAYER_SWARM");
        let enemyBug = container.BodyWithTag(evt, "ENEMY_BUG");

        enemyBug.obj.ProcessHitWith(player.obj);
    }

    Begin_BugOnBug_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_BUG", "ENEMY_BUG"); }
    Begin_BugOnBug_Resolve(container, manager, evt)
    {
        let playerBug = container.BodyWithTag(evt, "PLAYER_BUG");
        let enemyBug = container.BodyWithTag(evt, "ENEMY_BUG");

        playerBug.obj.ProcessHitWith(enemyBug.obj);
    }

    Begin_EnemyBugHive_Check(container, manager, evt) { return manager.CompareTags(evt, "ENEMY_BUG", "HIVE"); }
    Begin_EnemyBugHive_Resolve(container, manager, evt)
    {
        consoleLog("ENEMY BUG / HIVE COLLISION!");

        let hive = container.BodyWithTag(evt, "HIVE");
        let enemyBug = container.BodyWithTag(evt, "ENEMY_BUG");

        if(hive.obj.IsActive())
        {
            enemyBug.obj.AttackHive(hive.obj);
        }
    }

    PreSolve_BugHivePassthrough_Check(container, manager, evt) { return true; }
    PreSolve_BugHivePassthrough_Check(container, manage, evt)
    {
        let passthroughPairs = [
            { a: "PLAYER_BUG", b: "HIVE" },
            { a: "ENEMY_BUG", b: "HIVE" }
        ];

        for(let i = 0; i < evt.contactEquations.length; i ++)
        {
            let eq = evt.contactEquations[i];

            for(let j = 0; j < passthroughPairs.length; j ++)
            {
                let pair = passthroughPairs[j];

                if(eq.bodyA.tag === pair.a  && eq.bodyB.tag === pair.b || eq.bodyA.tag === pair.b && eq.bodyB.tag === pair.a)
                {
                    eq.enabled = false;
                    break;
                }
            }
        }

        for(let i = 0; i < evt.frictionEquations.length; i ++)
        {
            let eq = evt.frictionEquations[i];
            for(let j = 0; j < passthroughPairs.length; j ++)
            {
                let pair = passthroughPairs[j];

                if(eq.bodyA.tag === pair.a && eq.bodyB.tag === pair.b || eq.bodyA.tag === pair.b && eq.bodyB.tag === pair.a)
                {
                    eq.enabled = false;
                    break;
                }
            }
        }
    }

}