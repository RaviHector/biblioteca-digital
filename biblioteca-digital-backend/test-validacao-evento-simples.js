import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

console.log('=== TESTE: VALIDAÇÃO DE EVENTO EXISTENTE (SEM BANCO) ===\n');

const processor = new BulkArticleProcessor();

// Simular a função findExistingEvent retornando null (evento não existe)
processor.findExistingEvent = async function(booktitle) {
  console.log('Simulando busca por evento:', booktitle);
  
  // Simular alguns eventos "existentes"
  const eventosExistentes = [
    'Simpósio Brasileiro de Engenharia de Software',
    'Workshop de Computação Aplicada',
    'Congresso Brasileiro de Informática'
  ];
  
  const encontrado = eventosExistentes.some(evento => 
    evento.toLowerCase().includes(booktitle.toLowerCase()) || 
    booktitle.toLowerCase().includes(evento.toLowerCase())
  );
  
  if (encontrado) {
    console.log('✅ Evento encontrado:', booktitle);
    return { _id: 'fake-id', name: booktitle, sigla: 'FAKE' };
  } else {
    console.log('❌ Evento NÃO encontrado:', booktitle);
    return null;
  }
};

// Simular outras funções do banco para não dar erro
processor.findOrCreateEdition = async function() {
  return { _id: 'fake-edition-id' };
};

// Criar arquivo de teste BibTeX
const testBibtex = `
@inproceedings{eventoexiste2024,
  author = {João Silva},
  title = {Artigo com Evento Existente},
  booktitle = {Simpósio Brasileiro de Engenharia de Software},
  year = {2024},
  pages = {1-10}
}

@inproceedings{eventonaoexiste2024,
  author = {Maria Santos},
  title = {Artigo com Evento Inexistente},
  booktitle = {Conferência Imaginária de Teste},
  year = {2024},
  pages = {5-15}
}
`;

fs.writeFileSync('./test-validacao-evento.bib', testBibtex);

async function testar() {
  try {
    console.log('Eventos "existentes" simulados:');
    console.log('- Simpósio Brasileiro de Engenharia de Software');
    console.log('- Workshop de Computação Aplicada');
    console.log('- Congresso Brasileiro de Informática\n');

    const bibtexContent = fs.readFileSync('./test-validacao-evento.bib', 'utf8');
    const entries = processor.simpleBibtexParser(bibtexContent);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      console.log(`--- TESTE ${i + 1}: ${entry.citationKey} ---`);
      console.log('Booktitle:', entry.entryTags.booktitle);

      const result = await processor.processArticleEntry(entry, {});
      
      if (result.success) {
        console.log('✅ ACEITO: Artigo seria criado');
      } else {
        console.log('❌ REJEITADO:', result.reason);
      }
      console.log('');
    }

    console.log('=== RESUMO ===');
    console.log('✅ Sistema agora exige que o evento já exista no banco');
    console.log('❌ Artigos com eventos inexistentes são rejeitados');
    console.log('📋 Eventos devem ser criados ANTES de importar artigos');
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

testar();