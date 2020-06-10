import * as d3 from 'd3';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { CarData, categoryUnitMap, ChartData, GroupedDataEntry } from '../../data';

@customElement('chart-view')
class ChartView extends LitElement {
    @property({ attribute: false })
    carData: CarData[];

    @property({ attribute: false })
    chartData: ChartData[];

    @property({ attribute: false })
    groupedData: GroupedDataEntry[];

    @property({ attribute: false })
    color: (id: string) => string;

    static get styles() {
        return css`
            /* axis */
            path.domain {
                stroke: rgb(216, 216, 216);
                stroke: white;
            }

            .tick line {
                color: rgb(216, 216, 216);
            }

            .svg-container {
                display: inline-block;
                position: relative;
                width: 40rem;
                height: 30rem;
                overflow: hidden;
            }

            .svg-container text {
                font-size: 0.9rem;
                color: rgb(149, 149, 149);
            }

            .svg-content-responsive {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 0;
                padding: 1.5rem;
            }

            .overlay {
                fill: none;
                pointer-events: all;
            }

            .focus circle {
                fill: white;
                stroke-width: 0.1rem;
            }

            .focus text {
                font-size: 14px;
            }

            .tooltip {
                fill: rgb(112, 112, 112);
            }
        `;
    }

    constructor() {
        super();
    }

    updated() {
        this.cleanChart();
        this.renderChart();
    }

    cleanChart() {
        d3.select(this.shadowRoot.children[0]).selectAll('*').remove();
    }

    renderChart() {
        const chartData = this.chartData;
        const carData = this.carData;
        const groupedData = this.groupedData;
        const color = this.color;

        const xOffset = 60;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 10, left: 30 },
            width = 700 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3
            .select(this.shadowRoot.children[0])
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 700 600')
            .classed('svg-content-responsive', true)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

        // set axis
        const x = d3.scaleBand();

        const xAxis = x
            .domain(chartData.map((d) => d.category))
            .range([0, width]);
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(xAxis));

        const y = d3.scaleLinear();
        const yAxis = y
            .domain([
                0,
                d3.max(chartData, (d: ChartData) => {
                    return +d.value;
                }),
            ])
            .range([height, 0]);
        svg.append('g').call(d3.axisLeft(yAxis));

        svg.selectAll('.line')
            .data(groupedData)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', (d) => <string>color(d.key))
            .attr('stroke-width', 1.5)
            .attr('d', (d) =>
                d3
                    .line<ChartData>()
                    .x((d) => xAxis(d.category) + xOffset)
                    .y((d) => yAxis(d.value ? d.value : 0))(d.values)
            );

        // add hover tool tips

        var focus = svg
            .selectAll()
            .data(carData)
            .enter()
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');

        focus.append('circle').attr('r', 5).attr('class', 'circle');

        focus
            .append('text')
            .attr('class', 'tooltip')
            .attr('x', -10)
            .attr('y', 20);

        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', function () {
                focus.style('display', null);
            })
            .on('mouseout', function () {
                focus.style('display', 'none');
            })
            .on('mousemove', function () {
                const x0 = d3.mouse(this)[0] - xOffset;
                const xStepSize = xAxis.step();
                const i = Math.round(x0 / xStepSize);
                focus.attr('transform', (d, carIndex) => {
                    const chartDataEntry = chartData[i + 6 * carIndex];
                    return `translate(${
                        x(chartDataEntry.category) + xOffset
                    }, ${y(chartDataEntry.value)})`;
                });
                focus.select('.tooltip').text((d, carIndex) => {
                    const chartDataEntry = chartData[i + 6 * carIndex];
                    const value = carData.find(
                        (car) => car.id === chartDataEntry.id
                    );
                    const category = <'consumption'>(
                        chartDataEntry.category.toLowerCase()
                    );
                    return value[category]
                        ? `${value[category]}${categoryUnitMap[category]}`
                        : '';
                });
                focus.select('.circle').attr('stroke', (d, carIndex) => {
                    const chartDataEntry = chartData[i + 6 * carIndex];
                    return color(chartDataEntry.id);
                });
            });
    }

    render() {
        return html`<div id="dataviz"></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'chart-view': ChartView;
    }
}
