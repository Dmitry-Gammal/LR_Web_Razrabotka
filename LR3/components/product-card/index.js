export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const number = String(data.id).padStart(2, "0");
        return `
            <article class="news-card h-100">
                <div class="news-num">${number}</div>
                <p class="news-text" id="open-card-${data.id}" data-id="${data.id}" tabindex="0" role="button">
                    ${data.title}: ${data.text}
                </p>
                <div class="news-card__actions">
                    <button id="detail-card-${data.id}" data-id="${data.id}" type="button">Подробнее</button>
                    <button id="delete-card-${data.id}" data-id="${data.id}" type="button">Удалить</button>
                </div>
                <div class="stripes"></div>
            </article>
        `;
    }

    addListeners(data, detailListener, deleteListener) {
        const openDetail = (event) => {
            event.currentTarget.dataset.id = data.id;
            detailListener(event);
        };
        document.getElementById(`open-card-${data.id}`)
            .addEventListener("click", openDetail);
        document.getElementById(`open-card-${data.id}`)
            .addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDetail(event);
                }
            });
        document.getElementById(`detail-card-${data.id}`)
            .addEventListener("click", detailListener);
        document.getElementById(`delete-card-${data.id}`)
            .addEventListener("click", deleteListener);
    }

    render(data, detailListener, deleteListener) {
        this.parent.insertAdjacentHTML("beforeend", this.getHTML(data));
        this.addListeners(data, detailListener, deleteListener);
    }
}
