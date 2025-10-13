# Backlog da Sprint - Biblioteca Digital

## Informações da Sprint

- **Duração:** 2 semanas
- **Equipe:** Ana Paula, Ravi, Vanessa
- **Total de Pontos:** 20 pontos

## Histórias de Usuário

### 1. Como administrador, eu quero cadastrar (editar, deletar) um evento (1 ponto)

**Critérios de Aceitação:**

- [ ] Criar formulário de cadastro de evento
- [ ] Implementar validação de campos obrigatórios (nome, sigla, entidade)
- [ ] Adicionar funcionalidades de edição e exclusão
- [ ] Garantir que sigla seja única

**Responsável:** Ana Paula  
**Status:** Concluído

---

### 2. Como administrador, eu quero cadastrar (editar, deletar) uma nova edição de um evento (2 pontos)

**Critérios de Aceitação:**

- [ ] Criar formulário de cadastro de edição
- [ ] Vincular edição a um evento existente
- [ ] Implementar campos: ano, local, evento
- [ ] Garantir que não existam edições duplicadas (mesmo evento + mesmo ano)
- [ ] Funcionalidades de edição e exclusão

**Responsável:** Ana Paula  
**Status:** Concluído

---

### 3. Como administrador, eu quero cadastrar (editar, deletar) um artigo manualmente, incluindo seu pdf (3 pontos)

**Critérios de Aceitação:**

- [ ] Criar formulário de cadastro de artigo
- [ ] Implementar upload de arquivo PDF
- [ ] Campos: título, autores, edição, ano, páginas (inicial e final)
- [ ] Validação de arquivos PDF
- [ ] Funcionalidades de edição e exclusão

**Responsável:** Vanessa  
**Status:** Concluído

---

### 4. Como administrador, eu quero cadastrar artigos em massa, a partir de um arquivo bibtex, com dados de vários artigos (4 pontos)

**Critérios de Aceitação:**

- [ ] Implementar parser de arquivos BibTeX
- [ ] Processar upload de arquivo ZIP com PDFs
- [ ] Associar PDFs aos artigos baseado no nome do arquivo
- [ ] Criar artigos em lote no banco de dados
- [ ] Exibir relatório de processamento (sucessos/falhas)
- [ ] Enviar notificações por email para autores

**Responsável:** Vanessa  
**Status:** Concluído

---

### 5. Como usuário, eu quero pesquisar por artigos: por título, por autor e por nome de evento (2 pontos)

**Critérios de Aceitação:**

- [ ] Implementar barra de pesquisa na página inicial
- [ ] Busca por título usando regex
- [ ] Busca por autor
- [ ] Busca por nome de evento
- [ ] Exibir resultados em cards organizados
- [ ] Implementar paginação dos resultados

**Responsável:** Ravi  
**Status:** Concluído

---

### 6. Como administrador, eu quero que todo evento tenha uma home page, com suas edições; cada edição, por sua vez, também deve ter uma home page, com seus artigos (3 pontos)

**Critérios de Aceitação:**

- [ ] Criar página de detalhes do evento (/event/:id)
- [ ] Listar todas as edições do evento
- [ ] Criar página de detalhes da edição (/edition/:id)
- [ ] Listar todos os artigos da edição
- [ ] Implementar navegação entre páginas
- [ ] Design responsivo

**Responsável:** Ana Paula e Ravi  
**Status:** Concluído

---

### 7. Como usuário, eu quero ter uma home page com meus artigos, organizados por ano (2 pontos)

**Critérios de Aceitação:**

- [ ] Criar página de perfil do usuário
- [ ] Filtrar artigos por autor logado
- [ ] Organizar artigos por ano de publicação
- [ ] Implementar filtros por ano
- [ ] Barra de pesquisa dentro dos artigos do usuário

**Responsável:** Ana Paula e Ravi  
**Status:** Concluído

---

### 8. Como usuário, eu quero me cadastrar para receber um mail sempre que eu tiver um novo artigo disponibilizado (3 pontos)

**Critérios de Aceitação:**

- [ ] Criar sistema de notificações por email
- [ ] Formulário de cadastro para notificações (nome + email)
- [ ] Integração com serviço de email (Gmail)
- [ ] Disparar emails automaticamente quando artigo for criado
- [ ] Buscar autores cadastrados para notificação
- [ ] Opção de desativar notificações

**Responsável:** Vanessa  
**Status:** Concluído

---

## Tarefas Técnicas

### Infraestrutura e Configuração

- **Setup inicial do projeto (backend + frontend)** - Ravi
- **Configuração do banco de dados MongoDB** - Ravi
- **Setup do sistema de autenticação JWT** - Ravi
- **Configuração do multer para upload de arquivos** - Vanessa

### Design e Layout

- **Criação do sistema de design e tema** - Ana Paula
- **Implementação dos componentes visuais** - Ana Paula
- **Layout responsivo** - Ana Paula
- **Header e Footer** - Ana Paula e Ravi

### Sistema de Email

- **Configuração do nodemailer** - Vanessa
- **Templates de email** - Vanessa
- **Sistema de gerenciamento de usuários** - Vanessa

## Retrospectiva da Sprint

### O que funcionou bem

- Divisão clara de responsabilidades entre os membros
- Comunicação efetiva da equipe
- Uso de controle de versão (Git) para gerenciar mudanças
- Implementação completa de todas as histórias planejadas

### Desafios enfrentados

- Integração entre frontend e backend em alguns pontos
- Configuração inicial do sistema de email
- Upload e processamento de arquivos em massa

### Melhorias para próxima sprint

- Implementar testes automatizados
- Melhorar tratamento de erros
- Otimizar performance das consultas ao banco
- Adicionar mais validações de entrada

## Velocity da Sprint

- **Pontos Planejados:** 20
- **Pontos Entregues:** 20
- **Velocity:** 100%
