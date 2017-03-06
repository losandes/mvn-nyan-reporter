module.exports = DebugLogs;

function DebugLogs () {
    var self = {
            getLogs: getLogs,
            addLog: addLog
        },
        logs = [];

    function getLogs () {
        return logs;
    }

    function addLog (log) {
        logs.push(log);
    }

    return self;
}
