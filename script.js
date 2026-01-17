const API_BASE = 'https://edu.std-900.ist.mospolytech.ru';
const API_KEY = 'f0c10d54-535c-4d87-99a2-d1e99269fa13';

let currentPage = 'catalog';
let allProducts = [];
let originalProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allOrders = [];
let currentOrderId = null;
let currentPage_pagination = 1;
let sortOrder = 'rating_desc';
let filters = {
    categories: [],
    priceMin: null,
    priceMax: null,
    onlyDiscount: false
};

// Тестовые товары для демонстрации
const mockProducts = [
    { id: 1, name: 'Беспроводные наушники Sony WH-1000XM4', main_category: 'electronics', sub_category: 'Audio', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%234a90e2%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3ESony Headphones%3C/text%3E%3C/svg%3E', rating: 4.8, actual_price: 35000, discount_price: 24990, created_at: '2025-01-10T10:00:00' },
    { id: 2, name: 'Смартфон Samsung Galaxy S24', main_category: 'electronics', sub_category: 'Smartphones', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%2350c878%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3ESamsung Galaxy%3C/text%3E%3C/svg%3E', rating: 4.6, actual_price: 85000, discount_price: 72500, created_at: '2025-01-09T14:30:00' },
    { id: 3, name: 'Ноутбук Apple MacBook Pro 14"', main_category: 'electronics', sub_category: 'Computers', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ff6b6b%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EMacBook Pro%3C/text%3E%3C/svg%3E', rating: 4.9, actual_price: 150000, discount_price: null, created_at: '2025-01-08T09:15:00' },
    { id: 4, name: 'Фитнес-браслет Xiaomi Mi Band 7', main_category: 'sports & fitness', sub_category: 'Fitness Accessories', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f39c12%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EMi Band 7%3C/text%3E%3C/svg%3E', rating: 4.3, actual_price: 2990, discount_price: 1990, created_at: '2025-01-07T16:45:00' },
    { id: 5, name: 'Йога коврик профессиональный', main_category: 'sports & fitness', sub_category: 'Yoga', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%2327ae60%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EYoga Mat%3C/text%3E%3C/svg%3E', rating: 4.5, actual_price: 1500, discount_price: 990, created_at: '2025-01-06T12:20:00' },
    { id: 6, name: 'Гантели регулируемые 20 кг', main_category: 'sports & fitness', sub_category: 'Weights', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23e74c3c%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EDumbbells%3C/text%3E%3C/svg%3E', rating: 4.7, actual_price: 3500, discount_price: 2890, created_at: '2025-01-05T08:00:00' },
    { id: 7, name: 'Кухонный нож Victorinox Chef\'s', main_category: 'home & kitchen', sub_category: 'Knives', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%239b59b6%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EKitchen Knife%3C/text%3E%3C/svg%3E', rating: 4.4, actual_price: 4200, discount_price: null, created_at: '2025-01-04T13:30:00' },
    { id: 8, name: 'Кофемашина DeLonghi Magnifica', main_category: 'home & kitchen', sub_category: 'Appliances', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%236c5ce7%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3ECoffee Machine%3C/text%3E%3C/svg%3E', rating: 4.6, actual_price: 18000, discount_price: 14990, created_at: '2025-01-03T11:00:00' },
    { id: 9, name: 'Пижама флисовая комфорт', main_category: 'clothing', sub_category: 'Pajamas', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%23ff69b4 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EPajamas%3C/text%3E%3C/svg%3E', rating: 4.2, actual_price: 2500, discount_price: 1790, created_at: '2025-01-02T15:45:00' },
    { id: 10, name: 'Кроссовки Nike Air Max 90', main_category: 'clothing', sub_category: 'Shoes', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%231abc9c width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3ENike Air Max%3C/text%3E%3C/svg%3E', rating: 4.8, actual_price: 12000, discount_price: 8990, created_at: '2025-01-01T10:30:00' },
    { id: 11, name: 'Рюкзак The North Face', main_category: 'bags', sub_category: 'Backpacks', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%2334495e width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EBackpack%3C/text%3E%3C/svg%3E', rating: 4.7, actual_price: 8500, discount_price: 6490, created_at: '2024-12-31T14:15:00' },
    { id: 12, name: 'Наручные часы Casio G-Shock', main_category: 'accessories', sub_category: 'Watches', image_url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%236c757d width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22white%22%3EG-Shock Watch%3C/text%3E%3C/svg%3E', rating: 4.9, actual_price: 6500, discount_price: 4990, created_at: '2024-12-30T09:00:00' },
];

// INITIALIZATION
function init() {
    allProducts = [...mockProducts];
    updateCartCount();
    setupEventListeners();
    showCatalog();
}

function setupEventListeners() {
    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('ordersBtn').addEventListener('click', showOrders);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('autocompleteList').addEventListener('click', selectAutocomplete);
}

// NOTIFICATIONS
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationsContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// SEARCH & AUTOCOMPLETE
async function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        document.getElementById('autocompleteList').classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/autocomplete?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
        );
        const suggestions = await response.json();
        displayAutocomplete(suggestions);
    } catch (error) {
        console.error('Autocomplete error:', error);
    }
}

function displayAutocomplete(suggestions) {
    const list = document.getElementById('autocompleteList');
    list.innerHTML = '';
    if (suggestions.length === 0) {
        list.classList.remove('active');
        return;
    }

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = suggestion;
        item.addEventListener('click', () => selectAutocomplete(suggestion));
        list.appendChild(item);
    });

    list.classList.add('active');
}

function selectAutocomplete(suggestion) {
    if (typeof suggestion === 'object' && suggestion.target) {
        suggestion = suggestion.target.textContent;
    }
    document.getElementById('searchInput').value = suggestion;
    document.getElementById('autocompleteList').classList.remove('active');
    searchProducts();
}

async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        showNotification('Введите поисковый запрос', 'error');
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/goods?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
        );
        allProducts = await response.json();
        applyFilters();
        showCatalog();
    } catch (error) {
        showNotification('Ошибка при поиске товаров', 'error');
        console.error('Search error:', error);
    }
}

// CATALOG
async function showCatalog() {
    currentPage = 'catalog';
    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/goods?page=${currentPage_pagination}&api_key=${API_KEY}`
        );
        const data = await response.json();
        allProducts = Array.isArray(data) ? data : data.goods || [];
        originalProducts = [...allProducts];
        
        loadCategories();
        applyFilters();
        renderCatalog();
    } catch (error) {
        // При ошибке используем тестовые данные
        console.log('Используются тестовые данные');
        allProducts = [...mockProducts];
        originalProducts = [...allProducts];
        loadCategories();
        applyFilters();
        renderCatalog();
    }
}

function applyFilters() {
    let filtered = [...allProducts];

    if (filters.categories.length > 0) {
        filtered = filtered.filter(p => filters.categories.includes(p.main_category));
    }

    if (filters.priceMin !== null) {
        filtered = filtered.filter(p => {
            const price = p.discount_price || p.actual_price;
            return price >= filters.priceMin;
        });
    }

    if (filters.priceMax !== null) {
        filtered = filtered.filter(p => {
            const price = p.discount_price || p.actual_price;
            return price <= filters.priceMax;
        });
    }

    if (filters.onlyDiscount) {
        filtered = filtered.filter(p => p.discount_price && p.discount_price < p.actual_price);
    }

    // Sort
    if (sortOrder === 'rating_asc') {
        filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'rating_desc') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'price_asc') {
        filtered.sort((a, b) => {
            const priceA = a.discount_price || a.actual_price;
            const priceB = b.discount_price || b.actual_price;
            return priceA - priceB;
        });
    } else if (sortOrder === 'price_desc') {
        filtered.sort((a, b) => {
            const priceA = a.discount_price || a.actual_price;
            const priceB = b.discount_price || b.actual_price;
            return priceB - priceA;
        });
    }

    allProducts = filtered;
}

function loadCategories() {
    const categories = [...new Set(allProducts.map(p => p.main_category))];
    const categoryContainer = document.getElementById('categoryCheckboxes');
    
    if (categoryContainer) {
        categoryContainer.innerHTML = '';
        categories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${category}" onchange="updateFilter('categories', this)">
                ${category}
            `;
            categoryContainer.appendChild(label);
        });
    }
}

function updateFilter(type, element) {
    if (type === 'categories') {
        const value = element.value;
        if (element.checked) {
            if (!filters.categories.includes(value)) filters.categories.push(value);
        } else {
            filters.categories = filters.categories.filter(c => c !== value);
        }
    }
}

function renderCatalog() {
    const content = document.getElementById('mainContent');
    
    let html = `
        <div class="main-content">
            <div class="sidebar">
                <div class="filter-group">
                    <h3>Категория</h3>
                    <div class="checkbox-group" id="categoryCheckboxes"></div>
                </div>
                <div class="filter-group">
                    <h3>Стоимость</h3>
                    <div class="price-inputs">
                        <input type="number" placeholder="От" id="priceMin" min="0">
                        <input type="number" placeholder="До" id="priceMax" min="0">
                    </div>
                </div>
                <div class="filter-group">
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="onlyDiscount" onchange="updateDiscountFilter(this)">
                            Только со скидками
                        </label>
                    </div>
                </div>
                <button class="btn-apply" onclick="applyFiltersAndRender()">Применить</button>
            </div>
            <div>
                <div class="catalog-header">
                    <h2>Каталог</h2>
                    <select class="sort-select" onchange="changeSortOrder(this.value)">
                        <option value="rating_desc">По рейтингу (выше)</option>
                        <option value="rating_asc">По рейтингу (ниже)</option>
                        <option value="price_asc">По цене (дешевле)</option>
                        <option value="price_desc">По цене (дороже)</option>
                    </select>
                </div>
                <div class="products-grid" id="productsGrid"></div>
                <button class="btn-load-more" onclick="showCatalog()">Загрузить ещё</button>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    loadCategories();
    renderProducts(allProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>Нет товаров, соответствующих вашему запросу</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const discount = product.discount_price && product.discount_price < product.actual_price
            ? Math.round((1 - product.discount_price / product.actual_price) * 100)
            : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">★</span>
                    <span>${product.rating.toFixed(1)}</span>
                </div>
                <div class="product-price">
                    ${product.discount_price && product.discount_price < product.actual_price ? `
                        <div class="price-original">${product.actual_price} ₽</div>
                        <div>
                            <span class="price-current">${product.discount_price} ₽</span>
                            <span class="discount-badge">-${discount}%</span>
                        </div>
                    ` : `
                        <div class="price-current">${product.actual_price} ₽</div>
                    `}
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Добавить в корзину</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function changeSortOrder(order) {
    sortOrder = order;
    applyFilters();
    renderProducts(allProducts);
}

function applyFiltersAndRender() {
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;

    filters.priceMin = priceMin ? parseInt(priceMin) : null;
    filters.priceMax = priceMax ? parseInt(priceMax) : null;
    
    const AllFiltersEmpty =
        filters.categories.length === 0 &&
        filters.priceMin === null &&
        filters.priceMax === null &&
        !filters.onlyDiscount;

    if (AllFiltersEmpty) {
        allProducts = [...originalProducts];
        applySorting();
    } else {
        applyFilters();
    }

    renderProducts(allProducts);
}

function applySorting() {
    if (sortOrder === 'rating_asc') {
        allProducts.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'rating_desc') {
        allProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'price_asc') {
        allProducts.sort((a, b) => {
            const priceA = a.discount_price || a.actual_price;
            const priceB = b.discount_price || b.actual_price;
            return priceA - priceB;
        });
    } else if (sortOrder === 'price_desc') {
        allProducts.sort((a, b) => {
            const priceA = a.discount_price || a.actual_price;
            const priceB = b.discount_price || b.actual_price;
            return priceB - priceA;
        });
    }
}

function updateDiscountFilter(element) {
    filters.onlyDiscount = element.checked;
}

// CART
function addToCart(productId) {
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Товар добавлен в корзину', 'success');
    }
}

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
}

async function showCart() {
    currentPage = 'cart';
    const content = document.getElementById('mainContent');
    
    if (cart.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <p>Корзина пуста. Перейдите в каталог, чтобы добавить товары.</p>
                <a href="#/" class="btn-to-catalog" onclick="showCatalog()">В каталог</a>
            </div>
        `;
        return;
    }

    try {
        let products = [];
        try {
            products = await Promise.all(
                cart.map(id => fetch(`${API_BASE}/exam-2024-1/api/goods/${id}?api_key=${API_KEY}`).then(r => r.json()))
            );
        } catch (e) {
            // При ошибке используем тестовые данные
            products = cart.map(id => mockProducts.find(p => p.id === id)).filter(p => p);
        }

        let html = `
            <div class="cart-section">
                <h2>Корзина</h2>
                <div class="products-grid" id="cartGrid"></div>
            </div>
            <div class="order-form-section">
                <h2>Оформление заказа</h2>
                <form id="orderForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Имя</label>
                            <input type="text" name="full_name" placeholder="Иванов Иван" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="example@mail.ru" required>
                        </div>
                        <div class="form-group">
                            <label>Телефон</label>
                            <input type="text" name="phone" placeholder="+74952230523" required>
                        </div>
                        <div class="form-group">
                            <label>Адрес доставки</label>
                            <input type="text" name="delivery_address" placeholder="ул. Большая Семёновская, 38" required>
                        </div>
                        <div class="form-group">
                            <label>Дата доставки</label>
                            <input type="date" name="delivery_date" required>
                        </div>
                        <div class="form-group">
                            <label>Время доставки</label>
                            <select name="delivery_interval" required onchange="updateOrderTotal()">
                                <option value="08:00-12:00">08:00 - 12:00</option>
                                <option value="12:00-14:00">12:00 - 14:00</option>
                                <option value="14:00-18:00">14:00 - 18:00</option>
                                <option value="18:00-22:00">18:00 - 22:00</option>
                            </select>
                        </div>
                        <div class="form-group full">
                            <label>Согласие на получение рассылки</label>
                            <label class="checkbox-label inline">
                                <input type="checkbox" name="subscribe">
                                Подписаться на рассылку
                            </label>
                        </div>
                        <div class="form-group full">
                            <label>Комментарий</label>
                            <textarea name="comment" placeholder="Ваши пожелания..."></textarea>
                        </div>
                    </div>
                    <div class="order-summary">
                        <h3>Итого</h3>
                        <div class="summary-row">
                            <span>Товары:</span>
                            <span id="goodsTotal">0 ₽</span>
                        </div>
                        <div class="summary-row">
                            <span>Доставка:</span>
                            <span id="deliveryTotal">200 ₽</span>
                        </div>
                        <div class="summary-row total">
                            <span>Итоговая стоимость:</span>
                            <span id="finalTotal">0 ₽</span>
                        </div>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="btn btn-secondary" onclick="showCatalog()">Отмена</button>
                        <button type="submit" class="btn btn-primary">Оформить</button>
                    </div>
                </form>
            </div>
        `;

        content.innerHTML = html;

        const cartGrid = document.getElementById('cartGrid');
        products.forEach((product, index) => {
            const discount = product.discount_price && product.discount_price < product.actual_price
                ? Math.round((1 - product.discount_price / product.actual_price) * 100)
                : 0;

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3C/svg%3E'">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-rating">
                        <span class="stars">★</span>
                        <span>${product.rating.toFixed(1)}</span>
                    </div>
                    <div class="product-price">
                        ${product.discount_price && product.discount_price < product.actual_price ? `
                            <div class="price-original">${product.actual_price} ₽</div>
                            <div>
                                <span class="price-current">${product.discount_price} ₽</span>
                                <span class="discount-badge">-${discount}%</span>
                            </div>
                        ` : `
                            <div class="price-current">${product.actual_price} ₽</div>
                        `}
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${product.id})">Удалить из корзины</button>
                </div>
            `;
            cartGrid.appendChild(card);
        });

        document.getElementById('orderForm').addEventListener('submit', submitOrder);
        updateOrderTotal();
    } catch (error) {
        showNotification('Ошибка при загрузке корзины', 'error');
        console.error('Cart error:', error);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
}

function calculateDelivery() {
    const dateInput = document.querySelector('input[name="delivery_date"]').value;
    const interval = document.querySelector('select[name="delivery_interval"]').value;

    if (!dateInput) return 200;

    const date = new Date(dateInput);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isEvening = interval === '18:00-22:00';

    let delivery = 200;
    if (isEvening && !isWeekend) delivery += 200;
    if (isWeekend) delivery += 300;

    return delivery;
}

function updateOrderTotal() {
    const cartItems = cart.map(id => {
        const product = allProducts.find(p => p.id === id);
        return product ? (product.discount_price || product.actual_price) : 0;
    });

    const goodsTotal = cartItems.reduce((sum, price) => sum + price, 0);
    const delivery = calculateDelivery();
    const total = goodsTotal + delivery;

    document.getElementById('goodsTotal').textContent = `${goodsTotal} ₽`;
    document.getElementById('deliveryTotal').textContent = `${delivery} ₽`;
    document.getElementById('finalTotal').textContent = `${total} ₽`;
}

async function submitOrder(e) {
    e.preventDefault();

    // Преобразование даты из yyyy-mm-dd в dd.mm.yyyy
    const dateInput = document.querySelector('input[name="delivery_date"]').value;
    const [year, month, day] = dateInput.split('-');
    const formattedDate = `${day}.${month}.${year}`;

    const formData = {
        full_name: document.querySelector('input[name="full_name"]').value,
        email: document.querySelector('input[name="email"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        delivery_address: document.querySelector('input[name="delivery_address"]').value,
        delivery_date: formattedDate,
        delivery_interval: document.querySelector('select[name="delivery_interval"]').value,
        comment: document.querySelector('textarea[name="comment"]').value,
        subscribe: document.querySelector('input[name="subscribe"]').checked ? 1 : 0,
        good_ids: cart
    };

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/orders?api_key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            }
        );

        if (response.ok) {
            showNotification('Заказ успешно оформлен!', 'success');
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            setTimeout(() => showCatalog(), 1500);
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || errorData.message || `Ошибка ${response.status}: ${response.statusText}`;
            showNotification(`Ошибка при оформлении заказа: ${errorMessage}`, 'error');
            console.error('Order error:', errorData);
        }
    } catch (error) {
        showNotification(`Ошибка при отправке заказа: ${error.message}`, 'error');
        console.error('Order submit error:', error);
    }
}

// ORDERS
async function showOrders() {
    currentPage = 'orders';
    const content = document.getElementById('mainContent');

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/orders?api_key=${API_KEY}`
        );
        allOrders = await response.json();

        if (!Array.isArray(allOrders)) {
            allOrders = [];
        }

        let html = `
            <div class="cart-section">
                <h2>Заказы</h2>
                ${allOrders.length === 0 ? `
                    <div class="empty-state">
                        <p>У вас нет заказов</p>
                        <a href="#/" class="btn-to-catalog" onclick="showCatalog()">В каталог</a>
                    </div>
                ` : `
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Дата</th>
                                <th>Товары</th>
                                <th>Сумма</th>
                                <th>Доставка</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody id="ordersBody"></tbody>
                    </table>
                `}
            </div>
        `;

        content.innerHTML = html;

        if (allOrders.length > 0) {
            const tbody = document.getElementById('ordersBody');
            allOrders.forEach((order, index) => {
                const row = document.createElement('tr');
                const productNames = getProductNames(order.good_ids);
                const productsDisplay = productNames.slice(0, 2).join(', ') + (productNames.length > 2 ? ` +${productNames.length - 2}` : '');
                const goodsTotal = calculateOrderSum(order.good_ids);
                const deliveryPrice = calculateDeliveryPrice(order.delivery_date, order.delivery_interval);
                const totalWithDelivery = goodsTotal + deliveryPrice;
                const deliveryText = `${order.delivery_date} ${order.delivery_interval}`;
                
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                    <td title="${productNames.join(', ')}">${productsDisplay}</td>
                    <td>${totalWithDelivery} ₽</td>
                    <td>${deliveryText}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-small btn-view" onclick="viewOrder(${order.id})">
                                <img src="eye.png" height="20"></button>
                            <button class="btn-small btn-edit" onclick="editOrder(${order.id})">✎</button>
                            <button class="btn-small btn-delete" onclick="deleteOrder(${order.id})">
                                <img src="delete.png" height="20">
                                </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        showNotification('Ошибка при загрузке заказов', 'error');
        console.error('Orders error:', error);
    }
}

function calculateOrderSum(goodIds) {
    // Расчет суммы заказа на основе товаров
    return goodIds.reduce((sum, id) => {
        const product = allProducts.find(p => p.id === id) || mockProducts.find(p => p.id === id);
        if (product) {
            return sum + (product.discount_price || product.actual_price);
        }
        return sum;
    }, 0);
}

function getProductNames(goodIds) {
    // Получить названия товаров по ID
    return goodIds.map(id => {
        const product = allProducts.find(p => p.id === id) || mockProducts.find(p => p.id === id);
        return product ? product.name : `Товар #${id}`;
    });
}

function viewOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const productNames = getProductNames(order.good_ids);
    const goodsTotal = calculateOrderSum(order.good_ids);
    const deliveryPrice = calculateDeliveryPrice(order.delivery_date, order.delivery_interval);
    const totalAmount = goodsTotal + deliveryPrice;

    const content = document.getElementById('viewOrderContent');
    content.innerHTML = `
        <p><strong>ФИО:</strong> ${order.full_name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Адрес:</strong> ${order.delivery_address}</p>
        <p><strong>Дата доставки:</strong> ${order.delivery_date}</p>
        <p><strong>Время:</strong> ${order.delivery_interval}</p>
        <p><strong>Товары (${order.good_ids.length} шт.):</strong></p>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            ${productNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
        <p><strong>Сумма товаров:</strong> ${goodsTotal} ₽</p>
        <p><strong>Доставка:</strong> ${deliveryPrice} ₽</p>
        <p><strong>Итого:</strong> <span style="color: var(--accent-color); font-weight: bold;">${totalAmount} ₽</span></p>
        <p><strong>Комментарий:</strong> ${order.comment || 'Нет'}</p>
    `;

    openModal('viewOrderModal');
}

function calculateDeliveryPrice(deliveryDate, deliveryInterval) {
    if (!deliveryDate) return 200;

    const parts = deliveryDate.split('.');
    let date;
    if (parts.length === 3) {
        // Формат dd.mm.yyyy
        date = new Date(parts[2], parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
        // Формат yyyy-mm-dd
        date = new Date(deliveryDate);
    }

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isEvening = deliveryInterval === '18:00-22:00';

    let delivery = 200;
    if (isEvening && !isWeekend) delivery += 200;
    if (isWeekend) delivery += 300;

    return delivery;
}

function editOrder(orderId) {
    currentOrderId = orderId;
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const form = document.getElementById('editOrderForm');
    form.full_name.value = order.full_name;
    form.email.value = order.email;
    form.phone.value = order.phone;
    form.delivery_address.value = order.delivery_address;
    form.delivery_date.value = order.delivery_date;
    form.delivery_interval.value = order.delivery_interval;
    form.comment.value = order.comment || '';

    openModal('editOrderModal');
}

async function saveOrder() {
    if (!currentOrderId) return;

    const form = document.getElementById('editOrderForm');
    const data = {
        full_name: form.full_name.value,
        email: form.email.value,
        phone: form.phone.value,
        delivery_address: form.delivery_address.value,
        delivery_date: form.delivery_date.value,
        delivery_interval: form.delivery_interval.value,
        comment: form.comment.value
    };

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/orders/${currentOrderId}?api_key=${API_KEY}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );

        if (response.ok) {
            showNotification('Заказ успешно обновлен', 'success');
            closeModal('editOrderModal');
            showOrders();
        } else {
            showNotification('Ошибка при обновлении заказа', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при сохранении заказа', 'error');
        console.error('Edit order error:', error);
    }
}

function deleteOrder(orderId) {
    currentOrderId = orderId;
    openModal('deleteOrderModal');
}

async function confirmDelete() {
    if (!currentOrderId) return;

    try {
        const response = await fetch(
            `${API_BASE}/exam-2024-1/api/orders/${currentOrderId}?api_key=${API_KEY}`,
            { method: 'DELETE' }
        );

        if (response.ok) {
            showNotification('Заказ успешно удален', 'success');
            closeModal('deleteOrderModal');
            showOrders();
        } else {
            showNotification('Ошибка при удалении заказа', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при удалении заказа', 'error');
        console.error('Delete error:', error);
    }
}

// MODAL
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Event Listeners
document.getElementById('saveOrderBtn')?.addEventListener('click', saveOrder);
document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);

// Initialize
init();