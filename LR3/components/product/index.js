export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <article class="detail-card">
                <img src="${data.src}" alt="${data.title}">
                <div class="detail-card__body">
                    <span class="detail-card__meta">${data.category} · ${data.date}</span>
                    <h1>${data.title}</h1>
                    <p>${data.text}</p>
                    <div class="detail-card__actions">
                        <button id="back-to-news" type="button">К списку новостей</button>
                        <button id="delete-detail-card" class="delete-detail" data-id="${data.id}" type="button">Удалить новость</button>
                    </div>
                </div>
            </article>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML("beforeend", this.getHTML(data));
    }
}
