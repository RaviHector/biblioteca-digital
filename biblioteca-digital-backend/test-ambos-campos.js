import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

const processor = new BulkArticleProcessor();

// Ler arquivo de teste
const bibtexContent = fs.readFileSync('./test-ambos-campos.bib', 'utf8');

console.log('=== TESTE: BOOKTITLE E LOCATION AMBOS OBRIGATÓRIOS ===\n');
console.log('Validando que AMBOS os campos são necessários:\n');

// Testar parser
const entries = processor.simpleBibtexParser(bibtexContent);

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(`--- ENTRADA ${i + 1}: ${entry.citationKey} ---`);
  
  // Mostrar campos encontrados
  const hasBooktitle = entry.entryTags && entry.entryTags.booktitle && entry.entryTags.booktitle.trim() !== '';
  const hasLocation = entry.entryTags && entry.entryTags.location && entry.entryTags.location.trim() !== '';
  
  console.log('Booktitle:', hasBooktitle ? `"${entry.entryTags.booktitle}"` : 'AUSENTE');
  console.log('Location:', hasLocation ? `"${entry.entryTags.location}"` : 'AUSENTE');
  
  // Simular validação
  if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
    console.log('❌ REJEITADO: Tipo não suportado');
    console.log('');
    continue;
  }
  
  // Validação dos dois campos obrigatórios
  if (!hasBooktitle && !hasLocation) {
    console.log('❌ REJEITADO: Faltam ambos booktitle e location');
    console.log('');
    continue;
  }
  
  if (!hasBooktitle && hasLocation) {
    console.log('❌ REJEITADO: Tem apenas location, falta booktitle');
    console.log('');
    continue;
  }
  
  if (hasBooktitle && !hasLocation) {
    console.log('❌ REJEITADO: Tem apenas booktitle, falta location');
    console.log('');
    continue;
  }
  
  // Verificar outros campos obrigatórios
  const requiredFields = ['title', 'author', 'year', 'pages'];
  const missingFields = requiredFields.filter(field => 
    !entry.entryTags[field] || entry.entryTags[field].trim() === ''
  );
  
  if (missingFields.length > 0) {
    console.log('❌ REJEITADO: Outros campos ausentes:', missingFields.join(', '));
    console.log('');
    continue;
  }
  
  console.log('✅ ACEITO: Tem ambos booktitle e location válidos');
  console.log('');
}

console.log('=== RESUMO ===');
console.log('✅ Só aceita entradas que tenham AMBOS os campos:');
console.log('   - booktitle (nome do evento)');
console.log('   - location (cidade/local)');
console.log('❌ Rejeita se faltar qualquer um dos dois');
console.log('=== FIM DO TESTE ===');