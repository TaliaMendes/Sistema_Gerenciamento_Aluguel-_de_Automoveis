# CSI606-2025-02 - Remoto - Trabalho Final - Resultados

**Discente:** Talia de Fatima Mendes

## Resumo
O presente trabalho consiste no desenvolvimento do sistema web de gerenciamento de aluguel de automóveis , **RunCar** 🚗 , uma aplicação full-stack para gerenciamento de locação de veículos. O sistema simula o funcionamento básico de uma locadora, permitindo que usuários consultem veículos disponíveis, realizem reservas, efetuem pagamento simulado e acompanhem multas associadas às locações.

O backend foi desenvolvido em Node.js com Express, utilizando arquitetura em camadas (Controller, Service e Repository) e banco de dados SQLite para persistência. O frontend foi desenvolvido em React + VITE, permitindo interação dinâmica com o sistema via API REST.

O projeto buscou aplicar conceitos de desenvolvimento web, organização de código, controle de acesso, integração frontend-backend e persistência de dados.

---

## 1. Funcionalidades implementadas
### 1.1 Gestão de Usuários
- Cadastro de cliente
- Login de cliente
- Controle de perfil (cliente e administrador)
- Autenticação administrativa via Basic Auth
  
### 1.2 Gestão de Veículos
- Listagem pública de veículos disponíveis
- Filtro por categoria e preço
- Cadastro de veículos (administrador)
- Edição de veículos (administrador)
- Inativação de veículos (administrador)
- Controle de status (DISPONIVEL / INDISPONIVEL)

### 1.3 Reservas
- Criação de reserva associada a cliente
- Validação de disponibilidade do veículo
- Cancelamento de reserva
- Finalização de reserva (devolução)
- Endpoint de resumo detalhado da reserva contendo:
- Dados do veículo
- Dados da reserva
- Pagamento
- Multas
- Cálculo do total geral da locação

### 1.4 Pagamento Simulado
- Registro de pagamento
- Escolha de método (PIX, Crédito, Débito, Simulado)
- Alteração automática do status para PAGO

### 1.5 Multas
- Registro de multa por administrador
- Associação de multa à reserva
- Consulta de multas por reserva
- Consulta de multas por usuário
- Cálculo do total acumulado de multas

### 1.6 Frontend
- Interface web responsiva
- Navegação com React Router
- Tela pública de catálogo
- Área do cliente
- Tela de resumo detalhado de todas as reservas
- Integração com API REST via Axios
  
---

## 2. Funcionalidades previstas e não implementadas
### 2.1 Busca de veículos por modelo
* Pesquisar um veículo pelo modelo. 

### 2.2 Dashboard Administrativo Simples
* Resumo com: Total de reservas ativas, Total faturado, Total de veículos alugados.
  
### 2.3 Alteração de Senha
* Cliente e administradores realizarem a atualização da senha
  
---

## 3. Outras funcionalidades implementadas
### 3.1 Regra de Cancelamento de Reserva
* O sistema permite o cancelamento da reserva mesmo após a realização do pagamento, desde que a solicitação seja feita antes da data de início da locação.

---

## 4. Principais desafios e dificuldades
### 4.1 Desenvolvimento da Interface 
* Um dos principais desafios enfrentados durante o desenvolvimento do projeto foi a construção do frontend. Como possuo pouca experiência nessa área, essa etapa se tornou mais desafiadora e exigiu um esforço maior de aprendizado e adaptação.

### 4.2 Manipulação de Datas e Cálculos
* Foi necessário tratar corretamente períodos de locação e cálculo de valores totais, o que demandou mais tempo para desenvolver e pensar na lógica de solução.

### 4.3 Integração Frontend-Backend
* A comunicação entre o React e a API exigiu atenção na padronização das rotas e no tratamento de erros.

---

## 5. Instruções para instalação e execução

### 5.1 Backend
1. No terminal acesse a pasta 'backend' 
```sh
cd backend
```

2. Instalar dependências:
```sh
npm install
```

3. Executar comando para popular o banco com as imagens
```sh
npm db:seed
```

4. Criar arquivo `.env`: <br>
Crie um arquivo `.env` na raiz do projeto e cole o coteúdo do arquivo `.env.example` disponível no codigo. Ou se preferir, cole contúdo disponível abaixo:
```sh
  PORT=3000
  DB_FILE=src/database/locadora.sqlite
  ADMIN_USER=admin
  ADMIN_PASS=admin123
```

5. Executar servidor:
```sh
npm run dev
```

### 5.2 Frontend
Abra um novo terminal em paralelo ao terminal que está rodando o servidor e siga os passos a seguir: 

1. Acessar a pasta frontend:
```sh
cd frontend
```

2. Instalar dependências:
```sh
npm install
```

3. Executar aplicação:
```sh
npm run dev
``` 
4. Abra a aplicação no navegador:
```sh
http://localhost:5173
```
---

## ⚠️ Observação

O usuário administrador já é criado automaticamente ao iniciar a aplicação.

Credenciais padrão:

- **Usuário:** admin
- **Senha:** admin123

Este usuário possui perfil de **administrador**.

--- 

## 6. Referências
* Node.js Documentation – https://nodejs.org
* Express Documentation – https://expressjs.com
* React Documentation – https://react.dev
---
