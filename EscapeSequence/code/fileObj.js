class FileObj extends FileSystemObj
{
    constructor(dirConf)
    {
        super(dirConf);
        var nameComps = dirConf.name.split('.');
        this.fileName = nameComps[0];
        this.extension = nameComps[1];
    }
}