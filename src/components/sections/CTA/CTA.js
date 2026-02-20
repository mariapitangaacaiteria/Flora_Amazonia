/* =====================================================
   CTA FINAL - JAVASCRIPT
   ===================================================== */

import { WHATSAPP_NUMBER } from '../../../config/config.js';

function initCTAForm() {
    const form = document.getElementById('cta-form');
    
    if (!form) return;
    
    // Número do WhatsApp importado de config.js
    const whatsappNumber = WHATSAPP_NUMBER;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpar erros anteriores
        clearErrors();
        
        // Capturar valores dos campos
        const nome = document.getElementById('cta-nome').value.trim();
        const telefone = document.getElementById('cta-telefone').value.trim();
        const interesse = document.getElementById('cta-interesse').value;
        const mensagem = document.getElementById('cta-mensagem').value.trim();
        
        // Validação
        let isValid = true;
        
        if (!nome) {
            showError('cta-nome', 'Por favor, informe seu nome');
            isValid = false;
        }
        
        if (!telefone) {
            showError('cta-telefone', 'Por favor, informe seu telefone');
            isValid = false;
        } else if (!isValidPhone(telefone)) {
            showError('cta-telefone', 'Informe um telefone válido');
            isValid = false;
        }
        
        if (!interesse) {
            showError('cta-interesse', 'Por favor, selecione uma opção');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Mapear interesse para texto legível
        const interesseTexto = getInteresseTexto(interesse);
        
        // Montar mensagem para WhatsApp
        let whatsappMessage = `*Nova mensagem do site Floramazonia*\n\n`;
        whatsappMessage += `*Nome:* ${nome}\n`;
        whatsappMessage += `*Telefone:* ${telefone}\n`;
        whatsappMessage += `*Interesse:* ${interesseTexto}\n`;
        
        if (mensagem) {
            whatsappMessage += `\n*Mensagem:*\n${mensagem}\n`;
        }
        
        whatsappMessage += `\n---\n_Mensagem enviada pelo formulario do site_`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Montar URL do WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp em nova aba
        window.open(whatsappURL, '_blank');
    });
    
    // Função para mostrar erro
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const group = field.closest('.cta-final__form-group');
        const errorElement = group.querySelector('.cta-final__form-error');
        
        field.classList.add('error');
        group.classList.add('has-error');
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    // Função para limpar erros
    function clearErrors() {
        const errorFields = form.querySelectorAll('.error');
        const errorGroups = form.querySelectorAll('.has-error');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorGroups.forEach(group => group.classList.remove('has-error'));
    }
    
    // Validar telefone (aceita vários formatos brasileiros)
    function isValidPhone(phone) {
        // Remove caracteres não numéricos
        const cleanPhone = phone.replace(/\D/g, '');
        // Aceita telefones com 10 ou 11 dígitos (com DDD)
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }
    
    // Mapear valor do select para texto
    function getInteresseTexto(value) {
        const opcoes = {
            'acai': 'Açaí',
            'gelato': 'Gelato',
            'sorbet': 'Sorbet',
            'revenda': 'Quero ser Revendedor',
            'atacado': 'Compra Atacado',
            'outro': 'Outro assunto'
        };
        return opcoes[value] || value;
    }
    
    // Máscara de telefone
    const telefoneInput = document.getElementById('cta-telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else if (value.length <= 10) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Remover classe de erro ao focar no campo
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const group = this.closest('.cta-final__form-group');
            if (group) {
                group.classList.remove('has-error');
            }
        });
    });
}

// Exportar função
export { initCTAForm };

