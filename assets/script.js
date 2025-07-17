function showLoadingSpinner(container, addClass = '') {
    if (!container) return;

    if (!container.querySelector('.block-loader-spinner')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'block-loader-spinner';

        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        if (addClass) {
            spinner.classList.add(addClass);
        }

        wrapper.appendChild(spinner);
        container.appendChild(wrapper);
    }
}
function hideLoadingSpinner(container) {
    if (!container) return;

    const wrapper = container.querySelector('.block-loader-spinner');
    if (wrapper) {
        wrapper.remove();
    }
}



function formatCount(num) {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'М';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'К';
    } else {
        return num.toString();
    }
}
function translateBadge(badge) {
    switch (badge) {
        case 'exclusive':
            return 'Эксклюзив';
        case 'no-deposit':
            return 'Без депозита';
        case '':
        case null:
        case undefined:
            return '';
        default:
            return '';
    }
}




function prepareBookmakerCardData(item) {
    item.isHaveBonus = Boolean(item.bonus_amount || item.badge);
    return item;
}

function renderBookmakerCardLogo_v2(item) {
    const bonusIcons = item.isHaveBonus
    ? `
        <div class="check-mark big">
            <svg width="10" height="10">
                <use href="#check-mark-1" />
            </svg>
        </div>
        <div class="check-mark small">
            <svg width="8" height="8">
                <use href="#check-mark-2" />
            </svg>
        </div>
    `
    : '';

    return `
    <div class="bookmakers-rating__card-logo" style="background: url(${item.logo}) lightgray 0px -4.036px / 100% 136.054% no-repeat;">
        ${bonusIcons}
    </div>
    `;
}
function renderBookmakerCardLogo(item) {
    const logoImg = `<img src="${item.logo}" alt="Логотип букмекера">`;
    const bonusIcons = item.isHaveBonus
        ? `
            <div class="check-mark">
                <svg width="10" height="10">
                    <use href="#check-mark-1" />
                </svg>
            </div>
        `
        : '';

    return `
        <div class="bookmakers-rating__card-logo">
            ${logoImg}
            ${bonusIcons}
        </div>
    `;
}
function renderBookmakerCardStars(val, max = 5) {
    const rating = Number(val);
    const safeVal = isNaN(rating) || rating < 0 ? 0 : rating > max ? max : rating;

    const otherStar = '<svg width="16" height="16"><use href="#star-empty" /></svg>';
    const innerStar = '<svg width="16" height="16"><use href="#star-filled" /></svg>';

    const percentage = Math.round((safeVal / max) * 100 * 1000) / 1000;

    return `
        <div class="stars">
            <div class="outer">
                ${otherStar.repeat(max)}
            </div>
            <div class="inner" style="width: ${percentage}%;">
                ${innerStar.repeat(max)}
            </div>
        </div>
    ` + `<span class="value">${safeVal.toFixed(1)}</span>`;
}
function renderBookmakerCardComments(count) {
    return '<svg width="16" height="16"><use href="#comments" /></svg>' + `<span class="count">${formatCount(count)}</span>`;
}
function renderBookmakerCardBonus(item) {
    if (item.isHaveBonus) {
        const badgeHtml = item.badge ? `<span class="bookmakers-rating__card-badge bookmakers-rating__card-badge--${item.badge.toLowerCase().replace(/\s+/g, '-')}">${translateBadge(item.badge)}</span>` : '';
        const bonusHtml = item.bonus_amount ? `<span class="bookmakers-rating__card-bonus-amount"><svg width="16" height="16"><use href="#gift" /></svg><span class="value">${formatCount(item.bonus_amount)} ₽</span></span>` : '';
        return badgeHtml + bonusHtml;
    } else {
        return `<span class="bookmakers-rating__card-badge bookmakers-rating__card-badge--empty">Нет бонуса</span>`;
    }
}



let flareIntervalButtons;
let flareTimeoutButtons;

let flareIntervalStars;
let flareTimeoutStars;

