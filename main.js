// Global formatting configuration variables
const weatherDateParse = d3.timeParse("%Y-%m-%d");
let graphYMin = 0
let graphYMax = 10
let sliderRangeMax = 100
let readyToUpdate = 0
let sliderUIMax = 320

const noEligibleCityMessage = "No cities match the temperature range that you have entered," +
    " please adjust and submit again."

// Global variable for holding the current dataset
let allCitiesData = {
    "CLT": [], // Charlotte, North Carolina
    "CQT": [], // Los Angeles, California
    "IND": [], // Indianapolis, Indiana
    "JAX": [], // Jacksonville, Florida
    "MDW": [], // Chicago, Illinois
    "PHL": [], // Philadelphia, Pennsylvania
    "PHX": [], // Pheonix, Arizona
}

let eligibleCities = []
let eligibleCitiesStats = {
    "CLT": {
        cityMin: 999,
        cityMax: -999,
    }, // Charlotte, North Carolina
    "CQT": {
        cityMin: 999,
        cityMax: -999,
    }, // Los Angeles, California
    "IND": {
        cityMin: 999,
        cityMax: -999,
    }, // Indianapolis, Indiana
    "JAX": {
        cityMin: 999,
        cityMax: -999,
    }, // Jacksonville, Florida
    "MDW": {
        cityMin: 999,
        cityMax: -999,
    }, // Chicago, Illinois
    "PHL": {
        cityMin: 999,
        cityMax: -999,
    }, // Philadelphia, Pennsylvania
    "PHX": {
        cityMin: 999,
        cityMax: -999,
    }, // Pheonix, Arizona
}

// Needs to be updated both when city selection change AND when
// the slider is moved!!!!!
let daysOverAndUnder = [
    {
        week: "Jan\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jan\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jan\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Feb\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Feb\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Feb\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Mar\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Mar\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Mar\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Apr\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Apr\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Apr\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "May\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "May\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "May\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jun\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jun\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jun\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jul\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jul\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Jul\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Aug\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Aug\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Aug\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Sep\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Sep\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Sep\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Oct\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Oct\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Oct\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Nov\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Nov\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Nov\n3/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Dec\n1/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Dec\n2/3",
        overDays: 0,
        underDays: 0,
    },
    {
        week: "Dec\n3/3",
        overDays: 0,
        underDays: 0,
    },
]

// Map for the full names of the cities
const cityCodeToName = {
    "CLT": "Charlotte, North Carolina",
    "CQT": "Los Angeles, California",
    "IND": "Indianapolis, Indiana",
    "JAX": "Jacksonville, Florida",
    "MDW": "Chicago, Illinois",
    "PHL": "Philadelphia, Pennsylvania",
    "PHX": "Pheonix, Arizona",
}

// Layout for the Slider API
const layout = ({
    width: 400,
    height: 300,
    margin: {
        top: 130,
        bottom: 135,
        left: 40,
        right: 40
    }
})

// MARK: pre-process the data in code first:
d3.csv('./data/CLT.csv', dataPreprocessorWeather).then(function(dataset) {
    allCitiesData["CLT"] = dataset
    d3.csv('./data/CQT.csv', dataPreprocessorWeather).then(function(dataset) {
        allCitiesData["CQT"] = dataset
        d3.csv('./data/IND.csv', dataPreprocessorWeather).then(function(dataset) {
            allCitiesData["IND"] = dataset
            d3.csv('./data/JAX.csv', dataPreprocessorWeather).then(function(dataset) {
                allCitiesData["JAX"] = dataset
                d3.csv('./data/MDW.csv', dataPreprocessorWeather).then(function(dataset) {
                    allCitiesData["MDW"] = dataset
                    d3.csv('./data/PHL.csv', dataPreprocessorWeather).then(function(dataset) {
                        allCitiesData["PHL"] = dataset
                        d3.csv('./data/PHX.csv', dataPreprocessorWeather).then(function(dataset) {
                            allCitiesData["PHX"] = dataset
                            console.log("All city weather data import completed")
                            updateChart(currentCity)
                        });
                    });
                });
            });
        });
    });
});

function dataPreprocessorWeather(row) {
    return {
        date: weatherDateParse(row.date),
        actualMeanTemp: +row.actual_mean_temp,
        actualMinTemp: +row.actual_min_temp,
        actualMaxTemp: +row.actual_max_temp,
        averageMinTemp: +row.average_min_temp,
        averageMaxTemp: +row.average_max_temp,
        recordMinTemp: +row.record_min_temp,
        recordMaxTemp: +row.record_max_temp,
        recordMinTempYear: +row.record_min_temp_year,
        recordMaxTempYear: +row.record_max_temp_year,
    }
}

// MARK: start of the initial scoping text answer section
formSubmitted = function() {
    let tminScope = document.getElementById("tminScope").value;
    let tmaxScope = document.getElementById("tmaxScope").value;
    // process the min and max temperature data based on the rough preference from the user
    filterCities(tminScope, tmaxScope)
}

