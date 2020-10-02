class SysAuth extends Program
{
    generateSecuritySquare()
    {
        var list = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        
        var sqr = [];

        for(var i = 0; i < list.length; i ++)
        {
            sqr[i] = ''
            
            var step = i+1;

            var workingList = list.slice();

            var resultList = [];

            var loopCount = 0;

            console.log("====== SPACING " + step + " ========");

            while(workingList.length > 0 && loopCount < 1000000)
            {
                var deleteList = [];

                for(var j = 0; (j*step) < workingList.length; j ++)
                {
                    deleteList.push(j*step);
                    resultList.push(workingList[j*step]);
                }

                console.log("--- Deletes");
                console.log(deleteList);
                

                for(var k = (deleteList.length-1); k >= 0; k --)
                {
                    console.log(k + "/" + deleteList.length);
                    var deleteIndex = deleteList[k];

                    console.log(deleteIndex);

                    console.log("Deleting " + deleteIndex + "...");
                    workingList.splice(deleteIndex, 1);
                    console.log(workingList);
                }

                console.log('---- LOOP FINISHED ----');
                console.log(workingList);
                console.log(resultList);
            }

            /*
            var step = i+1;

            var offset = 0;
            
            var offsetBound = 0;
            
            if(step % 2 == 0)
            {
                offsetBound = Math.ceil(list.length / step);
            }

            for(var j = 0; j < list.length; j ++)
            {
                var base = (j*step);

                if(step % 2 == 0)
                {
                    var multiplier = j % offsetBound;

                    base = multiplier * step;

                    if(j > 0 && multiplier == 0)
                    {
                        offset ++;
                    }
                }
                var index = (base+offset)%list.length;

                sqr[i] += list[index] + ' ';
            }
            


            /*
            cube[i] += list[list.length - 1 - i];
            cube[i] += list[list.length - 1 - ((i*2)%list.length + ((i >= list.length / 2) ? 0 : 1))];
            */
        }

        console.log(sqr);
    }

    constructor(cmd)
    {
        super(cmd);
        this.generateSecuritySquare();
        
    }

    main(args)
    {
        
    }
}