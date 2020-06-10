import * as d3 from 'd3';
import { css, customElement, html, LitElement, property } from 'lit-element';
import { CarData, fullData } from '../../data';
import { capitalize } from '../../util/stringUtil';


@customElement('data-selector')
class DataSelector extends LitElement {
    @property({ attribute: false })
    carData: CarData[];

    @property({ attribute: false })
    color: (id: string) => string;

    @property({ attribute: false })
    addCar: (id: string) => void;

    @property({ attribute: false })
    removeCar: (id: string) => void;

    searchValue = '';

    static get styles() {
        return css`
            .select-data-container {
                font-size: 0.8rem;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background-color: rgb(248, 248, 248);
            }

            .cars-to-select-outer-container {
                font-size: 0.9em;
                overflow-y: scroll;
                flex: 1;
                margin-right: 0.2rem;
                margin-top: 0.2rem;
            }

            .cars-to-select-outer-container::-webkit-scrollbar {
                width: 0.3rem;
            }
            .cars-to-select-outer-container::-webkit-scrollbar-track {
                border-radius: 0.5rem;
            }
            .cars-to-select-outer-container::-webkit-scrollbar-thumb {
                margin: 0 1rem;
                background-color: #e6e6e6;
                border-radius: 0.5rem;
            }

            .selected-cars-outer-container {
                max-height: 70%;
                background-color: rgb(255, 255, 255);
                box-shadow: 0px 0px 3px rgba(134, 134, 134, 0.1);
                overflow-y: scroll;
            }

            .selected-cars-outer-container::-webkit-scrollbar {
                width: 0.3rem;
            }
            .selected-cars-outer-container::-webkit-scrollbar-track {
                border-radius: 0.5rem;
            }
            .selected-cars-outer-container::-webkit-scrollbar-thumb {
                margin: 0 1rem;
                background-color: #e6e6e6;
                border-radius: 0.5rem;
            }

            .search {
                margin: 0.2rem;
                margin-top: 0.4rem;
                padding: 0.3rem;
                background-color: rgb(255, 255, 255);
                border: 0px solid;
                border-radius: 0.2rem;
            }
        `;
    }

    constructor() {
        super();
    }

    firstUpdated() {
        this.createSelectedCars();
        this.createCarsToSelect();
    }

    updated() {
        console.log('rerendering cars to select...');

        d3.select(this.shadowRoot.querySelector('.select-data-container'))
            .select('.selected-cars-container')
            .remove();

        d3.select(this.shadowRoot.querySelector('.select-data-container'))
            .select('.cars-to-select-container')
            .remove();
        this.createSelectedCars();
        this.createCarsToSelect();
    }

    createSelectedCars() {
        const carData = this.carData;
        const color = this.color;
        const selectedCarsContainer = d3
            .select(
                this.shadowRoot.querySelector('.selected-cars-outer-container')
            )
            .insert('div', ':first-child')
            .classed('selected-cars-container', true);

        selectedCarsContainer
            .selectAll()
            .data(carData)
            .enter()
            .append('selected-car')
            .attr('name', (d) => capitalize(`${d.brand} ${d.model}`))
            .attr('color', (d) => <string>color(d.id))
            .attr(
                'carInfo',
                (d: CarData) => `${capitalize(d.origin)} (19${d.year}) `
            )
            .on('click', (d) => {
                this.removeCar(d.id);
            });
    }

    createCarsToSelect() {
        const carData = this.carData;
        const carsToSelectContainer = d3
            .select(
                this.shadowRoot.querySelector('.cars-to-select-outer-container')
            )
            .append('div')
            .classed('cars-to-select-container', true);

        carsToSelectContainer
            .selectAll()
            .data(this.filterCars(fullData))
            .enter()
            .append('car-list-item')
            .attr('name', (d: CarData) => capitalize(`${d.brand} ${d.model}`))
            .on('click', (d) => {
                this.addCar(d.id);
            });
    }

    filterCars(data: CarData[]) {
        console.log(this.searchValue);

        const carData = this.carData;
        return data.filter((car) => {
            if (
                -1 ===
                carData.findIndex((selectedCar) => selectedCar.id === car.id)
            ) {
                return true;
            }
            if (
                this.searchValue !== '' &&
                `${car.brand} ${car.model}`.includes(
                    this.searchValue.toLowerCase()
                )
            ) {
                return true;
            }
            return false;
        });
    }

    updateSearchValue(event: KeyboardEvent) {
        this.searchValue = (<HTMLInputElement>event.target).value;
    }

    // @keydown=${<(ev: KeyboardEvent) => void>this.updateSearchValue}


    render() {
        return html` <div class="select-data-container">
            <div class="selected-cars-outer-container"></div>

            <input
                type="search"
                placeholder="Seach cars"
                class="search"
            />
            <div class="cars-to-select-outer-container"></div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'data-selector': DataSelector;
    }
}