function filterCities(min,  max) {
    eligibleCities = []
    Object.keys(allCitiesData).forEach (cityCode => {
        let eligible = true
        allCitiesData[cityCode].forEach(row => {
            if (row.averageMinTemp < eligibleCitiesStats[cityCode].cityMin) {
                eligibleCitiesStats[cityCode].cityMin = row.averageMinTemp
            }
            if (row.averageMaxTemp > eligibleCitiesStats[cityCode].cityMax) {
                eligibleCitiesStats[cityCode].cityMax = row.averageMaxTemp
            }

            if (row.averageMinTemp < min || row.averageMaxTemp > max) {
                eligible = false
            }
        })
        if (eligible) {
            eligibleCities.push(cityCode)
        }
    })
    if (eligibleCities.length === 0) {
        eligibleCities.push(noEligibleCityMessage)
    }

    // MARK: Enter - Update - Exit sequence for city list results
    // Create the bars themselves
        let cityResultsItem = d3.select("#cityResult").selectAll("p").data(eligibleCities)

    // MARK: Enter Sequence
        cityResultsItem.enter()
            .append('p')
            .text((d) => {
                if (eligibleCities.length === 1 && eligibleCities[0] === noEligibleCityMessage) {
                    return noEligibleCityMessage
                } else {
                    return `${cityCodeToName[d]} : Min average = 
                ${eligibleCitiesStats[d].cityMin}F; Max average = ${eligibleCitiesStats[d].cityMax}F`
                }
            })

    // MARK: Update Sequence
        cityResultsItem
            .text((d) => {
                if (eligibleCities.length === 1 && eligibleCities[0] === noEligibleCityMessage) {
                    return noEligibleCityMessage
                } else {
                    return `${cityCodeToName[d]} : Min average = 
                ${eligibleCitiesStats[d].cityMin}F; Max average = ${eligibleCitiesStats[d].cityMax}F`
                }
            })

    // MARK: Exit Sequence
        cityResultsItem.exit()
            .remove()
}

// MARK: start of slider section
// Global variables for slider
let sliderMin = 0
let sliderMax = 100
let currentCity = "CLT"

// Create and place slider title and slider into the DOM
sliderVals = slider(0, 100)

// Note: this is one of the most hacky code that I have ever written, but it somehow works!
function updateMinMax(selection) {
    if (readyToUpdate < 1) {
        sliderUIMax = Number(document.getElementsByClassName("selection")[0].width.baseVal.valueAsString)
    }
    readyToUpdate += 1
    const startingPoint = selection[0]
    const endingPoint = selection[1]
    sliderMin = (startingPoint / sliderUIMax) * sliderRangeMax
    sliderMax = (endingPoint / sliderUIMax) * sliderRangeMax

    // To make sure that we don't prematurely call the update function by checking that all
    // graph labels do indeed exist.
    if (readyToUpdate > 1) {
        updateChart(currentCity)
    }
}

// Global function called when select element is changed
function onCityChanged() {
    let select = d3.select('#citySelect').node();
    // Get current value of select element
    let city = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    currentCity = city
    updateChart(currentCity)
}

let svg = d3.select('svg');

// Get layout parameters
let svgWidthTotal = +svg.attr('width');
let svgHeightTotal = +svg.attr('height') + 100;

let svgWidth = svgWidthTotal;
let svgHeight = svgHeightTotal / 2;

let padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
let chartWidth = svgWidth - padding.l - padding.r;
let chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
let barBand = chartWidth / 39;
let barWidth = barBand * 0.85;
let barHeight = chartHeight;

// Create a group element for appending chart elements
let chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// MARK: barUp Scale
let yDaysUp = d3.scaleLinear()
    .domain([graphYMin, graphYMax + 1])
    .range([chartHeight, 0.0])

let yAxisLeadingUp = d3.axisLeft(yDaysUp)
    .ticks(5)

chartG.append('g')
    .attr("class", "axis-lines")
    .attr("transform", `translate(0, -40)`)
    .call(yAxisLeadingUp)

// MARK: barDown Scale
let yDaysDown = d3.scaleLinear()
    .domain([graphYMin, graphYMax + 1])
    .range([0.0, chartHeight])

let yAxisLeadingDown = d3.axisLeft(yDaysDown)
    .ticks(5)

chartG.append('g')
    .attr("class", "axis-lines")
    .attr("transform", `translate(0, 195)`)
    .call(yAxisLeadingDown)

// Create and add the bottom axis
let xLine = d3.scaleLinear()
    .domain([0, 39])
    .range([0.0, chartWidth])

let xAxisBottom = d3.axisBottom(xLine)
    .tickSize([0, 0])
    .tickValues([])

chartG.append('g')
    .attr("class", "axis-lines")
    .attr("transform", `translate(0, 195)`)
    .call(xAxisBottom)

// Create and add the axis labels
chartG.append('text')
    .attr("class", "axis-label")
    .text("Time Interval")
    .attr("transform", `translate(${chartWidth / 2}, -45)`)

chartG.append('text')
    .text("Days Over Preferred Max")
    .attr("transform", `translate(-30, 150), rotate(-90)`)
    .style("font-weight", "bold")
    .style("font-size", "0.8em")

