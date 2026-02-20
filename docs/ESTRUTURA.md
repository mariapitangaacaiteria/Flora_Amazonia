# Estrutura do Projeto - Floramazônia Landing Page

## 📋 Visão Geral

Landing page moderna desenvolvida com **HTML**, **CSS**, **JavaScript** e **Tailwind CSS**, otimizada para conversão e geração de leads via WhatsApp. O projeto usa **Vite** como bundler e GSAP/Anime.js para animações.

## 🏗️ Arquitetura

O projeto segue uma arquitetura **monolítica** — todo o conteúdo HTML está inline no `index.html`. Os estilos CSS e scripts JS são organizados em pastas modulares dentro de `src/`, importados pelo Vite durante o build.

## 🗂️ Estrutura de Pastas

### Raiz do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página principal (monolítica, ~1830 linhas) |
| `package.json` | Dependências e scripts |
| `tailwind.config.js` | Configuração do Tailwind CSS |
| `postcss.config.js` | Configuração do PostCSS |
| `vite.config.js` | Configuração do Vite (porta 3000) |

### `/src` — Código Fonte

#### `/src/config`
- `config.js` — Configurações centralizadas (WhatsApp, constantes)

#### `/src/scripts`
- `main.js` — Script principal, inicializa todos os componentes
- `textType.js` — Animação de digitação (seção Localização)

#### `/src/styles`
| Arquivo | Descrição |
|---------|-----------|
| `main.css` | Importa todos os estilos |
| `tailwind.css` | Diretivas do Tailwind |
| `variables.css` | Variáveis CSS customizadas (cores, fontes, espaçamentos) |
| `reset.css` | Reset de estilos |
| `animations.css` | Keyframes de animações |
| `components.css` | Estilos de componentes genéricos |
| `responsive.css` | Media queries adicionais |
| `textType.css` | Estilos da animação de digitação |
| `legal.css` | Estilos de páginas legais |

#### `/src/components/sections`

Cada seção possui uma pasta com arquivos CSS e, quando necessário, JS:

| Seção | CSS | JS | Descrição |
|-------|-----|-----|-----------|
| Hero | ✅ | ✅ `TrueFocusAnimation` | Banner principal com animação de foco |
| Sobre | ✅ | — | Apresentação da empresa |
| Produtos | ✅ | — | Cards de produtos |
| Marcas | ✅ | — | Loop de logos de marcas parceiras |
| Benefícios | ✅ | — | Cards de benefícios (GSAP ScrollTrigger) |
| Depoimentos | ✅ | — | Carrossel de depoimentos |
| Estatísticas | ✅ | ✅ `initEstatisticas` | Contadores animados |
| FAQ | ✅ | ✅ `initFAQ` | Accordion de perguntas |
| Galeria | ✅ | ✅ `initGaleria` | Galeria de imagens |
| Localização | ✅ | — | Mapa e endereço |
| CTA | ✅ | ✅ `initCTAForm` + `GradualBlur` | Formulário WhatsApp + efeito blur |
| Footer | ✅ | — | Rodapé |

#### `/src/components/common`
| Componente | Arquivos | Descrição |
|------------|----------|-----------|
| Header | `Header.css` | Estilos do cabeçalho (JS no main.js) |
| WhatsAppButton | `WhatsAppButton.css` | Estilos do botão flutuante |

#### `/src/assets`
- `/images` — Imagens do site (WebP, PNG, JPG)
- `/icons` — Ícones (reservado)
- `/fonts` — Fontes customizadas (reservado)
- `/videos` — Vídeos (reservado)

### `/public` — Arquivos Estáticos
- `manifest.json` — PWA manifest
- `robots.txt` — Configuração SEO
- `sitemap.xml` — Sitemap
- `humans.txt` — Créditos
- `security.txt` — Política de segurança

### `/docs` — Documentação
- `ESTRUTURA.md` — Este arquivo
- `COMPONENTES.md` — Documentação dos componentes
- `CATALOGO_AUDITORIA.md` — Registro de auditoria
- `MAINTENANCE.md` — Guia de manutenção

## 🔧 SVG Symbols

Os ícones SVG reutilizados (WhatsApp, estrela) estão definidos como `<symbol>` no início do `<body>` no `index.html`, referenciados via `<use href="#icon-whatsapp"/>` e `<use href="#icon-star"/>`.

## 📦 Build e Deploy

```bash
npm run dev       # Servidor de desenvolvimento (porta 3000)
npm run build     # Build de produção → /dist
npm run preview   # Preview do build
```

## 🔗 CDNs Externos

- **GSAP 3.12.2** + ScrollTrigger — Animações de scroll
- **Anime.js** — Animações programáticas
