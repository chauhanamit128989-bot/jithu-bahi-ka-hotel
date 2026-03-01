
// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Modal Controls
const modal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');
const totalDisplay = document.getElementById('totalAmount');
const qtyInputs = document.querySelectorAll('.qty');

// Open modal – improved selector & prevent default
document.querySelectorAll('.order-trigger, .whatsapp-btn.large-btn, .btn[href="#contact"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open'); // lock scroll
        }
    });
});

// Close modal
function closeModalFunc() {
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

if (closeModal) closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

// Live total update
function updateTotal() {
    let total = 0;
    qtyInputs.forEach(input => {
        const qty = parseInt(input.value) || 0;
        const price = parseFloat(input.dataset.price) || 0;
        total += qty * price;
    });
    if (totalDisplay) totalDisplay.textContent = `₹${total}`;
}

qtyInputs.forEach(input => input.addEventListener('input', updateTotal));

// WhatsApp submit – reliable method
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('customerName')?.value.trim() || 'Guest';
        const phone = document.getElementById('customerPhone')?.value.trim() || '';
        const address = document.getElementById('deliveryAddress')?.value.trim() || 'Pickup';
        const notes = document.getElementById('extraNotes')?.value.trim() || '';

        let orderText = `Hello limbach's Restaurant!%0A%0AI'd like to place an order:%0AName: ${name}`;
        if (phone) orderText += `%0APhone: ${phone}`;
        orderText += `%0AAddress: ${address}%0A%0AItems:%0A`;

        let total = 0;
        qtyInputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                const itemName = input.dataset.item || 'Item';
                const price = parseFloat(input.dataset.price) || 0;
                const itemTotal = qty * price;
                total += itemTotal;
                orderText += `- ${qty} × ${itemName} = ₹${itemTotal}%0A`;
            }
        });

        orderText += `%0A*Total: ₹${total}*%0A`;
        if (notes) orderText += `%0AExtra Notes: ${notes}`;

        const waLink = `https://wa.me/918469217638?text=${encodeURIComponent(orderText)}`;

        // Most reliable way for mobile
        const link = document.createElement('a');
        link.href = waLink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset & close
        closeModalFunc();
        orderForm.reset();
        updateTotal();
    });
}