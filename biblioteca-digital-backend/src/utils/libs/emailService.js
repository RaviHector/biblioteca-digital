import nodemailer from 'nodemailer';

export async function sendArticleNotificationEmail({ 
  email, 
  authorName, 
  articleTitle, 
  eventName, 
  editionYear 
}) {
  console.log("� TENTATIVA DE ENVIO DE EMAIL REAL INICIADA!");
  
  try {
    let transporter;
    
    // Verificar se temos credenciais do Gmail configuradas
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log("📧 Configurando Gmail para envio real...");
      console.log("📧 Email configurado:", process.env.EMAIL_USER);
      
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      console.log("✅ Gmail configurado com sucesso!");
    } else {
      // Fallback para Ethereal se não tiver credenciais Gmail
      console.log("📧 Credenciais Gmail não encontradas, usando Ethereal...");
      const testAccount = await nodemailer.createTestAccount();
      console.log("✅ Conta Ethereal criada:", testAccount.user);
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log("✅ Ethereal configurado como fallback!");
    }
    
    const emailOptions = {
      from: process.env.EMAIL_FROM || 'biblioteca-digital@exemplo.com',
      to: email,
      subject: `📚 Novo artigo publicado - Autor: ${authorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📚 Biblioteca Digital</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Novo artigo publicado!</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; margin: 0 0 20px 0;">Olá!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              Um novo artigo do autor <strong>${authorName}</strong> foi publicado na biblioteca digital:
            </p>
            
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">📄 ${articleTitle}</h3>
              <div style="display: grid; gap: 8px;">
                <p style="margin: 0; color: #4b5563;"><strong>📅 Evento:</strong> ${eventName}</p>
                <p style="margin: 0; color: #4b5563;"><strong>🗓️ Ano:</strong> ${editionYear}</p>
                <p style="margin: 0; color: #4b5563;"><strong>👤 Autor:</strong> ${authorName}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                🔍 Visualizar Artigo
              </a>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Acesse a biblioteca digital para ler o artigo completo e explorar outros conteúdos acadêmicos.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 0; text-align: center;">
              Você está recebendo esta notificação porque se cadastrou para receber alertas sobre artigos do autor <strong>${authorName}</strong>.
              <br>Para se desinscrever, acesse a biblioteca digital e gerencie suas notificações.
            </p>
          </div>
        </div>
      `,
      text: `
        📚 BIBLIOTECA DIGITAL - Novo Artigo Publicado!
        
        Olá!
        
        Um novo artigo do autor ${authorName} foi publicado na biblioteca digital:
        
        📄 Título: ${articleTitle}
        📅 Evento: ${eventName}
        🗓️ Ano: ${editionYear}
        👤 Autor: ${authorName}
        
        Acesse a biblioteca digital para visualizar o artigo completo.
        
        ---
        Você está recebendo esta notificação porque se cadastrou para receber alertas sobre artigos do autor ${authorName}.
      `
    };

    const isGmail = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    console.log(`📧 ENVIANDO EMAIL ${isGmail ? 'REAL VIA GMAIL' : 'DE TESTE VIA ETHEREAL'}:`);
    console.log("📬 Para:", email);
    console.log("📝 Assunto:", emailOptions.subject);
    console.log("🔧 Método:", isGmail ? 'Gmail Real' : 'Ethereal Test');
    
    const info = await transporter.sendMail(emailOptions);
    
    console.log("🎉 EMAIL ENVIADO COM SUCESSO!");
    console.log("📧 Message ID:", info.messageId);
    
    if (isGmail) {
      console.log("✅ EMAIL REAL ENVIADO PARA GMAIL!");
      console.log("� Verifique a caixa de entrada de:", email);
    } else {
      console.log("�🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
      console.log("👆 CLIQUE NO LINK ACIMA PARA VER O EMAIL DE TESTE!");
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error("❌ ERRO AO ENVIAR EMAIL REAL:", error.message);
    console.error("🔍 Detalhes do erro:", error);
    
    // Em caso de erro, fazer fallback para log
    console.log("\n📧 ===== FALLBACK - NOTIFICAÇÃO POR LOG =====");
    console.log("📬 Para:", email);
    console.log("📝 Assunto: Novo artigo publicado - Autor:", authorName);
    console.log("📄 Artigo:", articleTitle);
    console.log("🎪 Evento:", eventName, `(${editionYear})`);
    console.log("⚠️  O EMAIL REAL FALHARAM - USANDO APENAS LOG");
    console.log("=============================================\n");
    
    return { 
      success: false, 
      error: error.message,
      fallbackExecuted: true 
    };
  }
}