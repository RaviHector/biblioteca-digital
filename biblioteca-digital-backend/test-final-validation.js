import fs from 'fs';
import { BulkArticleProcessor } from './src/services/BulkArticleService.js';

const processor = new BulkArticleProcessor();

// Ler arquivo de teste
const bibtexContent = fs.readFileSync('./test-final-validation.bib', 'utf8');

console.log('=== TESTE FINAL: VALIDAÇÃO COMPLETA DOS CAMPOS OBRIGATÓRIOS ===\n');
console.log('Campos obrigatórios:');
console.log('✅ title (título do artigo)');
console.log('✅ author (autores)');
console.log('✅ year (ano)');
console.log('✅ pages (página inicial e final)');
console.log('✅ booktitle (nome do evento)');
console.log('📍 location (local da edição - opcional)');
console.log('\n' + '='.repeat(60) + '\n');

// Testar parser
const entries = processor.simpleBibtexParser(bibtexContent);

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(`--- ENTRADA ${i + 1}: ${entry.citationKey} ---`);
  
  // Mostrar campos disponíveis
  console.log('Campos encontrados:');
  ['title', 'author', 'year', 'pages', 'booktitle', 'location'].forEach(field => {
    const value = entry.entryTags?.[field];
    console.log(`  ${field}: ${value ? `"${value}"` : 'AUSENTE'}`);
  });
  
  // Simular validação completa
  
  // 1. Verificar tipo
  if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
    console.log('❌ REJEITADO: Tipo não suportado (' + entry.entryType + ')');
    console.log('');
    continue;
  }
  
  // 2. Verificar booktitle primeiro
  if (!entry.entryTags?.booktitle || entry.entryTags.booktitle.trim() === '') {
    console.log('❌ REJEITADO: Campo obrigatório ausente: booktitle');
    console.log('');
    continue;
  }
  
  // 3. Verificar outros campos obrigatórios
  const requiredFields = ['title', 'author', 'year', 'pages'];
  const missingFields = requiredFields.filter(field => 
    !entry.entryTags?.[field] || entry.entryTags[field].trim() === ''
  );
  
  if (missingFields.length > 0) {
    console.log('❌ REJEITADO: Campos obrigatórios ausentes: ' + missingFields.join(', '));
    console.log('');
    continue;
  }
  
  // 4. Validar dados após limpeza
  const title = processor.cleanBibtexString(entry.entryTags.title);
  const authors = processor.parseAuthors(entry.entryTags.author);
  const booktitle = processor.cleanBibtexString(entry.entryTags.booktitle);
  const pages = processor.parsePages(entry.entryTags.pages);
  
  if (!title || title.length < 3) {
    console.log('❌ REJEITADO: Título muito curto ou inválido');
    console.log('');
    continue;
  }
  
  if (!authors || authors.length === 0) {
    console.log('❌ REJEITADO: Lista de autores inválida');
    console.log('');
    continue;
  }
  
  if (!booktitle || booktitle.length < 10) {
    console.log('❌ REJEITADO: Booktitle muito curto');
    console.log('');
    continue;
  }
  
  // 5. Validar páginas (deve ter inicial E final)
  if (!pages.first || !pages.last || pages.first === pages.last) {
    console.log('❌ REJEITADO: Pages deve ter página inicial e final distintas');
    console.log('');
    continue;
  }
  
  const startPage = parseInt(pages.first);
  const endPage = parseInt(pages.last);
  
  if (isNaN(startPage) || isNaN(endPage) || startPage >= endPage) {
    console.log('❌ REJEITADO: Páginas inválidas (' + pages.first + '-' + pages.last + ')');
    console.log('');
    continue;
  }
  
  // 6. Verificar se é realmente um evento
  const eventKeywords = ['simpósio', 'congresso', 'conferência', 'workshop', 'encontro', 'jornada', 'escola', 'conference', 'symposium', 'meeting'];
  const hasEventKeyword = eventKeywords.some(keyword => 
    booktitle.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasEventKeyword) {
    console.log('❌ REJEITADO: Booktitle não parece ser de um evento');
    console.log('');
    continue;
  }
  
  // 7. Tudo OK!
  const location = entry.entryTags.location ? processor.cleanBibtexString(entry.entryTags.location) : null;
  
  console.log('✅ ACEITO: Todos os critérios atendidos');
  console.log('  📋 Título: ' + title);
  console.log('  👥 Autores: ' + authors.join(', '));
  console.log('  🎯 Evento: ' + booktitle);
  console.log('  📄 Páginas: ' + pages.first + '-' + pages.last);
  console.log('  📍 Local: ' + (location || 'Não informado'));
  console.log('');
}

console.log('=== RESUMO DAS REGRAS ===');
console.log('✅ Aceita apenas @inproceedings e @conference');
console.log('✅ Campos obrigatórios: title, author, year, pages, booktitle');
console.log('✅ Pages deve ter página inicial e final (ex: 1-10)');
console.log('✅ Booktitle deve parecer nome de evento');
console.log('📍 Location é opcional, usado como local da edição quando presente');
console.log('=== FIM DO TESTE ===');