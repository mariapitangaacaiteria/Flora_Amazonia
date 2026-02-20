/* =====================================================
   FAQ - JAVASCRIPT
   ===================================================== */

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle do item clicado
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });
}

// Exporta para uso modular
export { initFAQ };
