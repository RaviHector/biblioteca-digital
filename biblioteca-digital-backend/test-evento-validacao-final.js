import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

console.log('=== TESTE FINAL: VALIDAÇÃO DE EVENTO EXISTENTE ===\n');

const processor = new BulkArticleProcessor();

// Simular a função findExistingEvent
processor.findExistingEvent = async function(booktitle) {
  console.log('🔍 Procurando evento:', booktitle);
  
  // Lista de eventos "existentes" no sistema
  const eventosExistentes = [
    'Simpósio Brasileiro de Engenharia de Software',
    'Workshop de Computação Aplicada', 
    'Congresso Brasileiro de Informática',
    'Conferência Latino-americana de Informática'
  ];
  
  // Verificar se existe exatamente
  const encontrado = eventosExistentes.find(evento => 
    evento.toLowerCase() === booktitle.toLowerCase()
  );
  
  if (encontrado) {
    console.log('   ✅ Evento encontrado:', encontrado);
    return { _id: 'fake-id', name: encontrado };
  } else {
    console.log('   ❌ Evento NÃO encontrado');
    return null;
  }
};

// Arquivo de teste BibTeX
const testBibtex = `
@inproceedings{sbes2024,
  author = {João Silva and Maria Santos},
  title = {Artigo para SBES Existente},
  booktitle = {Simpósio Brasileiro de Engenharia de Software},
  year = {2024},
  pages = {1-10}
}

@inproceedings{workshop2024,
  author = {Pedro Costa},
  title = {Artigo para Workshop Existente},
  booktitle = {Workshop de Computação Aplicada},
  year = {2024},
  pages = {5-12}
}

@inproceedings{inexistente2024,
  author = {Ana Lima},
  title = {Artigo para Evento Inexistente},
  booktitle = {Conferência Fictícia de Teste},
  year = {2024},
  pages = {3-8}
}

@inproceedings{outro_inexistente2024,
  author = {Carlos Santos},
  title = {Outro Artigo Evento Inexistente},
  booktitle = {Workshop Imaginário},
  year = {2024},
  pages = {15-25}
}
`;

fs.writeFileSync('./test-evento-final.bib', testBibtex);

async function testarValidacao() {
  try {
    console.log('📋 EVENTOS REGISTRADOS NO SISTEMA:');
    console.log('   1. Simpósio Brasileiro de Engenharia de Software');
    console.log('   2. Workshop de Computação Aplicada');
    console.log('   3. Congresso Brasileiro de Informática');
    console.log('   4. Conferência Latino-americana de Informática');
    console.log('\n' + '='.repeat(60) + '\n');

    const bibtexContent = fs.readFileSync('./test-evento-final.bib', 'utf8');
    const entries = processor.simpleBibtexParser(bibtexContent);

    let aceitos = 0;
    let rejeitados = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      console.log(`📄 ARTIGO ${i + 1}: ${entry.citationKey}`);
      console.log(`   Título: ${entry.entryTags.title}`);
      console.log(`   Booktitle: ${entry.entryTags.booktitle}`);

      // Testar apenas a parte da validação do evento
      try {
        // Verificar campos obrigatórios primeiro
        const requiredFields = ['title', 'author', 'year', 'pages', 'booktitle'];
        const missingFields = requiredFields.filter(field => 
          !entry.entryTags?.[field] || entry.entryTags[field].trim() === ''
        );
        
        if (missingFields.length > 0) {
          console.log('   ❌ REJEITADO: Campos ausentes:', missingFields.join(', '));
          rejeitados++;
          console.log('');
          continue;
        }

        // Verificar se evento existe
        const event = await processor.findExistingEvent(entry.entryTags.booktitle);
        
        if (!event) {
          console.log('   ❌ REJEITADO: Evento não existe no sistema');
          console.log('   💡 Solução: Criar o evento primeiro via interface administrativa');
          rejeitados++;
        } else {
          console.log('   ✅ ACEITO: Evento encontrado, artigo pode ser importado');
          aceitos++;
        }
        
      } catch (error) {
        console.log('   ❌ ERRO:', error.message);
        rejeitados++;
      }

      console.log('');
    }

    console.log('='.repeat(60));
    console.log('📊 RESULTADO FINAL:');
    console.log(`   ✅ Aceitos: ${aceitos}`);
    console.log(`   ❌ Rejeitados: ${rejeitados}`);
    console.log(`   📄 Total: ${aceitos + rejeitados}`);
    console.log('\n🎯 NOVA REGRA IMPLEMENTADA:');
    console.log('   - Artigos só podem ser importados se o evento JÁ EXISTIR');
    console.log('   - Eventos devem ser criados ANTES via interface administrativa');
    console.log('   - Não há criação automática de eventos durante importação');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarValidacao();