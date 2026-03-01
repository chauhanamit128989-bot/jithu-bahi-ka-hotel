
// Optional: Add scroll animation trigger (if you want more advanced effects later)
window.addEventListener('scroll', () => {
    // You can add more JS animations here if needed
});
// ... your existing smooth scroll code ...

// Order Modal + Live Total
const modal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');
const totalDisplay = document.getElementById('totalAmount');
const qtyInputs = document.querySelectorAll('.qty');

// Open modal on any "Order Now" button click
document.querySelectorAll('.whatsapp-btn, .order-btn, .large-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// Live total update
function updateTotal() {
    let total = 0;
    qtyInputs.forEach(input => {
        const qty = parseInt(input.value) || 0;
        const price = parseFloat(input.dataset.price);
        total += qty * price;
    });
    totalDisplay.textContent = `₹${total}`;
}

qtyInputs.forEach(input => {
    input.addEventListener('input', updateTotal);
});

// Form Submit to WhatsApp
// Form Submit → Create dynamic WhatsApp link and simulate click (no popup block)
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim() || 'Guest';
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim() || 'Pickup';
    const notes = document.getElementById('extraNotes').value.trim();

    let orderText = `Hello Chauhan's Restaurant!%0A%0AI'd like to place an order:%0AName: ${name}`;
    if (phone) orderText += `%0APhone: ${phone}`;
    orderText += `%0AAddress: ${address}%0A%0AItems:%0A`;

    let total = 0;
    qtyInputs.forEach(input => {
        const qty = parseInt(input.value);
        if (qty > 0) {
            const itemName = input.dataset.item;
            const price = parseFloat(input.dataset.price);
            const itemTotal = qty * price;
            total += itemTotal;
            orderText += `- ${qty} × ${itemName} (₹${price}) = ₹${itemTotal}%0A`;
        }
    });

    orderText += `%0A*Total: ₹${total}*%0A`;
    if (notes) orderText += `%0AExtra Notes: ${notes}`;

    // WhatsApp link without window.open (prevents block)
    const waNumber = '918469217638';
    const waLink = `https://wa.me/${waNumber}?text=${orderText}`;

    // Create invisible <a> tag and click it programmatically
    const link = document.createElement('a');
    link.href = waLink;
    link.target = '_blank';          // or '_system' if in hybrid app
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // clean up

    // Optional: close modal & reset
    modal.style.display = 'none';
    orderForm.reset();
    updateTotal();
});