import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

const processor = new BulkArticleProcessor();

// Ler arquivo de teste
const bibtexContent = fs.readFileSync('./test-location-validation.bib', 'utf8');

console.log('=== TESTE DE VALIDAÇÃO: LOCATION vs BOOKTITLE ===\n');
console.log('Testando se rejeita entradas com apenas location (cidade) sem booktitle (nome do evento)\n');

// Testar parser
const entries = processor.simpleBibtexParser(bibtexContent);

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(`--- ENTRADA ${i + 1}: ${entry.citationKey} ---`);
  console.log('Campos encontrados:');
  Object.keys(entry.entryTags || {}).forEach(key => {
    console.log(`  ${key}: ${entry.entryTags[key]}`);
  });
  
  // Simular validação
  
  // Verificar tipo
  if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
    console.log('❌ REJEITADO: Tipo não suportado (' + entry.entryType + ')');
    console.log('');
    continue;
  }
  
  // Verificar booktitle (simulando a nova validação)
  if (!entry.entryTags || !entry.entryTags.booktitle || entry.entryTags.booktitle.trim() === '') {
    // Verificar se tem apenas location
    const hasOnlyLocation = entry.entryTags && entry.entryTags.location && entry.entryTags.location.trim() !== '';
    
    if (hasOnlyLocation) {
      console.log('❌ REJEITADO: Tem apenas location (' + entry.entryTags.location + ') mas falta booktitle (nome do evento)');
      console.log('');
      continue;
    }
    
    console.log('❌ REJEITADO: Campo booktitle ausente');
    console.log('');
    continue;
  }
  
  // Verificar outros campos obrigatórios
  const requiredFields = ['title', 'author', 'year', 'pages'];
  const missingFields = requiredFields.filter(field => 
    !entry.entryTags[field] || entry.entryTags[field].trim() === ''
  );
  
  if (missingFields.length > 0) {
    console.log('❌ REJEITADO: Campos ausentes:', missingFields.join(', '));
    console.log('');
    continue;
  }
  
  // Validar booktitle após limpeza
  const booktitle = processor.cleanBibtexString(entry.entryTags.booktitle);
  
  if (!booktitle || booktitle.length < 10) {
    console.log('❌ REJEITADO: Booktitle muito curto após limpeza (' + booktitle + ')');
    console.log('');
    continue;
  }
  
  console.log('✅ ACEITO: Tem booktitle válido (' + booktitle + ')');
  if (entry.entryTags.location) {
    console.log('  + Também tem location: ' + entry.entryTags.location);
  }
  console.log('');
}

console.log('=== FIM DO TESTE ===');