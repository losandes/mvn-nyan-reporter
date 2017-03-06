module.exports = Stats;

function Stats () {
    'use strict';

    var self = {
            total: 0,
            success: 0,
            failed: 0,
            skipped: 0,
            incrementStats: incrementStats,
            finalizeStats: finalizeStats
        },
        memory = [];

    function incrementStats (incrementalStats) {
        self.total = isNaN(incrementalStats.total) ? self.total : (self.total + incrementalStats.total);
        self.success = isNaN(incrementalStats.success) ? self.success : (self.success + incrementalStats.success);
        self.failed = isNaN(incrementalStats.failed) ? self.failed : (self.failed + incrementalStats.failed);
        self.skipped = isNaN(incrementalStats.skipped) ? self.skipped : (self.skipped + incrementalStats.skipped);
    }

    function finalizeStats (finalStats) {
        var stats = {
            total: 0,
            success: 0,
            failed: 0,
            skipped: 0
        };

        memory.push(finalStatsToNumbers(finalStats));

        memory.forEach(function (item) {
            stats.total = stats.total + item.total;
            stats.success = stats.success + item.success;
            stats.failed = stats.failed + item.failed;
            stats.skipped = stats.skipped + item.skipped;
        });

        self.total = stats.total;
        self.success = stats.success;
        self.failed = stats.failed;
        self.skipped = stats.skipped;
    }

    function finalStatsToNumbers (finalStats) {
        return {
            total: isNaN(finalStats.total) ? self.total : finalStats.total,
            success: isNaN(finalStats.success) ? self.success : finalStats.success,
            failed: isNaN(finalStats.failed) ? self.failed : finalStats.failed,
            skipped: isNaN(finalStats.skipped) ? self.skipped : finalStats.skipped
        };
    }

    return self;
}
