import React from 'react';
import { Chart } from 'chart.js';
import './PolarAreaChart.scss';

interface PolarAraChartProps {
    labels: string[];
    data: number[];
}

export class PolarAreaChart extends React.Component<PolarAraChartProps> {
    private readonly CHART_ELEMENT_ID = 'wol-chart';
    private readonly CHART_COLORS = [
        'rgba(0, 113, 188, 1)',
        'rgba(147, 39, 143, 1)',
        'rgba(237, 30, 121, 1)',
        'rgba(237, 28, 36, 1)',
        'rgba(247, 147, 30, 1)',
        'rgba(252, 238, 33, 1)',
        'rgba(0, 146, 69, 1)',
        'rgba(41, 171, 226, 1)'
    ];

    // eslint-disable-next-line
    constructor(props: any) {
        super(props);
    }


    render() {
        const labels: JSX.Element[] = [];

        this.props.labels.forEach((label, index) => {
            const color = this.CHART_COLORS[index];
            const rating = this.props.data[index];

            labels.push(
                <div className="label-container" key={'label' + label}>
                    <span className="label-rating" style={{backgroundColor: color}}>{rating}</span>
                    <span className="label-name">{label}</span>
                </div>
            );
        });

        return (
            <div id="wol-chart-main-container">
                <div id="wol-chart-labels-container" className="chart-sub-container">
                    {labels}
                </div>
                <div id="wol-chart-container" className="chart-sub-container">
                    <canvas id={this.CHART_ELEMENT_ID} width="500" height="500"></canvas>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const chartElement = document.getElementById(this.CHART_ELEMENT_ID) as HTMLCanvasElement;
        new Chart(chartElement.getContext('2d') as any, {
            type: 'polarArea',
            data: {
                datasets: [{
                    data: this.props.data,
                    backgroundColor: this.CHART_COLORS,
                    borderColor: this.CHART_COLORS,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scale: {
                    ticks: {
                        suggestedMax: 10
                    }
                },
                tooltips: { enabled: false },
                hover: {}
            }
        });
    }
}