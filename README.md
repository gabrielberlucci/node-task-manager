# Task Manager API

Uma API backend para monitoramento de sistema (System Monitor) construída com Node.js, Express e TypeScript. 

A aplicação coleta informações e métricas de hardware da máquina host, como dados da CPU (velocidade, cache, processos) e Memória RAM. Por utilizar comandos do PowerShell para certas coletas, ela funciona somente para o sistema operacional **Windows**.

## Funcionalidades e Rotas (API REST)

### CPU (`/api/v1/cpu`)
- `GET /static-info`: Retorna informações estáticas do processador (velocidade base, número de núcleos lógicos, tamanhos de cache L1, L2, L3, etc.).
- `GET /uptime`: Retorna o tempo de atividade (uptime) do sistema operacional (horas, minutos, segundos).
- `GET /usage`: Retorna a porcentagem atual de uso da CPU.
- `GET /total-processes`: Retorna o total de processos em execução, threads e handles na máquina.

### Memória (`/api/v1/memory`)
- `GET /info`: Retorna o total de memória RAM instalada, a quantidade livre (em GB) e a porcentagem de uso.

### Sistema (`/api/v1/system`)
- `GET /stream`: Rota preparada (Server-Sent Events - SSE) para transmitir informações do sistema de forma contínua.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/) (Utilizando os módulos nativos `os` e `child_process`)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [CORS](https://github.com/expressjs/cors)
- [pnpm](https://pnpm.io/) (Gerenciador de dependências)
- [tsx](https://github.com/privatenumber/tsx) (Execução de TypeScript no desenvolvimento)

## Estrutura do Projeto

```text
/app
├── /src
│   ├── /controllers   # Intermediários entre as rotas e os serviços
│   ├── /errors        # Classes de tratamento de erros customizados (ex: HardwareInfoError)
│   ├── /middlewares   # Middlewares do Express (ex: tratamento global de erros)
│   ├── /routes        # Definição dos endpoints separados por domínio (cpu, memory, system)
│   ├── /services      # Lógica central e extração de dados do sistema (PowerShell/Node os)
│   ├── /types         # Tipagens e interfaces do TypeScript
│   ├── /utils         # Utilitários auxiliares da aplicação
│   └── server.ts      # Ponto de entrada que configura e inicializa o servidor
└── package.json
```

## Como rodar o projeto localmente

### Pré-requisitos

1. **Windows** (Pois a API faz uso do `powershell.exe` nativamente).
2. **Node.js** instalado na sua máquina.
3. **pnpm** instalado globalmente.

### Instalação e Execução

1. Abra o terminal e navegue até o diretório do projeto.
2. Acesse a pasta da aplicação:
   ```bash
   cd app
   ```
3. Instale as dependências do projeto:
   ```bash
   pnpm install
   ```
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   pnpm dev
   ```
   
O servidor iniciará na porta **3000**. Você poderá acessar a API localmente pela URL: `http://localhost:3000`.
