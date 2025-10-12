import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

const processor = new BulkArticleProcessor();

// Ler arquivo de teste
const bibtexContent = fs.readFileSync('./test-validation.bib', 'utf8');

console.log('=== TESTE DE VALIDAÇÃO DE LOCATION/BOOKTITLE ===\n');

// Testar parser
const entries = processor.simpleBibtexParser(bibtexContent);

console.log('TESTANDO VALIDAÇÃO RIGOROSA DE BOOKTITLE:\n');

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(`--- ENTRADA ${i + 1}: ${entry.citationKey} ---`);
  
  // Simular apenas a validação (sem conectar ao banco)
  
  // Verificar tipo
  if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
    console.log('❌ REJEITADO: Tipo não suportado (' + entry.entryType + ')');
    continue;
  }
  
  // Verificar booktitle primeiro
  if (!entry.entryTags || !entry.entryTags.booktitle || entry.entryTags.booktitle.trim() === '') {
    console.log('❌ REJEITADO: Campo booktitle ausente');
    continue;
  }
  
  // Verificar campos obrigatórios
  const requiredFields = ['title', 'author', 'year', 'pages', 'booktitle'];
  const missingFields = requiredFields.filter(field => 
    !entry.entryTags[field] || entry.entryTags[field].trim() === ''
  );
  
  if (missingFields.length > 0) {
    console.log('❌ REJEITADO: Campos ausentes:', missingFields.join(', '));
    continue;
  }
  
  // Limpar e validar booktitle
  const booktitle = processor.cleanBibtexString(entry.entryTags.booktitle);
  
  if (!booktitle || booktitle.length < 10) {
    console.log('❌ REJEITADO: Booktitle muito curto após limpeza (' + booktitle + ')');
    continue;
  }
  
  // Verificar se contém palavras de evento
  const eventKeywords = ['simpósio', 'congresso', 'conferência', 'workshop', 'encontro', 'jornada', 'escola', 'conference', 'symposium', 'meeting'];
  const hasEventKeyword = eventKeywords.some(keyword => 
    booktitle.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasEventKeyword) {
    console.log('❌ REJEITADO: Booktitle não parece ser de evento (' + booktitle + ')');
    continue;
  }
  
  console.log('✅ ACEITO: Todos os critérios atendidos');

  console.log('');
}

console.log('=== FIM DO TESTE ===');