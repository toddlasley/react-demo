import React from 'react';
import { Chart } from 'chart.js';
import './PolarAreaChart.scss';

export class PolarAreaChart extends React.Component {
    private chart: Chart | undefined;
    private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    private data = [7, 9, 3, 5, 2, 3];

    constructor(props: any) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <canvas id="chart" width="500" height="500"></canvas>
        );
    }

    componentDidMount() {
        const chartElement = document.getElementById('chart') as HTMLCanvasElement;
        if ( chartElement && this.labels && this.data ) {
            this.chart = new Chart(chartElement.getContext('2d') as any, {
                type: 'polarArea',
                data: this.getChartData(),
                options: {
                    responsive: true
                }
            });
        }
    }

    private getChartData() {
        return {
            labels: this.labels,
            datasets: [{
                label: '# of Votes',
                data: this.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    }
}