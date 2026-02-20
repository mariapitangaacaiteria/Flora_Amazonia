# Guia Rápido de Manutenção

## Checklist de SEO e Conversão
- Títulos e descrições: mantenha o `title` (55–60 caracteres) e `meta description` (140–160 caracteres) alinhados ao produto principal e cidade alvo.
- Canonical: confirme que o `link rel="canonical"` aponta para a URL final publicada (domínio floramazonia.com.br) em cada página.
- Robots e sitemap: após qualquer nova página/âncora, atualize `public/sitemap.xml` e confirme que `public/robots.txt` referencia o sitemap correto.
- Imagens: sempre salve em WebP/PNG otimizados, com `alt` descritivo contendo produto + benefício (ex.: "Açaí premium cremoso sem conservantes").
- Dados estruturados: mantenha os blocos JSON-LD de `LocalBusiness`, `FAQPage` e `BreadcrumbList` sincronizados com telefone, horário e ofertas reais.
- Performance: use `preload` apenas para recursos críticos, remova CSS/JS não utilizados e mantenha o tamanho das imagens do hero abaixo de 250 KB.
- Formulários e leads: teste o CTA principal (WhatsApp e formulários) após cada deploy; valide que números e links UTM estão corretos.

## Passos para publicar em floramazonia.com.br
1. Ajuste URLs absolutas: garanta que referências a domínios usem `https://floramazonia.com.br` (og:url, canonical, sitemap, manifest, JSON-LD).
2. Build: `npm install` (ou `pnpm install`) e depois `npm run build` para gerar `dist/`.
3. Deploy: envie o conteúdo de `dist/` para o host (ex.: bucket S3 + CloudFront ou Vercel/Netlify). Configure HTTPS e redirecionamento 301 de `www` para raiz.
4. DNS: aponte o domínio para o provedor do deploy (A/AAAA ou CNAME). Aguarde propagação.
5. Testes pós-deploy: valide Lighthouse (SEO + Performance > 90), verifique preview de Open Graph/Twitter e teste as rotas do sitemap.

## Rotina de atualização de conteúdo
- Para novos produtos ou seções: crie o bloco na página, adicione âncora no menu, inclua entrada no sitemap e revise textos com palavras-chave locais (ex.: "açaí premium em Fortaleza").
- Para novas imagens: inclua em `src/assets/images/`, atualize versões otimizadas e revise o `manifest.json` se forem ícones.
- Para campanhas: ajuste títulos/descrições de CTA e inclua parâmetros UTM nos links de WhatsApp.

## Git e versionamento
- Branch principal: use `main`. Faça commits atômicos e mensagens curtas.
- Não versione: `node_modules/`, `dist/`, arquivos `.env`. O `.gitignore` já cobre essas entradas.
- Antes de subir: rode `npm run lint` (se configurado) e `npm run build` para evitar quebrar o deploy.

## Contatos e dados críticos
- Telefone oficial: (85) 8777-5898 (WhatsApp). Mantenha esse número igual em HTML, JSON-LD e CTAs.
- E-mail: contato@floramazonia.com.br. Atualize em JSON-LD e formulários se mudar.
- Horário de atendimento: seg–sex 08h–18h; sábado 08h–12h (ajuste no JSON-LD se houver mudança).