function init_flare() {
    const buttons = document.querySelectorAll('.bookmakers-rating__card-block-buttons > .to_site');
    const stars = document.querySelectorAll('.bookmakers-rating__card-block-rating .stars');

    // --- Для кнопок ---
    function clearFlareButtons() {
        buttons.forEach(btn => btn.classList.remove('flare-active'));
        if (flareTimeoutButtons) {
            clearTimeout(flareTimeoutButtons);
            flareTimeoutButtons = null;
        }
    }
    function randomFlareButtons() {
        clearFlareButtons();
        if (buttons.length === 0) return;

        const randomIndex = Math.floor(Math.random() * buttons.length);
        const btn = buttons[randomIndex];

        btn.classList.add('flare-active');

        flareTimeoutButtons = setTimeout(() => {
            btn.classList.remove('flare-active');
            flareTimeoutButtons = null;
        }, 1000);
    }
    if (flareIntervalButtons) clearInterval(flareIntervalButtons);
    randomFlareButtons();
    flareIntervalButtons = setInterval(randomFlareButtons, 2000);

    // --- Для звезд ---
    function clearFlareStars() {
        stars.forEach(star => star.classList.remove('flare-active'));
        if (flareTimeoutStars) {
            clearTimeout(flareTimeoutStars);
            flareTimeoutStars = null;
        }
    }
    function randomFlareStars() {
        clearFlareStars();
        if (stars.length === 0) return;

        const randomIndex = Math.floor(Math.random() * stars.length);
        const star = stars[randomIndex];

        star.classList.add('flare-active');

        flareTimeoutStars = setTimeout(() => {
            star.classList.remove('flare-active');
            flareTimeoutStars = null;
        }, 1000);
    }
    if (flareIntervalStars) clearInterval(flareIntervalStars);
    randomFlareStars();
    flareIntervalStars = setInterval(randomFlareStars, 1500);
}



function load_bk(target) {
    const tabBtn = target.closest('[data-tabs-nav]');
    if (!tabBtn) return;

    const bookmaker = target.closest('.bookmakers-rating');
    
    showLoadingSpinner(bookmaker, 'bookmakers-rating--loading');
    const type = tabBtn.getAttribute('data-tabs-nav');
    fakeFetch(`/topbk?type=${type}`)
        .then(data => {
            console.log(`Данные для "${type}":`, data);
            const panel = bookmaker.querySelector(`.bookmakers-rating__tabs-panel[data-tabs-panel="${type}"]`);
            if (!panel) return;
            const nav = bookmaker.querySelector(`.bookmakers-rating__tabs-nav[data-tabs-nav="${type}"]`);
            if (!nav) return;

            const panels = bookmaker.querySelectorAll(`.bookmakers-rating__tabs-panel[data-tabs-panel]`);
            panels.forEach(panel => {
                panel.classList.remove('bookmakers-rating__tabs-panel--active');
            });

            const navs = bookmaker.querySelectorAll(`.bookmakers-rating__tabs-nav[data-tabs-nav]`);
            navs.forEach(nav => {
                nav.classList.remove('bookmakers-rating__tabs-nav--active');
            });

            panel.innerHTML = '';

            data.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'bookmakers-rating__card';

                item = prepareBookmakerCardData(item);

                itemEl.innerHTML = `
                    <div class="bookmakers-rating__card-block-logo">
                        ${renderBookmakerCardLogo(item)}
                    </div>
                    <div class="bookmakers-rating__card-block-rating">
                        ${renderBookmakerCardStars(item.rating)}
                    </div>
                    <div class="bookmakers-rating__card-block-reviews">
                        ${renderBookmakerCardComments(item.review_count)}
                    </div>
                    <div class="bookmakers-rating__card-block-bonus">
                        ${renderBookmakerCardBonus(item)}
                    </div>
                    <div class="bookmakers-rating__card-block-buttons">
                        <a href="${item.internal_link}" class="to_info" target="_blank">Обзор</a>
                        <a href="${item.external_link}" class="to_site" target="_blank">На сайт</a>
                    </div>
                `;

                panel.appendChild(itemEl);
            });

            panel.classList.add('bookmakers-rating__tabs-panel--active');
            nav.classList.add('bookmakers-rating__tabs-nav--active');

            init_flare();

            hideLoadingSpinner(bookmaker);
        })
        .catch(err => {
            console.error('Ошибка загрузки данных:', err);
            hideLoadingSpinner(bookmaker);
        });
}
function init_bk() {
    const bookmakers = document.querySelectorAll('.bookmakers-rating');
    bookmakers.forEach((bookmaker) => {
        const active = bookmaker.querySelector(`.bookmakers-rating__tabs-nav--active`);
        load_bk( active );
    });

    const tabsNav = document.querySelectorAll('.bookmakers-rating [data-tabs-nav]');
    tabsNav.forEach(tab => {
        tab.addEventListener('click', (event) => {
            load_bk(event.currentTarget); // лучше использовать currentTarget
        });
    });
}

window.addEventListener('load', function () {
    init_bk();
});
