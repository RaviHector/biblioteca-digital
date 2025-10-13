# 📧 CONFIGURAÇÃO GMAIL PARA ENVIO REAL

## 🚀 Passos para Configurar Gmail:

### 1. **Ativar verificação em 2 etapas no Gmail**
1. Acesse: https://myaccount.google.com/security
2. Em "Como você faz login no Google", clique em "Verificação em duas etapas"
3. Siga os passos para ativar

### 2. **Gerar senha de app**
1. Acesse: https://myaccount.google.com/apppasswords
2. Clique em "Gerar senha de app"
3. Escolha "Outro (nome personalizado)"
4. Digite: "Biblioteca Digital"
5. **COPIE A SENHA GERADA** (16 caracteres, ex: `abcd efgh ijkl mnop`)

### 3. **Configurar variáveis no arquivo .env.development**

Substitua estas linhas no arquivo `.env.development`:

```bash
# Email Configuration 
EMAIL_FROM='biblioteca-digital@exemplo.com'
EMAIL_USER='SEU-EMAIL@gmail.com'        # ← Coloque seu Gmail aqui
EMAIL_PASS='abcd efgh ijkl mnop'         # ← Coloque a senha de app aqui
```

### 4. **Exemplo de configuração:**

```bash
# Email Configuration 
EMAIL_FROM='biblioteca-digital@exemplo.com'
EMAIL_USER='vanessantos.nascimento@gmail.com'
EMAIL_PASS='xpto abcd efgh ijkl'
```

## ⚠️ **IMPORTANTE:**
- Use a **senha de app**, NÃO a senha normal do Gmail
- A senha tem 16 caracteres com espaços
- Mantenha as aspas nas variáveis

## ✅ **Depois de configurar:**
1. Reinicie o servidor backend
2. Cadastre uma notificação 
3. Crie um artigo
4. O email chegará na conta real do Gmail!

## 🔍 **Como saber se funcionou:**
Nos logs você verá:
```
📧 Configurando Gmail para envio real...
📧 Email configurado: seu-email@gmail.com
✅ Gmail configurado com sucesso!
📧 ENVIANDO EMAIL REAL VIA GMAIL:
🎉 EMAIL ENVIADO COM SUCESSO!
✅ EMAIL REAL ENVIADO PARA GMAIL!
```

## 🆘 **Problemas comuns:**
- **"Invalid login"**: Verifique se a verificação em 2 etapas está ativa
- **"Username and Password not accepted"**: Use senha de app, não a senha normal
- **"Application-specific password required"**: Gere uma nova senha de app