

export function formatStorageSize(byteSize, fractionDigits) {
    if (byteSize >= 1e+9) return (byteSize / 1e+9).toFixed(fractionDigits) + "GB"
    if (byteSize >= 1e+6) return (byteSize / 1e+6).toFixed(fractionDigits) + "MB"
    if (byteSize >= 1000) return (byteSize / 1000).toFixed(fractionDigits) + "KB"
    if (byteSize === 0) return "0"
    return byteSize + "B"
}

export function formatCountSize(count, fractionDigits) {
    if (count >= 1e+9) return (count / 1e+9).toFixed(fractionDigits) + "bn"
    if (count >= 1e+6) return (count / 1e+6).toFixed(fractionDigits) + "m"
    if (count >= 1000) return (count / 1000).toFixed(fractionDigits) + "k"
    return count + ""
}

export function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', {
        month: 'short',
    });
}

const RADIAN = Math.PI / 180;

export function calcPieLabelCoordinates(data) {
    const radius = 25 + data.innerRadius + (data.outerRadius - data.innerRadius) + 15;
    const x = data.cx + radius * Math.cos(-data.midAngle * RADIAN);
    const y = data.cy + radius * Math.sin(-data.midAngle * RADIAN);
    const textAnchor = x > data.cx ? 'start' : 'end'
    return [x, y, textAnchor]
}

/**
 * Returns time windowed set of rows from the passed in rows
 * Also adds tick property to object to show which ticks should be shown
 * @param rows the full data set as retrieved from server
 * @param from date from which to show data
 * @param to date to which to show data
 */
export function getGrowthDataWindow(rows, from, to) {
    const all = getGrowthData(rows)
    const filtered = all.data.filter(d => {
        return d.year >= from.getFullYear() &&
            d.year <= to.getFullYear() &&
            (d.year > from.getFullYear() || d.month >= from.getMonth()) &&
            (d.year < to.getFullYear() || d.month <= to.getMonth())
    })

    const yearCount = filtered[filtered.length - 1].year - filtered[0].year
    const interval = Math.ceil(yearCount / 8)
    const countYearTicks = yearCount / interval
    const ticked = filtered.map((gd) => {
        const yearTick = gd.month === 1 && (gd.year % interval) === 0
        if (yearTick) {
            gd.tick = gd.year;
        }
        if (!yearTick) {
            if (countYearTicks < 2) {
                gd.tick = gd.year + ":" + gd.month;
            } else if (countYearTicks < 3 && (gd.month - 1) % 2 === 0) {
                gd.tick = gd.year + ":" + gd.month;
            }
        }

        return gd
    })

    return {sources: all.sources, data: ticked, stats: all.stats}
}



export function getGrowthData(rows) {
    // collect all sources
    const sources = []
    if (rows.length === 0) {
        return {
            sources: [],
            data: []
        }
    }
    rows.forEach(row => {
        if (sources.indexOf(row.source) < 0) {
            sources.push(row.source)
        }
    })

    // set up total counters
    let totalSizes = {}
    let totalCounts = {}
    sources.forEach(s => {
        totalSizes[s] = 0
        totalCounts[s] = 0
    })

    // set up loop variables
    let analysing = true;
    // set up time range - note the rows have been sorted server side by date but may contain empty months
    let curYear = rows[0].year
    let maxYear = rows[rows.length - 1].year
    let curMonth = rows[0].month
    let maxMonth = rows[rows.length - 1].month
    let rowCounter = 0
    let result = []

    const growthDataStats = {count: 0, size: 0, countSource: "", sizeSource: "", secondary_growth:"", secondary_count:""}

    // now loop through all years and months
    while (analysing) {
        const curRecord = {
            year: curYear,
            month: curMonth,
        }


        // assure we have a size even if no record for month found
        sources.forEach(s => {
            curRecord[s + "_size"] = 0
            curRecord[s + "_count"] = 0
        })
        // amend curRecord with any rows for the current year and month
        while (rows[rowCounter] && rows[rowCounter].year === curYear && rows[rowCounter].month === curMonth) {
            let curRow = rows[rowCounter]
            curRecord[curRow.source + "_size"] = curRow.size
            totalSizes[curRow.source] = totalSizes[curRow.source] + curRow.size
            curRecord[curRow.source + "_count"] = curRow.count
            curRecord["startYear"] = curRecord.month === 1 ? curRecord.year : ""
            totalCounts[curRow.source] = totalCounts[curRow.source] + curRow.count

            if (curRow.size > growthDataStats.size) {
                growthDataStats.sizeSource = curRow.source
                growthDataStats.size = curRow.size
                growthDataStats.secondary_growth = "(" + toMonthName(curRow.month) + " " + curRow.year + ")"
            }

            if (curRow.count > growthDataStats.count) {
                growthDataStats.countSource = curRow.source
                growthDataStats.count = curRow.count
                growthDataStats.secondary_count = toMonthName(curRow.month) + " " + curRow.year
            }
            rowCounter++
        }
        // set totals
        sources.forEach(s => {

            curRecord[s + "_total_size"] = totalSizes[s]
            curRecord[s + "_total_count"] = totalCounts[s]
        })

        // add the current record
        result.push(curRecord)

        // check we are still in range
        if (curYear === maxYear && curMonth === maxMonth) {
            analysing = false
        } else {
            // now set up next Year && month
            if (curMonth === 12) {
                curMonth = 1;
                curYear++
            } else {
                curMonth++
            }
        }
    }
    return {
        sources: sources.sort((a, b) => totalSizes[a] > totalSizes[b] ? -1 : totalSizes[a] < totalSizes[b] ? 1 : 0),
        stats: growthDataStats,
        data: result
    };
}
