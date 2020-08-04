import React from 'react';
import { Chart } from 'chart.js';
import './PolarAreaChart.scss';

export class PolarAreaChart extends React.Component {
    private chart: Chart | undefined;
    private labels: string[] | undefined;
    private data: number[] | undefined;
    private formInvalid = false;

    constructor(props: any) {
        super(props);
        this.updateProps(props);
    }


    render() {
        this.updateProps(this.props);
        this.createChartObject();

        return (
            <div id="chart-container">
                {this.formInvalid
                    ? <h3>Please provide the necessary values to complete your Wheel of Life.</h3>
                    : <canvas id="chart" width="500" height="500"></canvas>}
            </div>
        );
    }

    componentDidMount() {
        this.createChartObject();
    }

    componentDidUpdate() {
        if ( !this.chart ) {
            this.createChartObject();
        } else {
            this.chart.data = this.getChartData();
            this.chart.update();
        }
    }

    private updateProps(props: any) {
        this.labels = props.labels;
        this.data = props.data;
        this.formInvalid = !!props.formInvalid;
    }

    private createChartObject() {
        const chartElement = document.getElementById('chart') as HTMLCanvasElement;
        if ( chartElement && this.labels && this.data ) {
            this.chart = new Chart(chartElement.getContext('2d') as any, {
                type: 'polarArea',
                data: this.getChartData(),
                options: {
                    responsive: true
                }
            });
        } else if ( this.chart ) {
            this.chart = undefined;
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