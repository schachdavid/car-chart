import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('car-list-item')
class CarListItem extends LitElement {
    @property()
    name = '';

    static get styles() {
        return css`
            .container {
                padding: 0.5rem;
                display: flex;
                justify-content: space-between;
            }

            .container:hover {
                background-color: rgb(245, 245, 245);
                cursor: pointer;
            }

            .icon {
                margin-left: 0.5rem;
                color: #a1a1a1;
                align-self: center;
                visibility: hidden;
            }

            .container:hover .icon {
                visibility: visible;
            }
        `;
    }

    constructor() {
        super();
    }

    render() {
        return html`<div class="container">
            ${this.name}
            <feather-icon class="icon" name="plus-square" strokeWidth="1.2" size="16"></feather-icon>

        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'car-list-item': CarListItem;
    }
}
