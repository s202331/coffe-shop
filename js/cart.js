let cart = [];

/**
 * Dodaje produkt do koszyka
 * @param {string} name - Nazwa produktu
 * @param {number} price - Cena produktu
 */
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    
    // Animacja licznika w menu
    const countElement = document.getElementById("cart-count");
    countElement.style.transform = "scale(1.5)";
    countElement.style.color = "#c89b63";
    
    setTimeout(() => {
        countElement.style.transform = "scale(1)";
        countElement.style.color = "inherit";
    }, 200);

    console.log("Dodano do koszyka:", name);
}

/**
 * Odświeża wygląd koszyka i licznik
 */
function updateCartUI() {
    const countElement = document.getElementById("cart-count");
    const itemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("cart-subtotal");
    
    // Aktualizacja liczby produktów
    countElement.innerText = cart.length;
    
    // Czyścimy listę i budujemy ją od nowa
    itemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p style='text-align:center; padding: 20px;'>Koszyk jest pusty</p>";
    } else {
        cart.forEach((item, index) => {
            subtotal += item.price;
            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span><strong>${item.price} zł</strong></span>
                </div>`;
        });
    }
    
    // Aktualizacja sumy częściowej (bez dostawy)
    if (subtotalElement) {
        subtotalElement.innerText = subtotal;
    }
    
    updateTotal(subtotal);
}

/**
 * Oblicza sumę końcową z uwzględnieniem dostawy
 */
function updateTotal(providedSubtotal = null) {
    let subtotal = providedSubtotal;
    
    if (subtotal === null) {
        subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    }

    const deliverySelect = document.getElementById("delivery");
    const totalElement = document.getElementById("cart-total");
    
    const deliveryCost = parseInt(deliverySelect.value) || 0;
    const finalTotal = subtotal + deliveryCost;
    
    totalElement.innerText = finalTotal;
}

/**
 * Pokazuje lub ukrywa okno koszyka
 */
function toggleCart() {
    const overlay = document.getElementById("cart-overlay");
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
    } else {
        overlay.style.display = "none";
    }
}

/**
 * Przenosi dane z koszyka do formularza kontaktowego
 */
function goToCheckout() {
    if (cart.length === 0) {
        alert("Twój koszyk jest pusty!");
        return;
    }

    const total = document.getElementById("cart-total").innerText;
    const deliveryMethod = document.getElementById("delivery").options[document.getElementById("delivery").selectedIndex].text;
    const paymentMethod = document.getElementById("payment").value;
    const messageArea = document.getElementById("order-message");

    // Budujemy czytelną treść zamówienia dla taty
    let orderDetails = cart.map(item => `- ${item.name} (${item.price} zł)`).join("\n");
    
    const fullMessage = `Dzień dobry, chciałbym złożyć zamówienie:
\n${orderDetails}
\n---
Dostawa: ${deliveryMethod}
Płatność: ${paymentMethod}
ŁĄCZNA KWOTA: ${total} zł`;

    // Wstawiamy do textarea i przewijamy do sekcji kontakt
    messageArea.value = fullMessage;
    
    toggleCart(); // Zamykamy okno koszyka
    document.getElementById("contact").scrollIntoView({ behavior: 'smooth' });
    
    // Podświetlamy formularz, żeby klient wiedział co robić
    messageArea.style.border = "2px solid #c89b63";
    setTimeout(() => { messageArea.style.border = "1px solid #ddd"; }, 2000);
}
