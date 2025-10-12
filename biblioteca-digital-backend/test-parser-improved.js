import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

const processor = new BulkArticleProcessor();

// Ler arquivo de teste
const bibtexContent = fs.readFileSync('./test-improved.bib', 'utf8');

console.log('=== TESTE DO PARSER BIBTEX MELHORADO ===\n');
console.log('Conteúdo do arquivo BibTeX:');
console.log(bibtexContent);
console.log('\n' + '='.repeat(50) + '\n');

// Testar parser
console.log('FASE 1: Parsing do arquivo BibTeX');
const entries = processor.simpleBibtexParser(bibtexContent);

console.log('\n' + '='.repeat(50) + '\n');

// Testar processamento de cada entrada
console.log('FASE 2: Validação das entradas');

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(`\n--- ENTRADA ${i + 1}: ${entry.citationKey} ---`);
  
  // Simular processamento (sem salvar no banco)
  console.log('Tipo:', entry.entryType);
  
  // Verificar se seria aceito ou rejeitado
  if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
    console.log('❌ REJEITADO: Tipo não suportado');
    continue;
  }
  
  const requiredFields = ['title', 'author', 'year', 'pages', 'booktitle'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!entry.entryTags || !entry.entryTags[field] || entry.entryTags[field].trim() === '') {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    console.log('❌ REJEITADO: Campos ausentes:', missingFields.join(', '));
    continue;
  }
  
  // Processar dados
  const title = processor.cleanBibtexString(entry.entryTags.title);
  const booktitle = processor.cleanBibtexString(entry.entryTags.booktitle);
  const authors = processor.parseAuthors(entry.entryTags.author);
  const pages = processor.parsePages(entry.entryTags.pages);
  
  // Validação adicional
  if (!title || title.length < 3) {
    console.log('❌ REJEITADO: Título inválido');
    continue;
  }
  
  if (!booktitle || booktitle.length < 5) {
    console.log('❌ REJEITADO: Booktitle inválido');
    continue;
  }
  
  if (!authors || authors.length === 0) {
    console.log('❌ REJEITADO: Autores inválidos');
    continue;
  }
  
  // Gerar sigla
  const sigla = processor.generateSigla(booktitle);
  
  console.log('✅ ACEITO');
  console.log('  Título:', title);
  console.log('  Autores:', authors);
  console.log('  Local (booktitle):', booktitle);
  console.log('  Sigla gerada:', sigla);
  console.log('  Páginas:', pages);
}

console.log('\n' + '='.repeat(50));
console.log('TESTE CONCLUÍDO');