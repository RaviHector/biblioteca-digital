const fs = require('fs');
const path = require('path');

// Simulando as funções do BulkArticleService
class TestParser {
  // Parser BibTeX simples como fallback
  simpleBibtexParser(bibtexContent) {
    console.log('Using simple BibTeX parser');
    const entries = [];
    
    // Regex mais flexível para capturar entradas BibTeX
    const entryRegex = /@(\w+)\s*\{\s*([^,\s]+)\s*,\s*([\s\S]*?)\n\s*\}/g;
    
    let match;
    while ((match = entryRegex.exec(bibtexContent)) !== null) {
      const [, entryType, citationKey, fieldsContent] = match;
      
      console.log('Found entry:', { entryType, citationKey });
      
      const entry = {
        entryType: entryType.toLowerCase(),
        citationKey: citationKey.trim(),
        entryTags: {}
      };

      // Parse campos - melhorado para lidar com diferentes formatos
      const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
        const [, fieldName, fieldValue] = fieldMatch;
        const cleanFieldName = fieldName.trim().toLowerCase();
        const cleanFieldValue = fieldValue.trim();
        
        entry.entryTags[cleanFieldName] = cleanFieldValue;
        console.log(`  ${cleanFieldName}: ${cleanFieldValue}`);
      }

      entries.push(entry);
    }

    console.log(`Parsed ${entries.length} entries`);
    return entries;
  }

  cleanBibtexString(str) {
    if (!str) return '';
    
    return str
      .replace(/^\s*["'`]\s*/, '') // Remove aspas do início
      .replace(/\s*["'`]\s*$/, '') // Remove aspas do final
      .replace(/\\[a-zA-Z]+/g, ' ') // Remove comandos LaTeX como \textbf, \emph
      .replace(/[{}]/g, '') // Remove chaves
      .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
      .trim();
  }

  parsePages(pagesString) {
    if (!pagesString) return { first: '1', last: '1' };
    
    console.log('Parsing pages:', pagesString);
    
    // Tratar diferentes formatos de páginas: 1-11, 1--11, 1–11, 1—11
    const pages = pagesString.split(/--+|[-–—]/);
    
    if (pages.length >= 2) {
      const result = {
        first: pages[0].trim(),
        last: pages[1].trim()
      };
      console.log('Parsed pages result:', result);
      return result;
    }
    
    // Se não conseguir separar, assumir página única
    const page = pages[0].trim();
    return { first: page, last: page };
  }

  generateSigla(booktitle) {
    if (!booktitle) return '';
    
    console.log('Generating sigla from:', booktitle);
    
    // Palavras importantes em português que devem ser priorizadas
    const importantWords = [
      'simpósio', 'simposio', 'congresso', 'conferência', 'conferencia',
      'brasileiro', 'brasileira', 'nacional', 'internacional',
      'engenharia', 'software', 'computação', 'computacao',
      'ciência', 'ciencia', 'tecnologia', 'informática', 'informatica',
      'workshop', 'seminário', 'seminario'
    ];
    
    // Palavras comuns que devem ser ignoradas
    const commonWords = [
      'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'nas', 'nos',
      'para', 'por', 'com', 'sobre', 'the', 'of', 'and', 'in', 'on', 'at',
      'to', 'for', 'with', 'by', 'from', 'a', 'an', 'is', 'are', 'was', 'were'
    ];
    
    // Limpar e dividir em palavras
    const words = booktitle
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
      .filter(word => !commonWords.includes(word));
    
    console.log('Filtered words:', words);
    
    // Separar palavras importantes das outras
    const important = words.filter(word => importantWords.includes(word));
    const regular = words.filter(word => !importantWords.includes(word));
    
    console.log('Important words:', important);
    console.log('Regular words:', regular);
    
    // Construir sigla priorizando palavras importantes
    let sigla = '';
    
    // Adicionar letras das palavras importantes primeiro
    for (const word of important) {
      sigla += word.charAt(0).toUpperCase();
    }
    
    // Adicionar letras das palavras regulares até completar uma sigla razoável
    for (const word of regular) {
      if (sigla.length < 6) { // Limitar tamanho da sigla
        sigla += word.charAt(0).toUpperCase();
      }
    }
    
    // Se ainda muito pequena, pegar mais letras das primeiras palavras
    if (sigla.length < 3 && words.length > 0) {
      for (let i = 0; i < Math.min(3, words.length); i++) {
        if (sigla.length < 3) {
          sigla += words[i].charAt(0).toUpperCase();
        }
      }
    }
    
    console.log('Generated sigla:', sigla);
    return sigla;
  }
}

// Teste
const parser = new TestParser();
const bibtexContent = fs.readFileSync('test.bib', 'utf8');

console.log('=== Testing BibTeX Parser ===');
console.log('Content:', bibtexContent);
console.log('\n=== Parsing Results ===');

const entries = parser.simpleBibtexParser(bibtexContent);

entries.forEach((entry, index) => {
  console.log(`\n--- Entry ${index + 1} ---`);
  console.log('Citation Key:', entry.citationKey);
  console.log('Entry Type:', entry.entryType);
  
  if (entry.entryTags.title) {
    const cleanTitle = parser.cleanBibtexString(entry.entryTags.title);
    console.log('Title (cleaned):', cleanTitle);
  }
  
  if (entry.entryTags.booktitle) {
    const cleanBooktitle = parser.cleanBibtexString(entry.entryTags.booktitle);
    console.log('Booktitle (cleaned):', cleanBooktitle);
    const sigla = parser.generateSigla(cleanBooktitle);
    console.log('Generated Sigla:', sigla);
  }
  
  if (entry.entryTags.pages) {
    const pages = parser.parsePages(entry.entryTags.pages);
    console.log('Parsed Pages:', pages);
  }
});