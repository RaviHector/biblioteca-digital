# Diagramas UML - Biblioteca Digital

## 1. Diagrama de Classes

```mermaid
classDiagram
    class User {
        +String _id
        +String name
        +String email
        +String userName
        +String password
        +Boolean isAdmin
        +Date createdAt
        +Date updatedAt
        +create()
        +update()
        +delete()
        +authenticate()
    }

    class UserSessionToken {
        +String _id
        +ObjectId user
        +String token
        +Date expiresAt
        +create()
        +delete()
        +validate()
        +isExpired()
    }

    class Event {
        +String _id
        +String name
        +String sigla
        +String entity
        +create()
        +update()
        +delete()
        +getEditions()
    }

    class Edition {
        +String _id
        +String year
        +String place
        +ObjectId event
        +create()
        +update()
        +delete()
        +getArticles()
    }

    class Article {
        +String _id
        +String title
        +Array author
        +ObjectId edition
        +String year
        +String first_page
        +String last_page
        +String pdf_file
        +create()
        +update()
        +delete()
        +search()
        +downloadPdf()
    }

    class EmailNotification {
        +String _id
        +String name
        +String email
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        +create()
        +update()
        +delete()
        +sendNotification()
    }

    class UserService {
        +get(filters)
        +getById(id)
        +create(data)
        +update(id, data)
        +destroy(id)
        +hashPassword(password)
    }

    class ArticleService {
        +get(filters)
        +getById(id)
        +create(data)
        +update(id, data)
        +destroy(id)
        +searchByName(name)
        +searchArticle(name)
        +sendNotifications(article)
    }

    class EventsService {
        +get(filters)
        +getById(id)
        +create(data)
        +update(id, data)
        +destroy(id)
        +cascadeDelete(id)
    }

    class EditionsService {
        +get(filters)
        +getById(id)
        +create(data)
        +update(id, data)
        +destroy(id)
        +searchByName(name)
    }

    class BulkArticleService {
        +processBulkUpload(bibtexFile, zipFile)
        +parseBibtex(content)
        +extractZipFiles(zipFile)
        +matchPdfsWithArticles()
        +createArticles(articles)
        +generateReport()
    }

    class EmailService {
        +sendArticleNotification(email, article)
        +configureTransporter()
        +sendMail(options)
    }

    %% Relacionamentos entre Models (usando Composição)
    User "1" *-- "0..*" UserSessionToken : possui
    Event "1" *-- "0..*" Edition : contem
    Edition "1" *-- "0..*" Article : possui

    %% Services manipulam Models
    UserService ..> User : manipula
    UserService ..> UserSessionToken : gerencia
    ArticleService ..> Article : manipula
    ArticleService ..> EmailNotification : consulta
    EventsService ..> Event : manipula
    EditionsService ..> Edition : manipula
    BulkArticleService ..> Article : cria_em_massa
    BulkArticleService ..> ArticleService : utiliza

    %% Notificações relacionadas aos artigos
    Article ..> EmailNotification : dispara_notificacao
    ArticleService ..> EmailService : utiliza
    EmailService ..> EmailNotification : consulta
```

## 2. Diagrama de Sequência - Upload em Massa de Artigos

```mermaid
sequenceDiagram
    participant U as User (Admin)
    participant F as Frontend
    participant M as Middleware
    participant C as BulkArticleController
    participant BS as BulkArticleService
    participant AS as ArticleService
    participant ES as EmailService
    participant EN as EmailNotification
    participant DB as Database

    U->>F: Seleciona arquivos BibTeX + ZIP
    U->>F: Clica em "Upload em Massa"
    F->>M: POST /bulk-articles (multipart/form-data)

    activate M
    M->>M: Verificar autenticação JWT
    M->>M: Verificar permissões de admin
    M->>M: Processar upload com multer
    M->>C: Request com arquivos processados
    deactivate M

    activate C
    C->>C: Validar arquivos (BibTeX + ZIP)

    alt Validação falha
        C-->>F: BadRequest Error
        F-->>U: Exibe erro de validação
    else Validação sucesso
        C->>BS: processBulkUpload(bibtexFile, zipFile)

        activate BS
        BS->>BS: Ler conteúdo do arquivo BibTeX
        BS->>BS: parseBibtex(bibtexContent)
        BS->>BS: Extrair arquivos do ZIP
        BS->>BS: matchPdfsWithArticles()

        loop Para cada artigo válido no BibTeX
            BS->>AS: create(articleData)

            activate AS
            AS->>DB: Salvar artigo no MongoDB
            DB-->>AS: Artigo criado com _id

            AS->>AS: Popular dados do artigo (edition.event)
            AS->>EN: Buscar notificações ativas por autor

            activate EN
            EN->>DB: find({ name: author, isActive: true })
            DB-->>EN: Lista de emails cadastrados
            deactivate EN

            loop Para cada email encontrado
                AS->>ES: sendArticleNotificationEmail(email, article)

                activate ES
                ES->>ES: Configurar template de email
                ES->>ES: Enviar email via SMTP
                ES-->>AS: Email enviado
                deactivate ES
            end

            AS-->>BS: Artigo processado com sucesso
            deactivate AS
        end

        BS->>BS: Gerar relatório de processamento
        BS-->>C: { sucessos, falhas, detalhes }
        deactivate BS

        C-->>F: Resposta com estatísticas
        deactivate C
        F-->>U: Exibe resultado do upload
    end
```

## 3. Diagrama de Pacotes - Arquitetura do Sistema

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background': '#ffffff', 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff'}}}%%
flowchart TD
    subgraph "Frontend"
        FP[Pages]
        FC[Components]
        FH[Hooks/Query]
        FS[Services/API]
        FST[Stores]
        FR[Routes]

        FP --> FC
        FP --> FH
        FH --> FS
        FP --> FST
        FR --> FP
    end

    subgraph "Backend"
        subgraph "PresentationLayer"
            R[Routes]
            MW[Middleware]
        end

        subgraph "BusinessLayer"
            CT[Controllers]
            SV[Services]
            VAL[Validators]
        end

        subgraph "DataLayer"
            M[Models]
            DB[(MongoDB)]
        end

        subgraph "Infrastructure"
            CFG[Config]
            UT[Utils]
            ERR[Error Handlers]
        end
    end

    subgraph "ExternalServices"
        EMAIL[Email Service]
        FS_STORAGE[File System]
    end

    %% Frontend to Backend
    FS --> R

    %% Backend Flow
    R --> MW
    MW --> CT
    CT --> VAL
    CT --> SV
    SV --> M
    M --> DB

    %% Infrastructure connections
    CT --> ERR
    SV --> UT
    MW --> CFG

    %% External connections
    SV --> EMAIL
    SV --> FS_STORAGE

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0

    class FP,FC,FH,FS,FST,FR frontend
    class R,MW,CT,SV,VAL,M,CFG,UT,ERR backend
    class DB database
    class EMAIL,FS_STORAGE external
```

Cada diagrama representa uma perspectiva diferente do sistema:

- **Diagrama de Classes**: Estrutura e relacionamentos das entidades
- **Diagrama de Sequência**: Fluxo da funcionalidade de Upload em Massa de Artigos
- **Diagrama de Pacotes**: Arquitetura geral do sistema
