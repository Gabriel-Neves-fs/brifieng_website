# Briefing - Criação de Site

Formulário web para coletar informações de clientes que querem criar um site. O projeto foi feito com Vite, HTML, CSS e JavaScript, com envio das respostas por e-mail usando EmailJS.

## O Que o Projeto Faz

- Coleta dados de contato do cliente.
- Pergunta o objetivo principal do site.
- Permite selecionar funcionalidades desejadas.
- Coleta referências visuais e informações de identidade visual.
- Registra prazo, orçamento e observações adicionais.
- Monta um briefing completo em texto.
- Envia o briefing por e-mail usando EmailJS.

## Tecnologias Usadas

- HTML
- CSS
- JavaScript
- Vite
- EmailJS

## Estrutura de Pastas

```txt
.
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── index.html
├── main.js
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Como Instalar

Instale as dependências do projeto:

```bash
npm install
```

## Configuração do EmailJS

Crie um arquivo `.env` na raiz do projeto com as suas credenciais do EmailJS:

```env
VITE_PUBLIC_KEY=sua_public_key
VITE_SERVICE_ID=seu_service_id
VITE_TEMPLATE_ID=seu_template_id
```

Esses valores são encontrados no painel do EmailJS:

- `VITE_PUBLIC_KEY`: chave pública da sua conta.
- `VITE_SERVICE_ID`: ID do serviço de e-mail.
- `VITE_TEMPLATE_ID`: ID do template usado para envio.

No template do EmailJS, configure os campos principais assim:

```txt
To Email: {{to_email}}
Subject: {{subject}}
Reply To: {{reply_to}}
Message: {{message}}
```

O formulário também envia outras variáveis para facilitar ajustes no template:

```txt
from_name
name
user_name
from_email
reply_to
user_email
email
contact
to_email
to_name
recipient_email
recipient
subject
title
message
briefing
negocio
business
objetivo
prazo
orcamento
```

Se aparecer erro `422`, confira primeiro o campo **To Email** no template. Esse erro geralmente acontece quando o EmailJS espera uma variável que não foi enviada ou quando o destinatário ficou vazio.

## Como Rodar em Desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Depois acesse:

```txt
http://localhost:3000
```

## Como Gerar a Versão de Produção

Rode:

```bash
npm run build
```

O Vite vai criar a pasta:

```txt
dist/
```

Essa pasta contém os arquivos finais para publicar o site.

## Como Testar o Build

Depois de rodar o build, use:

```bash
npm run preview
```

## Deploy

Para publicar:

1. Rode `npm run build`.
2. Envie o conteúdo da pasta `dist/` para a hospedagem.
3. Se a plataforma fizer o build online, cadastre as variáveis de ambiente nela também.

A pasta `dist/` é gerada automaticamente. Ela pode ser apagada e recriada sempre que necessário.

## Arquivos Principais

- `index.html`: estrutura do formulário.
- `css/styles.css`: estilos da página.
- `js/script.js`: lógica dos campos, progresso e envio por e-mail.
- `main.js`: entrada principal do Vite.
- `.env`: credenciais locais do EmailJS.
- `dist/`: versão final gerada para produção.

## Segurança

O arquivo `.env` não deve ser enviado para o GitHub. Ele deve estar listado no `.gitignore`.

Mesmo usando `.env`, lembre que variáveis `VITE_` ficam disponíveis no frontend após o build. Por isso, configure também no painel do EmailJS as origens permitidas e limites de envio para reduzir abuso.
