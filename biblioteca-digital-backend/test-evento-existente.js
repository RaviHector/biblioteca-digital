import { BulkArticleProcessor } from './src/services/BulkArticleService.js';
import EventsModel from './src/models/EventsModel.js';
import { connectMongo } from './src/config/mongo.js';

async function testarValidacaoEventoExistente() {
  console.log('=== TESTE: VALIDAÇÃO DE EVENTO EXISTENTE ===\n');
  
  try {
    // Conectar ao banco
    await connectMongo();
    console.log('✅ Conectado ao banco de dados\n');

    const processor = new BulkArticleProcessor();

    // 1. Verificar eventos existentes
    console.log('--- EVENTOS EXISTENTES NO BANCO ---');
    const existingEvents = await EventsModel.find({}, 'name sigla').limit(5);
    
    if (existingEvents.length > 0) {
      existingEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name} (${event.sigla})`);
      });
    } else {
      console.log('Nenhum evento encontrado no banco');
      
      // Criar um evento de teste
      const testEvent = await EventsModel.create({
        name: 'Simpósio Brasileiro de Engenharia de Software',
        sigla: 'SBES',
        entity: 'Teste'
      });
      console.log('✅ Evento de teste criado:', testEvent.name);
    }

    console.log('\n--- TESTANDO VALIDAÇÃO ---\n');

    // 2. Teste com evento existente
    console.log('TESTE 1: Booktitle de evento existente');
    const eventoExistente = await processor.findExistingEvent('Simpósio Brasileiro de Engenharia de Software');
    
    if (eventoExistente) {
      console.log('✅ Evento encontrado:', eventoExistente.name);
    } else {
      console.log('❌ Evento não encontrado');
    }

    // 3. Teste com evento inexistente
    console.log('\nTESTE 2: Booktitle de evento inexistente');
    const eventoInexistente = await processor.findExistingEvent('Conferência Inexistente de Teste');
    
    if (eventoInexistente) {
      console.log('✅ Evento encontrado:', eventoInexistente.name);
    } else {
      console.log('❌ Evento não encontrado (esperado)');
    }

    // 4. Simular processamento com entrada válida mas evento inexistente
    console.log('\n--- SIMULAÇÃO DE PROCESSAMENTO ---');
    
    const entryComEventoInexistente = {
      entryType: 'inproceedings',
      citationKey: 'teste2024',
      entryTags: {
        title: 'Artigo de Teste',
        author: 'João Silva',
        year: '2024',
        pages: '1-10',
        booktitle: 'Evento Que Não Existe'
      }
    };

    console.log('Processando entrada com evento inexistente...');
    const resultado = await processor.processArticleEntry(entryComEventoInexistente, {});
    
    console.log('Resultado:', resultado.success ? 'ACEITO' : 'REJEITADO');
    console.log('Razão:', resultado.reason);

  } catch (error) {
    console.error('Erro no teste:', error.message);
  } finally {
    process.exit(0);
  }
}

testarValidacaoEventoExistente();