import * as d3 from 'd3';
import { css, customElement, html, LitElement } from 'lit-element';
import {
    CarData,
    ChartData,
    dataSnippet,
    fullData,
    GroupedDataEntry,
} from '../../data';
import { scalerFactory } from '../../util/d3util';

@customElement('car-chart')
class CarChart extends LitElement {
    carData: CarData[] = [];
    chartData: ChartData[] = [];
    groupedData: GroupedDataEntry[] = [];
    color: (id: string) => string;

    static get styles() {
        return css`
            .container {
                display: flex;
                flex-direction: row;
                height: 30rem;
                background-color: rgb(255, 255, 255);
                border-radius: 0.2rem;
                box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .outer-container {
                height: 100vh;
                width: 100vw;
                font-size: 100%;
                font-family: 'Open Sans', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgb(105, 105, 105);
                background-color: rgb(248, 248, 248);
            }
        `;
    }

    constructor() {
        super();
        this.carData = Object.assign(dataSnippet);
    }

    connectedCallback() {
        super.connectedCallback();
        this.buildChartData();
    }

    buildChartData() {
        //bring data into right shape
        this.chartData = [];
        this.groupedData = [];

        this.carData.forEach((car: CarData) => {
            const id = car.id;
            this.chartData.push({
                id: id,
                category: `Cylinder`,
                value: car.cylinder,
            });
            this.chartData.push({
                id: id,
                category: `Consumption`,
                value: car.consumption,
            });
            this.chartData.push({
                id: id,
                category: `Acceleration`,
                value: car.acceleration,
            });
            this.chartData.push({
                id: id,
                category: `Displacement`,
                value: car.displacement,
            });
            this.chartData.push({
                id: id,
                category: `Horsepower`,
                value: car.horsepower,
            });
            this.chartData.push({
                id: id,
                category: `Weight`,
                value: car.weight,
            });
        });

        //scale all values from 0 to 1
        const scaleCylinder = scalerFactory(this.chartData, `Cylinder`);
        const scaleConsumption = scalerFactory(this.chartData, `Consumption`);
        const scaleAcceleration = scalerFactory(this.chartData, `Acceleration`);
        const scaleDisplacement = scalerFactory(this.chartData, `Displacement`);
        const scaleHorsepower = scalerFactory(this.chartData, `Horsepower`);
        const scaleWeight = scalerFactory(this.chartData, `Weight`);

        this.chartData.forEach((d) => {
            switch (d.category) {
                case `Cylinder`:
                    d.value = scaleCylinder(d.value);
                    break;
                case `Consumption`:
                    d.value = scaleConsumption(d.value);
                    break;
                case `Acceleration`:
                    d.value = scaleAcceleration(d.value);
                    break;
                case `Displacement`:
                    d.value = scaleDisplacement(d.value);
                    break;
                case `Horsepower`:
                    d.value = scaleHorsepower(d.value);
                    break;
                case `Weight`:
                    d.value = scaleWeight(d.value);
                    break;
            }
        });

        //group by ids
        this.groupedData = d3
            .nest()
            .key((d: ChartData) => d.id)
            .entries(this.chartData);

        // color palette
        const res = this.groupedData.map((d) => d.key); // list of ids

        this.color = <(key: string) => string>(
            d3
                .scaleOrdinal()
                .domain(res)
                .range([
                    '#8884d8',
                    '#82ca9d',
                    '#e67f83',
                    '#ffdc5e',
                    '#457b9d',
                    '#f8961e',
                ])
        );
    }

    addCar = (id: string) => {
        const carToAdd = fullData.find((car) => car.id === id);
        const carDataTmp = Object.assign(this.carData);
        carDataTmp.push(carToAdd);
        this.carData = carDataTmp;
        this.buildChartData();
        this.requestUpdate();
    };

    removeCar = (id: string) => {
        const carDataTmp = this.carData.filter((car) => car.id !== id);
        this.carData = carDataTmp;
        this.buildChartData();
        this.requestUpdate();
    };

    render() {
        return html` <div class="outer-container">
            <div class="container">
                <chart-view
                    .carData=${this.carData}
                    .chartData=${this.chartData}
                    .groupedData=${this.groupedData}
                    .color=${this.color}
                >
                </chart-view>
                <data-selector
                    .selectedCars=${this.carData}
                    .carsToSelect=${fullData.filter(
                        (car) =>
                            car.acceleration &&
                            car.consumption &&
                            car.displacement &&
                            car.horsepower &&
                            car.weight
                    )}
                    .color=${this.color}
                    .addCar=${this.addCar}
                    .removeCar=${this.removeCar}
                >
                </data-selector>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'car-chart': CarChart;
    }
}
