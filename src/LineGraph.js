import React, {useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

import "./LineGraph.css";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YYYY",
                    tooltipFormate: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callbacks: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};






    const buildChartData = (data, casesType = "cases") => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    function LineGraph({casesType='cases', ...props}) {
        const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => {
               return response.json();
            })
            .then(data => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            });
        };

        fetchData();
    }, [casesType]);

    return ( 
    	<div className="lineGraph">
            <h3 style={{marginBottom:5}}><u>Graphical Record</u></h3>
            {data?.length > 0 && (
                    <Line style={{height:300, width:900}}
                        options={options}
                        data={{
                            datasets: [
                                {
                                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                                    borderColor: "#CC1034",
                                    data: data
                                }
                            ]
                        }}
                    />
                )}
            
        </div>
    );
} 

export default LineGraph;
