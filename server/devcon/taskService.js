

module.exports.getTasks = function(){

    var tasks = [
        { name : "Add actions", progress: 95 },
        { name : "Add links",   progress: 100 },
        { name : "Add hosts monitoring",  progress:  15 },
        { name : "Add system monitoring", progress:   0 },
        { name : "Add proc monitoring",   progress:   1 },
        { name : "Add files monitoring",  progress:   0 },
        { name : "Edit configurations",  progress:   0 }
    ];
    
    return tasks;
};
