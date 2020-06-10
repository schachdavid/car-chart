import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('selected-car')
class SelectedCar extends LitElement {
    @property()
    name = '';

    @property()
    color = '';

    @property()
    carInfo = '';

    @property()
    onButtonClick: () => void;



    static get styles() {
        return css`
            .container {
                padding: 0.5rem;
                border-top: 0.05rem solid rgb(220, 220, 220);
                display: flex;
                justify-content: space-between;
            }

            .container:hover {
                cursor: pointer;
            }

            .car-info {
                font-size: 0.9em;
                color: #949494;
            }

            .icon {
                margin-left: 0.5rem;
                color: #a1a1a1;
                align-self: center;
                visibility: hidden;
            }

            .icon:hover {
                color: #808080;
            }

            .container:hover .icon {
                visibility: visible;
            }

            button {
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                font: inherit;
                cursor: pointer;
                outline: inherit;
            }
        `;
    }

    constructor() {
        super();
    }

    render() {
        return html`<div
            class="container"
            style="border-left: 0.2rem solid ${this.color}"
        >
            <div>
                ${this.name}
                <div class="car-info">
                    ${this.carInfo}
                </div>
            </div>
            <button>
                <feather-icon
                    class="icon"
                    name="trash"
                    strokeWidth="1.2"
                    size="16"
                ></feather-icon>
            </button>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'selected-car': SelectedCar;
    }
}