chartG.append('text')
    .text("Days Under Preferred Min")
    .attr("transform", `translate(-30, 395), rotate(-90)`)
    .style("font-weight", "bold")
    .style("font-size", "0.8em")

function updateChart(filterKey) {
    computeDaysOverAndUnder()

    // MARK: start of letter labels enter-update-exit sequence
    // Create bar labels
    let barLabels = chartG.selectAll('.letter-label').data(daysOverAndUnder)

    barLabels.enter()
        .append('text')
        .attr("class", "letter-label")
        .attr('transform', function(d, i) {
            return `translate(${i * barBand + barBand / 2}, -25)`;
        })
        .text((d) => d.week)

    barLabels.text((d) => d.week)

    barLabels.exit()
        .remove()

    // MARK: barUP Sequence
    // Create the bars themselves
    let barUps = chartG.selectAll(".barUp").data(daysOverAndUnder)

    // MARK: Enter Sequence
    barUps.enter()
        .append('rect')
        .attr("class", "barUp")
        .attr("width", `${barWidth}`)
        .attr("y", function(d, i) {
            return yDaysUp(d.overDays) - 40;
        })
        .attr("height", function(d, i) {
            return barHeight - yDaysUp(d.overDays);
        })
        .attr("x", function(d, i) {
            return i * barBand + barBand / 3;
        })

    // MARK: Update Sequence
    barUps
        .attr("height", function(d, i) {
        return barHeight - yDaysUp(d.overDays);
        })
        .attr("y", function(d, i) {
            return yDaysUp(d.overDays) - 40;
        })

    // MARK: Exit Sequence
    barUps.exit()
        .remove()

    // MARK: barDown Sequence
    // Create the bars themselves
    let barDowns = chartG.selectAll(".barDown").data(daysOverAndUnder)

    // MARK: Enter Sequence
    barDowns.enter()
        .append('rect')
        .attr("class", "barDown")
        .attr("width", `${barWidth}`)
        .attr("y", "195")
        .attr("height", function(d, i) {
            return yDaysDown(d.underDays);
        })
        .attr("x", function(d, i) {
            return i * barBand + barBand / 3;
        })

    // MARK: Update Sequence
    barDowns
        .attr("height", function(d, i) {
            return yDaysDown(d.underDays);
        })
        .attr("y", "195")

    // MARK: Exit Sequence
    barDowns.exit()
        .remove()

    // End of letter bars enter-update-exit sequence
    // ------------------------------------------------------------------------

    // MARK: start of bar labels enter-update-exit sequence
    let barUpValueLabels = chartG.selectAll('.bar-up-val-label').data(daysOverAndUnder)

    barUpValueLabels.enter()
        .append('text')
        .attr("class", "bar-up-val-label")
        .attr('transform', function(d, i) {
            return `translate(${i * barBand + barBand / 1.5}, 150)`;
        })
        .text((d) => d.overDays)
        .attr("fill", (d) => {
            return (d.overDays > 0) ? "black" : "white"
        })

    barUpValueLabels
        .text((d) => d.overDays)
        .attr("fill", (d) => {
            return (d.overDays > 0) ? "black" : "white"
        })

    barUpValueLabels.exit()
        .remove()

    let barDownValueLabels = chartG.selectAll('.bar-down-val-label').data(daysOverAndUnder)

    barDownValueLabels.enter()
        .append('text')
        .attr("class", "bar-down-val-label")
        .attr('transform', function(d, i) {
            return `translate(${i * barBand + barBand / 1.5}, 253)`;
        })
        .text((d) => d.underDays)
        .attr("fill", (d) => {
            return (d.underDays > 0) ? "black" : "white"
        })

    barDownValueLabels
        .text((d) => d.underDays)
        .attr("fill", (d) => {
            return (d.underDays > 0) ? "black" : "white"
        })

    barDownValueLabels.exit()
        .remove()
}

// Computes out the days that are over the under according to the specifications
function computeDaysOverAndUnder(minTemp, maxTemp) {
    const localSliderMin = sliderMin
    const localSliderMax = sliderMax
    const localCurrentCity = currentCity

    for (let i = 0; i < daysOverAndUnder.length; i++) {
        daysOverAndUnder[i].overDays = 0
        daysOverAndUnder[i].underDays = 0
    }

    for (let i = 0; i < allCitiesData[localCurrentCity].length; i++) {
        const indexDaysOverAndUnder = Math.floor(i / 10)
        const currRow = allCitiesData[localCurrentCity][i]

        if (daysOverAndUnder[indexDaysOverAndUnder] !== undefined) {
            if (currRow.actualMinTemp < localSliderMin) {
                daysOverAndUnder[indexDaysOverAndUnder].underDays =
                    daysOverAndUnder[indexDaysOverAndUnder].underDays + 1;
            }
            if (currRow.actualMaxTemp > localSliderMax) {
                daysOverAndUnder[indexDaysOverAndUnder].overDays =
                    daysOverAndUnder[indexDaysOverAndUnder].overDays + 1;
            }
        }
    }
}

// Remember code outside of the data callback function will run before the data loads
