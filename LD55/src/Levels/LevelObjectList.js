export default class LevelObjectList
{
    constructor(type)
    {
        this.type = type;
        this.objects = [];
    }

    AddObject(obj)
    {
        this.objects.push(obj);
    }
}