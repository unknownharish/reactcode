import React, { useState, useEffect } from 'react';
import {
    PieChart,
    XYCursor,
    LineSeries,
    PieSeries,
    XYChart,
    ValueAxis,
    CategoryAxis,
    Legend,
} from '@amcharts/amcharts4/charts';
import axios from 'axios';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import Select from './Select';
import Button from '@mui/base/Button/Button.js';
import Input from '@mui/base/Input/Input.js';
import { tTestTwoSample } from 'simple-statistics';
import { coefficientOfVariation } from 'simple-statistics';
import InputWithValidation from './inputWithValidation';

import { List } from './list'

am4core.useTheme(am4themes_animated);



const App = () => {
    const [series, setSeries] = useState([]);
    const [datasets, setDatasets] = useState(['Population', 'Births']);
    const [selectedDataset, setSelectedDataset] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [series2, setSeries2] = useState([]);

    const [min, setMin] = useState(2010);
    const [max, setMax] = useState(2019);

    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [showInputFields, setShowInputFields] = useState(false);
    const [showInputFields2, setShowInputFields2] = useState(false);
    const [seriesData, setSeriesData] = useState([]);
    const [seriesData2, setSeriesData2] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [analytics2, setAnalytics2] = useState([]);
    const [twoCharts, setTwoCharts] = useState(false);


    // console.log('analytics ', analytics)
    // console.log('analytics2 ', analytics2)



    const handleOptionChange = (event) => {
        const value = event.target.value === "double";
        setTwoCharts(value);
    };

    const handleAddSeries = () => {
        setShowInputFields(true);
    };

    const handleAddSeries2 = () => {
        setShowInputFields2(true);
    };

    const handleRemoveSeries = (index) => {
        const updatedSeries = [...series];
        updatedSeries.splice(index, 1);
        setSeries(updatedSeries);

        const updatedSeriesData = [...seriesData];
        updatedSeriesData.splice(index, 1);
        setSeriesData(updatedSeriesData);
    };

    const handleDatasetChange = (event) => {
        setSelectedDataset(event.target.value);
    };

    useEffect(() => {
        switch (selectedDataset) {
            case 'Population':
                setMin(2010);
                if (startYear === 2015) {
                    handleStartYearChange(2010);
                } else if (startYear === '') {
                    handleStartYearChange(2010);
                }
                setMax(2019);
                handleEndYearChange(max);
                break;
            case 'Births':
                setMin(2015);
                if (startYear < 2015) {
                    handleStartYearChange(2015);
                }
                setMax(2019);
                handleEndYearChange(max);
                break;
            default:
                break;
        }
    }, [selectedDataset]);

    const handleStartYearChange = (newVal) => {
        setStartYear(newVal);
        console.log(startYear);
    }

    const handleEndYearChange = (newVal) => {
        setEndYear(newVal);
        console.log(endYear);
    }

    const capitalizeFirstLetter = (str) => {
        const words = str.toLowerCase().split(" ");
        const capitalizedWords = words.map((word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        );
        return capitalizedWords.join(" ");
    };

    const handleStateChange = (event) => {
        let staate = event.target.value;
        setSelectedState(capitalizeFirstLetter(staate));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const isDataExists = series.some(([dataset, state, startYr, endYr]) => dataset === selectedDataset && state === selectedState && startYr === startYear && endYr === endYear);
        if (!isDataExists) {
            setSeries([...series, [selectedDataset, selectedState, startYear, endYear]]);
        }
        setSelectedDataset('');
        setSelectedState('');
        setStartYear(min);
        setEndYear(max);
        setShowInputFields(false);
    };

    const handleFormSubmit2 = (event) => {
        event.preventDefault();
        const isDataExists = series2.some(([dataset, state, startYr, endYr]) => dataset === selectedDataset && state === selectedState && startYr === startYear && endYr === endYear);
        if (!isDataExists) {
            setSeries2([...series2, [selectedDataset, selectedState, startYear, endYear]]);
        }
        setSelectedDataset('');
        setSelectedState('');
        setStartYear(min);
        setEndYear(max);
        setShowInputFields2(false);
    };

    const handleCancel = () => {
        setSelectedDataset('');
        setSelectedState('');
        setShowInputFields(false);
    };

    const convertToIntegerArray = (arr) => {
        return arr.map((str) => parseInt(str));
    };

    const handleCheck = () => {
        if (!seriesData.some((existingData) => existingData[0] === selectedDataset && existingData[1] === selectedState && existingData[2] === startYear && existingData[3] === endYear)) {
            return false;
        } else {
            return true;
        }
    };


    const calculatePearsonCorrelation = (xArray, yArray) => {
        console.log(xArray.length);
        console.log(yArray.length);
        if (xArray.length !== yArray.length) {
            throw new Error('The input arrays must have the same length');
        }
        const n = xArray.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXSquared = 0;
        let sumYSquared = 0;
        for (let i = 0; i < n; i++) {
            sumX += xArray[i];
            sumY += yArray[i];
            sumXY += xArray[i] * yArray[i];
            sumXSquared += xArray[i] ** 2;
            sumYSquared += yArray[i] ** 2;
        }
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXSquared - sumX ** 2) * (n * sumYSquared - sumY ** 2));
        const correlation = numerator / denominator;
        return correlation;
    };


    const getStateID = (stateName) => {
        const stateData = {
            Alabama: "01",
            Alaska: "02",
            Arizona: "04",
            Arkansas: "05",
            California: "06",
            Colorado: "08",
            Connecticut: "09",
            Delaware: "10",
            Florida: "12",
            Georgia: "13",
            Hawaii: "15",
            Idaho: "16",
            Illinois: "17",
            Indiana: "18",
            Iowa: "19",
            Kansas: "20",
            Kentucky: "21",
            Louisiana: "22",
            Maine: "23",
            Maryland: "24",
            Massachusetts: "25",
            Michigan: "26",
            Minnesota: "27",
            Mississippi: "28",
            Missouri: "29",
            Montana: "30",
            Nebraska: "31",
            Nevada: "32",
            "New Hampshire": "33",
            "New Jersey": "34",
            "New Mexico": "35",
            "New York": "36",
            "North Carolina": "37",
            "North Dakota": "38",
            Ohio: "39",
            Oklahoma: "40",
            Oregon: "41",
            Pennsylvania: "42",
            "Rhode Island": "44",
            "South Carolina": "45",
            "South Dakota": "46",
            Tennessee: "47",
            Texas: "48",
            Utah: "49",
            Vermont: "50",
            Virginia: "51",
            Washington: "53",
            "West Virginia": "54",
            Wisconsin: "55",
            Wyoming: "56",
        };

        return stateData[stateName];
    };

    function removeDuplicates(arr) {
        const uniqueValues = [];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const subArray = arr[i];
            const temp = [];
            for (let j = 0; j < subArray.length; j++) {
                const value = subArray[j];
                if (!temp.includes(value) && !uniqueValues.includes(value)) {
                    temp.push(value);
                }
            }
            uniqueValues.push(...temp);
            result.push(temp);
        }
        const filteredResult = result.filter(subArray => subArray.length > 0);
        return filteredResult;
    }

    useEffect(() => {
        console.log(seriesData);
    }, [seriesData]);

    const fetchpop = async (state, chart, startYr, endYr, num) => {
        const stateID = getStateID(state);
        const apiUrl = `https://api.census.gov/data/2019/pep/population?get=DATE_DESC,DATE_CODE,POP,NAME&for=state:${stateID}`;
        const popData = [];
        console.log("Calling fetchpop for " + state);

        try {
            const response = await axios.get(apiUrl);
            const startYearCode = parseInt(startYr) - 2007;
            const endYearCode = parseInt(endYr) - 2007;
            const responseData = response.data.slice(startYearCode, endYearCode + 1);
            const chartData = responseData.map((data) => ({
                DATE: (data[0].split(' ')[0]).split('/')[2],
                POP: data[2],
            }));
            chartData.map((data) => {
                popData.push(data.POP);
            });
            console.log(popData);
            console.log(series);

            if (num === 1) {
                const intarr = convertToIntegerArray(popData);
                seriesData.push(intarr);
            } else if (num === 2) {
                const intarr = convertToIntegerArray(popData);
                seriesData2.push(intarr);
            }

            var pseries = chart.series.push(new am4charts.LineSeries());
            pseries.dataFields.valueY = "POP";
            pseries.dataFields.dateX = "DATE";
            pseries.name = state + " Population";
            pseries.data = chartData;
            pseries.strokeWidth = 2;

            let bullet = pseries.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 4;
            pseries.tooltipText = "{name} {DATE}: {valueY}";

            setSeriesData(removeDuplicates(seriesData));
            console.log(seriesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchBirths = async (state, chart, startYr, endYr, num) => {
        const stateID = getStateID(state);

        const chartData = [];
        const birthData = [];

        for (let i = startYr; i <= endYr; i++) {

            try {
                const apiUrl = `https://api.census.gov/data/${i}/pep/components?get=BIRTHS&for=state:${stateID}`;
                const response = await axios.get(apiUrl);
                const responseData = response.data.slice(1);

                chartData.push({ DATE: i.toString(), BIRTHS: responseData[0][0] });
                console.log('chartdata', chartData);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        chartData.map((data) => {
            birthData.push(data.BIRTHS);
        });
        console.log(birthData);
        var exists = handleCheck();
        console.log(exists);
        if (exists === false) {
            if (num === 1) {
                const intarr = convertToIntegerArray(birthData);
                seriesData.push(intarr);
            } else if (num === 2) {
                const intarr = convertToIntegerArray(birthData);
                seriesData2.push(intarr);
            }

        }
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "BIRTHS";
        series.dataFields.dateX = "DATE";
        series.name = state + " Births";
        series.data = chartData;
        series.strokeWidth = 2;
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 4;
        series.tooltipText = "{name} {DATE}: {valueY}";
    };

    function magHighlights(target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [
                am4core.color("#718997"),
                am4core.color("#747A72"),
                am4core.color("#8E6167"),
                am4core.color("#7D6C66"),
                am4core.color("#81737D"),
                am4core.color("#72826C"),
                am4core.color("#BA9B63"),
                am4core.color("#BCBC8B")
            ];
        }
    }

    const generateGraph = async () => {
        am4core.useTheme(magHighlights);
        const chart = am4core.create('chartdiv', am4charts.XYChart);
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dataFields.category = 'DATE';
        dateAxis.gridIntervals.setAll([
            {
                timeUnit: "year", count: 1
            }
        ]);
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        series.map((sdata) => {
            if (sdata[0] === 'Population') {
                console.log(sdata[1] + chart + sdata[2] + sdata[3])
                fetchpop(sdata[1], chart, sdata[2], sdata[3], 1);
            } else if (sdata[0] === 'Births') {
                fetchBirths(sdata[1], chart, sdata[2], sdata[3], 1);
            };
        });
        chart.cursor = new am4charts.XYCursor();
        chart.legend = new am4charts.Legend();
        chart.responsive.enabled = true;
    };

    const generateGraph2 = async () => {
        am4core.useTheme(magHighlights);
        const chart = am4core.create('chartdiv2', am4charts.XYChart);
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dataFields.category = 'DATE';
        dateAxis.gridIntervals.setAll([
            {
                timeUnit: "year", count: 1
            }
        ]);
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        series2.map((sdata) => {
            if (sdata[0] === 'Population') {
                fetchpop(sdata[1], chart, sdata[2], sdata[3], 2);
            } else if (sdata[0] === 'Births') {
                fetchBirths(sdata[1], chart, sdata[2], sdata[3], 2);
            };
        });
        chart.cursor = new am4charts.XYCursor();
        chart.legend = new am4charts.Legend();
        chart.responsive.enabled = true;
    };

    function standardDeviation(data) {
        console.log(data);
        const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
        console.log(mean);

        const differences = data.map(value => (value - mean));
        console.log(differences);
        const squaredDifferences = differences.map(difference => difference ** 2);
        console.log(squaredDifferences);

        const sum = squaredDifferences.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        console.log(sum);

        const averageSquaredDifference = sum / squaredDifferences.length;
        console.log(averageSquaredDifference);

        const standardDeviation = Math.sqrt(averageSquaredDifference);
        console.log(standardDeviation);

        return standardDeviation;
    };

    const runAnalytics = (vars) => {
        const data = [];
        for (let i = 0; i < series.length; i++) {
            var mean = 0;
            for (let j = 0; j < seriesData[i].length; j++) {
                mean += parseInt(seriesData[i][j]);
            }
            mean = mean / seriesData[i].length;
            data.push({ text: "Mean of " + series[i][0] + " in " + series[i][1] + ": " + mean.toLocaleString(), type: series[i][0], key: 'Mean', value: mean.toLocaleString() });
            var min = Math.min(...seriesData[i]);
            var max = Math.max(...seriesData[i]);
            data.push({ text: "Min of " + series[i][0] + " in " + series[i][1] + ": " + min.toLocaleString(), type: series[i][0], key: 'Min', value: min.toLocaleString() });
            data.push({ text: "Max of " + series[i][0] + " in " + series[i][1] + ": " + max.toLocaleString(), type: series[i][0], key: 'Max', value: max.toLocaleString() });
            var range = max - min;
            data.push({ text: "Range of " + series[i][0] + " in " + series[i][1] + ": " + range.toLocaleString(), type: series[i][0], key: 'Range', value: range.toLocaleString() });
            var sd = standardDeviation(seriesData[i], mean);
            data.push({ text: "Standard Deviation of " + series[i][0] + " in " + series[i][1] + ": " + sd.toLocaleString(), type: series[i][0], key: 'Standard Deviation', value: sd.toLocaleString() });
            var cv = coefficientOfVariation(seriesData[i]);
            data.push({ text: "Coefficient of Variation of " + series[i][0] + " in " + series[i][1] + ": " + cv.toLocaleString(), type: series[i][0], key: 'Coefficient of Variation', value: cv.toLocaleString() });
        };
        if (series.length === 2 && seriesData[0].length === seriesData[1].length) {
            const r = calculatePearsonCorrelation(seriesData[0], seriesData[1]);
            data.push({ text: "Pearson Correlation: " + r.toLocaleString(), type: 'Pearson Correlation', key: 'Pearson Correlation', value: r.toLocaleString() });
            const t = Math.abs(tTestTwoSample(seriesData[0], seriesData[1]));
            data.push({ text: "T-Test: " + t.toLocaleString(), type: 'T-Test', key: 'T-Test', value: t.toLocaleString() });
        };
        setAnalytics(data);
    };

    const runAnalytics2 = (vars) => {
        const data = [];
        for (let i = 0; i < series2.length; i++) {
            var mean = 0;
            for (let j = 0; j < seriesData2[i].length; j++) {
                mean += parseInt(seriesData2[i][j]);
            }
            mean = mean / seriesData2[i].length;
            data.push({ text: "Mean of " + series2[i][0] + " in " + series2[i][1] + ": " + mean.toLocaleString(), type: series2[i][0], key: 'Mean', value: mean.toLocaleString() });
            var min = Math.min(...seriesData2[i]);
            var max = Math.max(...seriesData2[i]);
            data.push({ text: "Min of " + series2[i][0] + " in " + series2[i][1] + ": " + min.toLocaleString(), type: series2[i][0], key: 'Min', value: min.toLocaleString() });
            data.push({ text: "Max of " + series2[i][0] + " in " + series2[i][1] + ": " + max.toLocaleString(), type: series2[i][0], key: 'Max', value: max.toLocaleString() });
            var range = max - min;
            data.push({ text: "Range of " + series2[i][0] + " in " + series2[i][1] + ": " + range.toLocaleString(), type: series2[i][0], key: 'Range', value: range.toLocaleString() });
            var sd = standardDeviation(seriesData2[i], mean);
            data.push({ text: "Standard Deviation of " + series2[i][0] + " in " + series2[i][1] + ": " + sd.toLocaleString(), type: series2[i][0], key: 'Standard Deviation', value: sd.toLocaleString() });
            var cv = coefficientOfVariation(seriesData2[i]);
            data.push({ text: "Coefficient of Variation of " + series2[i][0] + " in " + series2[i][1] + ": " + cv.toLocaleString(), type: series2[i][0], key: 'Coefficient of Variation', value: cv.toLocaleString() });
        };
        if (series2.length === 2 && seriesData2[0].length === seriesData2[1].length) {
            const r = calculatePearsonCorrelation(seriesData2[0], seriesData2[1]);
            data.push({ text: "Pearson Correlation: " + r.toLocaleString(), type: 'text', key: 'Pearson Correlation', value: r.toLocaleString() });
            const t = Math.abs(tTestTwoSample(seriesData2[0], seriesData2[1]));
            data.push({ text: "T-Test: " + t.toLocaleString(), type: 'text', key: 'T-Test', value: t.toLocaleString() });
        };
        setAnalytics2(data);
    };



    return (
        <div className=''>
            <div className='flex w-[80%] m-auto mt-4'   >
                <div className=' flex'>
                    <input
                        type="radio"
                        value="single"
                        className='cursor-pointer'
                        checked={twoCharts === false}
                        onChange={handleOptionChange}
                    />
                    <p className='text-lg ml-1'>  Single Chart </p>
                </div>

                <div className=' ml-9 flex'>
                    <input
                        className='cursor-pointer'
                        type="radio"
                        value="double"
                        checked={twoCharts === true}
                        onChange={handleOptionChange}
                    />
                    <p className='text-lg ml-1'> Two Charts </p>
                </div>
            </div>
            <br />

            <datalist id='state'>
                {List.map(x => (<option key={x} value={x} />))}
            </datalist>

            {twoCharts === false ? (
                <div className='flex flex-col w-[80%] m-auto'>
                    <button className='bg-blue-500 text-white p-2 rounded-md outline-none my-2 w-32' onClick={handleAddSeries}>   Add Series</button>

                    <hr className='my-3' />
                    {showInputFields && (
                        <form onSubmit={handleFormSubmit}>
                            <div className=' flex '>
                                <p className='p-2 pl-3 w-40'>Select Dataset: </p>
                                <select className='border border-black ml-9 rounded-md p-2 cursor-pointer pl-3 w-40' value={selectedDataset} onChange={handleDatasetChange}>
                                    <option value="">Select</option>
                                    {datasets.map((dataset, datasetIndex) => (
                                        <option key={datasetIndex} value={dataset} className='cursor-pointer p-1'>
                                            {dataset}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <br />
                            {/* <input type='text' className='border p-2 pl-3  border-black w-40 borderTop' placeholder="Start year:" min={min} max={max} onChange={handleStartYearChange} /> */}
                            {/* <input type='text' className='border p-2 pl-3 ml-9 border-black w-40 borderTop' placeholder="End year:" min={min} max={max} onChange={handleEndYearChange} /> */}
                            <InputWithValidation className='border p-2 pl-3  border-black w-40 borderTop rounded-md' label="Start year:" min={min} max={max} onChange={handleStartYearChange} />
                            <InputWithValidation className='border p-2 pl-3  border-black w-40 borderTop rounded-md' label="End year:" min={min} max={max} onChange={handleEndYearChange} />



                            <div className='flex mt-4'>
                                <p className='p-2 pl-3 w-40'>  Select State: </p>
                                <input list="state" className='border border-black ml-9 p-2 cursor-pointer pl-3 w-40 borderTop rounded-md' type="text" value={selectedState} onChange={handleStateChange} required placeholder='Enter State' />
                            </div>
                            <br />
                            <div className='flex '>

                                <button className='border border-red-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-red-500 hover:text-white' type="button" onClick={handleCancel}>Cancel</button>
                                <button className='border border-blue-500 ml-9 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-blue-500 hover:text-white' type="submit">Submit</button>
                            </div>
                        </form>
                    )}

                    {series.map((seriesItem, index) => (
                        <div key={index}>
                            {seriesItem[0]} - {seriesItem[1]}
                            <button onClick={() => handleRemoveSeries(index)}>X</button>
                        </div>
                    ))}
                    <div className='mt-8'>
                        <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white' onClick={generateGraph}>Generate Graph</Button>
                        <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white ml-9' onClick={runAnalytics}>Run Analytics</Button>
                        <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>

                        {analytics.length && <div id="analytics">

                            <h3 className='text-4xl text-center my-6'>Table Analysis</h3>
                            <table className='w-[60%] m-auto mb-10 border-spacing-2'>
                                <caption class="caption-top">
                                    Table 1: {analytics[0].type} Growth.
                                </caption>
                                <thead className='bg-gray-400'>

                                    <tr >
                                        {/* <th>head1</th> */}
                                        <th className='w-[25%] bg-red-200' align='center'>Type</th>
                                        <th align='center'>Key</th>
                                        <th align='center'>value</th>
                                    </tr>
                                </thead>
                                <tbody className=''>

                                    {analytics.map((data) => (
                                        <tr className='bg-gray-200 '>
                                            {/* <td>{data.text}</td> */}
                                            <td align='center' >{data.type}</td>
                                            <td align='center'>{data.key}</td>
                                            <td align='center'>{data.value}</td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>}
                    </div>
                </div>
            ) : (
                <div>
                    <div className='flex flex-col w-[80%] m-auto'>
                        <button className='bg-blue-500 text-white p-2 rounded-md outline-none my-2 w-32' onClick={handleAddSeries}>Add Series</button>

                        {showInputFields && (
                            <form onSubmit={handleFormSubmit}>
                                <div className='flex'>
                                    <p className='p-2 pl-3 w-40'>  Select Dataset:</p>
                                    <select className='border border-black ml-9 rounded-md p-2 cursor-pointer pl-3 w-40' value={selectedDataset} onChange={handleDatasetChange}>
                                        <option value="">Select</option>
                                        {datasets.map((dataset, datasetIndex) => (
                                            <option className='cursor-pointer p-1' key={datasetIndex} value={dataset}>
                                                {dataset}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <br />
                                {/* <input type='text' className='border p-2 pl-3  border-black w-40 borderTop' placeholder="Start year:" min={min} max={max} onChange={handleStartYearChange} />
                <input type='text' className='border p-2 pl-3 ml-9  border-black w-40 borderTop' placeholder="End year:" min={min} max={max} onChange={handleEndYearChange} /> */}

                                <div className='d-flex'>

                                    <InputWithValidation className='border p-2 pl-3  border-black w-40 borderTop rounded-md' label="Start year:" min={min} max={max} onChange={handleStartYearChange} />
                                    <InputWithValidation className='border p-2 pl-3 ml-9  border-black w-40 borderTop rounded-md' label="End year:" min={min} max={max} onChange={handleEndYearChange} />
                                </div>


                                <div className='flex mt-4'>
                                    <p className='p-2 pl-3 w-40'> Select State: </p>
                                    <input list='state' className='border border-black ml-9 p-2 cursor-pointer pl-3 w-40 borderTop' type="text" value={selectedState} onChange={handleStateChange} required />
                                </div>
                                <br />

                                <div className='flex'>

                                    <button className='border border-red-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-red-500 hover:text-white' type="button" onClick={handleCancel}>Cancel</button>
                                    <button className='border border-blue-500 ml-9 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-blue-500 hover:text-white' type="submit">Submit</button>
                                </div>
                            </form>
                        )}

                        {series.map((seriesItem, index) => (
                            <div key={index}>
                                {seriesItem[0]} - {seriesItem[1]}
                                <button onClick={() => handleRemoveSeries(index)}>X</button>
                            </div>
                        ))}
                        <div className='mt-4'>
                            <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white' onClick={generateGraph}>Generate Graph</Button>
                            <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white ml-9' onClick={runAnalytics}>Run Analytics</Button>

                        </div>
                    </div>

                    <hr className='my-5' />
                    <div className='flex flex-col w-[80%] m-auto' /*second charts and its options*/>
                        <button className='bg-blue-500 text-white p-2 rounded-md outline-none my-2 w-32' onClick={handleAddSeries2}>Add Series</button>

                        {showInputFields2 && (
                            <form onSubmit={handleFormSubmit2}>
                                <div className='flex mt-4'>
                                    <p className='p-2 pl-3 w-40'>  Select Dataset: </p>
                                    <select className='border border-black ml-9 rounded-md p-2 cursor-pointer pl-3 w-40' value={selectedDataset} onChange={handleDatasetChange}>
                                        <option value="">Select</option>
                                        {datasets.map((dataset, datasetIndex) => (
                                            <option key={datasetIndex} value={dataset}>
                                                {dataset}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <br />
                                {/* <input type='text' className='border p-2 pl-3  border-black w-40 borderTop' placeholder="Start year:" min={min} max={max} onChange={handleStartYearChange} />
                                <input type='text' className='border p-2 pl-3  border-black w-40 borderTop ml-9' placeholder="End year:" min={min} max={max} onChange={handleEndYearChange} /> */}

                                <InputWithValidation className='border p-2 pl-3  border-black w-40 borderTop rounded-md' label="Start year:" min={min} max={max} onChange={handleStartYearChange} />
                                <InputWithValidation className='border p-2 pl-3 ml-9  border-black w-40 borderTop rounded-md' label="End year:" min={min} max={max} onChange={handleEndYearChange} />

                                <div className='flex mt-4'>
                                    <p className='p-2 pl-3 w-40'>  Select State: </p>
                                    <input list='state' className='border border-black ml-9 p-2 cursor-pointer pl-3 w-40 borderTop' type="text" value={selectedState} onChange={handleStateChange} required />
                                </div>
                                <br />
                                <div className='flex'>

                                    <button className='border border-red-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-red-500 hover:text-white' type="button" onClick={handleCancel}>Cancel</button>
                                    <button className='border border-blue-500 ml-9 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-blue-500 hover:text-white' type="submit">Submit</button>
                                </div>
                            </form>
                        )}

                        {series2.map((seriesItem, index) => (
                            <div key={index}>
                                {seriesItem[0]} - {seriesItem[1]}
                                <button onClick={() => handleRemoveSeries(index)}>X</button>
                            </div>
                        ))}
                        <div className='mt-4'>
                            <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white' onClick={generateGraph2}>Generate Graph</Button>
                            <Button className='border border-green-500 rounded-md p-2 cursor-pointer pl-3 w-40 hover:bg-green-500 hover:text-white ml-9' onClick={runAnalytics2}>Run Analytics</Button>

                        </div>
                    </div>
                    <div className="flex-parent-element" >
                        <div className="flex-child-element" id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
                        <div id="analytics">
                            {/* {analytics?.map((data) => (
                                <p>{data.text}</p>
                            ))} */}


                            {analytics?.length &&
                                <>
                                    <h3 className='text-4xl text-center my-6'>Table Analysis</h3>

                                    <table className='w-[60%] m-auto mb-10 border-spacing-2'>
                                        <caption class="caption-top">
                                            Table 1: {analytics[0]?.type} Growth.
                                        </caption>
                                        <thead className='bg-gray-400'>

                                            <tr >
                                                {/* <th>head1</th> */}
                                                <th className='w-[25%] bg-red-200' align='center'>Type</th>
                                                <th align='center'>Key</th>
                                                <th align='center'>value</th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>

                                            {analytics?.map((data) => (
                                                <tr className='bg-gray-200 '>
                                                    {/* <td>{data.text}</td> */}
                                                    <td align='center' >{data?.type}</td>
                                                    <td align='center'>{data?.key}</td>
                                                    <td align='center'>{data?.value}</td>
                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>
                                </>}




                        </div>
                        <div className="flex-child-element" id="chartdiv2" style={{ width: '100%', height: '500px' }}></div>
                        <div id="analytics2">
                            {/* {analytics2?.map((data) => (
                                <p>{data.text}</p>
                            ))} */}

                            {analytics2?.length &&
                                <>
                                    <h3 className='text-4xl text-center my-6'>Table Analysis</h3>

                                    <table className='w-[60%] m-auto mb-10 border-spacing-2'>
                                        <caption class="caption-top">
                                            Table 1: {analytics2[0]?.type} Growth.
                                        </caption>
                                        <thead className='bg-gray-400'>

                                            <tr >
                                                {/* <th>head1</th> */}
                                                <th className='w-[25%] bg-red-200' align='center'>Type</th>
                                                <th align='center'>Key</th>
                                                <th align='center'>value</th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>

                                            {analytics2?.map((data) => (
                                                <tr className='bg-gray-200 '>
                                                    {/* <td>{data.text}</td> */}
                                                    <td align='center' >{data?.type}</td>
                                                    <td align='center'>{data?.key}</td>
                                                    <td align='center'>{data?.value}</td>
                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            }


                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default App;