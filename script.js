// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Modal logic
const modal = document.getElementById('orderModal');
if (modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#orderForm');
    const totalEl = modal.querySelector('#totalAmount');
    const qtyEls = modal.querySelectorAll('.qty');

    // Open buttons (menu & contact page dono)
    document.querySelectorAll('.order-trigger, .large-btn.whatsapp-btn, .btn[href="#contact"]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    });

    // Close
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = e => { if (e.target === modal) closeModal(); };

    // Live total
    const calcTotal = () => {
        let sum = 0;
        qtyEls.forEach(el => {
            sum += (parseInt(el.value) || 0) * (parseFloat(el.dataset.price) || 0);
        });
        if (totalEl) totalEl.textContent = `₹${sum}`;
    };

    qtyEls.forEach(el => el.addEventListener('input', calcTotal));

    // Submit to WhatsApp
    if (form) {
        form.onsubmit = e => {
            e.preventDefault();

            const name = form.querySelector('#customerName')?.value.trim() || 'Guest';
            const phone = form.querySelector('#customerPhone')?.value.trim() || '';
            const addr = form.querySelector('#deliveryAddress')?.value.trim() || 'Pickup';
            const notes = form.querySelector('#extraNotes')?.value.trim() || '';

            let msg = `Hello limbach's Restaurant!%0A%0AOrder Details:%0AName: ${name}`;
            if (phone) msg += `%0APhone: ${phone}`;
            msg += `%0AAddress/Pickup: ${addr}%0A%0AItems:%0A`;

            let total = 0;
            qtyEls.forEach(el => {
                const q = parseInt(el.value) || 0;
                if (q > 0) {
                    const item = el.dataset.item || 'Item';
                    const p = parseFloat(el.dataset.price) || 0;
                    const subt = q * p;
                    total += subt;
                    msg += `- ${q} × ${item} = ₹${subt}%0A`;
                }
            });

            msg += `%0A*Total: ₹${total}*%0A`;
            if (notes) msg += `%0ANotes: ${notes}`;

            const link = `https://wa.me/918469217638?text=${encodeURIComponent(msg)}`;
            window.open(link, '_blank');

            closeModal();
            form.reset();
            calcTotal();
        };
    }
}
// Open modal
document.querySelectorAll('.order-trigger, .large-btn.whatsapp-btn, .btn[href="#contact"]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            // Force reflow to fix visibility glitch
            modal.offsetHeight;
        }
    });
});

// Close
function closeModalFunc() {
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}