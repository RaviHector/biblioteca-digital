# Configuração do Sistema de Email

## 📧 Status Atual

O sistema de notificações por email está **funcionando** e enviando emails reais usando Nodemailer!

### Para Desenvolvimento
- **Emails de teste**: Usa Ethereal Email (emails fictícios para testes)
- **Preview**: Gera URL de preview para visualizar o email enviado
- **Sem configuração necessária**: Funciona automaticamente

### Para Produção

Para usar emails reais em produção, configure as seguintes variáveis no `.env.production`:

```bash
# Email Configuration
EMAIL_FROM='biblioteca-digital@seudominio.com'
EMAIL_USER='seu-email@gmail.com'
EMAIL_PASS='sua-senha-de-app-do-gmail'
NODE_ENV=production
```

## 🔧 Configuração do Gmail

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Gere uma senha para "Biblioteca Digital"
   - Use esta senha no `EMAIL_PASS`

3. **Configure as variáveis**:
```bash
EMAIL_USER='seuemail@gmail.com'
EMAIL_PASS='abcd efgh ijkl mnop'  # senha gerada pelo Google
```

## 🚀 Como Funciona

### 1. Cadastro de Notificação
- Usuários clicam no ícone 🔔 no header
- Informam **nome do autor** e **seu email**
- Sistema salva no MongoDB

### 2. Criação de Artigo
- Quando um novo artigo é criado
- Sistema busca emails cadastrados para os autores
- Envia notificação automaticamente

### 3. Email Enviado
- **Assunto**: "📚 Novo artigo publicado - Autor: [Nome]"
- **Conteúdo**: HTML formatado com dados do artigo
- **Fallback**: Se falhar, continua funcionando (apenas log)

## 📋 Exemplo de Email

```
📚 BIBLIOTECA DIGITAL - Novo Artigo Publicado!

Olá!

Um novo artigo do autor Vanessa foi publicado na biblioteca digital:

📄 Título: jhasbdjhabsd
📅 Evento: Conferência Australiana
🗓️ Ano: 2015
👤 Autor: Vanessa

[Botão: Visualizar Artigo]

Acesse a biblioteca digital para visualizar o artigo completo.
```

## 🔍 Logs do Sistema

Durante o desenvolvimento, você verá logs como:
```
📧 ENVIANDO EMAIL REAL:
Para: vanessanatos.nascimento@gmail.com
Assunto: 📚 Novo artigo publicado - Autor: Vanessa
✅ EMAIL ENVIADO COM SUCESSO!
Message ID: <xxx@ethereal.email>
🔗 Preview URL: https://ethereal.email/message/xxx
```

## ⚠️ Troubleshooting

### Email não chega?
1. **Verifique o spam/lixo eletrônico**
2. **Em desenvolvimento**: Use a URL de preview gerada
3. **Em produção**: Verifique as credenciais do Gmail

### Erro de autenticação?
1. Confirme que a verificação em 2 etapas está ativa
2. Gere uma nova senha de app
3. Use a senha de app, não a senha normal da conta

## 📡 Outros Provedores de Email

### SendGrid
```javascript
const transporter = nodemailer.createTransporter({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Gmail com senha de app configurado
- [ ] Testado envio real de email
- [ ] Verificado recebimento (incluindo spam)
- [ ] Logs funcionando corretamente