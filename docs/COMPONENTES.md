# Documentação de Componentes - Floramazônia Landing Page

## 📦 Arquitetura de Componentes

> **Nota**: O HTML de todas as seções está inline no `index.html`. Os arquivos `.html` que existiam nas pastas de componentes foram removidos na auditoria de código. Apenas CSS e JS são mantidos modularmente.

---

## Seções (`/src/components/sections/`)

### Hero
- **Arquivos**: `Hero.css`, `Hero.js`
- **Classe JS**: `TrueFocusAnimation` — Cicla foco visual entre "Açaí", "Gelato" e "Sorbet"
- **Inicialização**: Via `main.js` → `new TrueFocusAnimation('[data-animation="products"]')`

### Sobre
- **Arquivos**: `Sobre.css`
- **Descrição**: Apresentação da Floramazônia, história e valores

### Produtos
- **Arquivos**: `Produtos.css`
- **Descrição**: Cards de produtos com botões `[data-whatsapp]` para pedido via WhatsApp

### Marcas
- **Arquivos**: `Marcas.css`
- **Descrição**: Loop infinito de logos de marcas parceiras (logoloop). Inicializado via `initLogoLoop()` no `main.js`

### Benefícios
- **Arquivos**: `Beneficios.css`
- **Descrição**: Cards de benefícios dos produtos. Animação com GSAP ScrollTrigger (inline no `index.html`)
- **Variáveis CSS**: Usa variáveis de `variables.css` (`--color-nature-*`)

### Depoimentos
- **Arquivos**: `Depoimentos.css`
- **Descrição**: Carrossel de depoimentos com estrelas SVG via `<use href="#icon-star"/>`

### Estatísticas
- **Arquivos**: `Estatisticas.css`, `Estatisticas.js`
- **Função**: `initEstatisticas()` — Contadores animados
- **Status**: Exporta função mas **não é importada** no `main.js` (candidato a integração)

### FAQ
- **Arquivos**: `FAQ.css`, `FAQ.js`
- **Função**: `initFAQ()` — Accordion de perguntas frequentes
- **Inicialização**: Via `main.js` → `initFAQ()`

### Galeria
- **Arquivos**: `Galeria.css`, `Galeria.js`
- **Função**: `initGaleria()` — Galeria de imagens
- **Status**: Exporta função mas **não é importada** no `main.js` (candidato a integração)

### Localização
- **Arquivos**: `Localizacao.css`
- **Descrição**: Mapa Google Maps e informações de endereço. Animação de digitação via `textType.js`

### CTA (Call-to-Action)
- **Arquivos**: `CTA.css`, `CTA.js`, `GradualBlur.css`, `GradualBlur.js`
- **Função**: `initCTAForm()` — Formulário que monta mensagem e abre WhatsApp
- **Config**: Número do WhatsApp importado de `config.js`
- **Inicialização**: Via `main.js` → `initCTAForm()`
- **GradualBlur**: Efeito visual de blur gradual aplicado a elementos decorativos

### Footer
- **Arquivos**: `Footer.css`
- **Descrição**: Rodapé com links, redes sociais e informações de contato

---

## Componentes Comuns (`/src/components/common/`)

### Header
- **Arquivos**: `Header.css`
- **JS**: Funções `initHeader()` e `initMobileMenu()` estão no `main.js`
- **Descrição**: Cabeçalho fixo com navegação, logo e botão CTA

### WhatsAppButton
- **Arquivos**: `WhatsAppButton.css`
- **Descrição**: Botão flutuante do WhatsApp (canto inferior direito)

---

## Configuração Centralizada (`/src/config/config.js`)

```javascript
export const WHATSAPP_NUMBER = '558587775898';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CTA_DEFAULT_MESSAGE = '...';
```

Importado por `main.js` e `CTA.js` para evitar hardcoding.

---

## 🎯 Fluxo de Inicialização (`main.js`)

```
DOMContentLoaded
├── initHeader()
├── initMobileMenu()
├── initSmoothScroll()
├── initWhatsApp()          ← usa WHATSAPP_NUMBER de config.js
├── initBlurText()
├── initLogoLoop()
├── new TrueFocusAnimation()
├── initFAQ()
└── initCTAForm()
```

## 📱 Integração WhatsApp

Dois mecanismos:
1. **Atributo `[data-whatsapp]`** — Botões com esse atributo são interceptados por `initWhatsApp()` no `main.js`, que abre o WhatsApp com mensagem padrão
2. **Formulário CTA** — O `initCTAForm()` no `CTA.js` monta uma mensagem personalizada com dados do formulário
