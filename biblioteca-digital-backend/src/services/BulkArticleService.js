import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import bibtexPkg from 'bibtex-parse-js';
import ArticleModel from '../models/ArticleModel.js';
import EditionsModel from '../models/EditionsModel.js';
import EventsModel from '../models/EventsModel.js';
import { fileURLToPath } from 'url';

const { parse: parseBibtex } = bibtexPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BulkArticleProcessor {
  constructor() {
    this.processedCount = 0;
    this.skippedArticles = [];
    this.successfulArticles = [];
  }

  // Parser BibTeX mais robusto
  simpleBibtexParser(bibtexContent) {
    console.log('Using robust BibTeX parser');
    const entries = [];
    
    // Encontrar todas as entradas @tipo{...}
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

      // Parse campos com regex mais robusta para pegar aspas também
      const fieldRegex = /(\w+)\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|'([^']*)'|(\w+))/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
        const [, fieldName, bracesValue, doubleQuoteValue, singleQuoteValue, bareValue] = fieldMatch;
        const cleanFieldName = fieldName.trim().toLowerCase();
        const cleanFieldValue = (bracesValue || doubleQuoteValue || singleQuoteValue || bareValue || '').trim();
        
        if (cleanFieldValue) {
          entry.entryTags[cleanFieldName] = cleanFieldValue;
          console.log(`  ${cleanFieldName}: ${cleanFieldValue}`);
        }
      }

      entries.push(entry);
    }

    console.log(`Parsed ${entries.length} entries`);
    return entries;
  }

  // Processar upload em massa
  async processBulkUpload(bibtexFile, zipFile) {
    const report = {
      total: 0,
      successful: 0,
      skipped: 0,
      errors: [],
      successfulArticles: [],
      skippedArticles: []
    };

    try {
      // 1. Parse do arquivo BibTeX
      const bibtexContent = fs.readFileSync(bibtexFile.path, 'utf8');
      let entries;

      try {
        entries = parseBibtex(bibtexContent);
      } catch (error) {
        console.log('Biblioteca principal falhou, usando parser alternativo');
        entries = this.simpleBibtexParser(bibtexContent);
      }

      // 2. Extrair PDFs do ZIP
      const pdfFiles = zipFile ? this.extractPdfFiles(zipFile) : {};

      // 3. Processar cada entrada
      report.total = entries.length;

      for (const entry of entries) {
        
        try {
          const result = await this.processArticleEntry(entry, pdfFiles);
          
          if (result.success) {
            report.successful++;
            report.successfulArticles.push({
              title: result.article.title,
              key: entry.citationKey,
              pdfFound: result.pdfFound
            });
          } else {
            report.skipped++;
            report.skippedArticles.push({
              key: entry.citationKey,
              reason: result.reason,
              missingFields: result.missingFields || []
            });
          }
        } catch (error) {
          report.skipped++;
          report.skippedArticles.push({
            key: entry.citationKey,
            reason: `Erro no processamento: ${error.message}`,
            missingFields: []
          });
        }
      }

      // 4. Limpar arquivos temporários
      this.cleanupTempFiles(bibtexFile, zipFile, pdfFiles);

      return report;

    } catch (error) {
      report.errors.push(`Erro geral: ${error.message}`);
      return report;
    }
  }

  // Extrair PDFs do arquivo ZIP
  extractPdfFiles(zipFile) {
    const zip = new AdmZip(zipFile.path);
    const zipEntries = zip.getEntries();
    const pdfFiles = {};

    // Criar diretório temporário para PDFs
    const tempPdfDir = path.join(__dirname, '../../uploads/temp-pdfs');
    if (!fs.existsSync(tempPdfDir)) {
      fs.mkdirSync(tempPdfDir, { recursive: true });
    }

    zipEntries.forEach(entry => {
      if (entry.entryName.endsWith('.pdf')) {
        const fileName = path.basename(entry.entryName, '.pdf');
        const extractPath = path.join(tempPdfDir, entry.entryName);
        
        // Extrair arquivo PDF
        zip.extractEntryTo(entry, tempPdfDir, false, true);
        
        pdfFiles[fileName] = extractPath;
      }
    });

    return pdfFiles;
  }

  // Processar entrada individual do BibTeX
  async processArticleEntry(entry, pdfFiles) {
    console.log('Processing entry:', entry.citationKey, 'Type:', entry.entryType);
    
    // Só processar entradas de conference/proceedings
    if (entry.entryType !== 'inproceedings' && entry.entryType !== 'conference') {
      return {
        success: false,
        reason: `Tipo de entrada não suportado: ${entry.entryType}. Apenas 'inproceedings' e 'conference' são aceitos.`
      };
    }

    // Verificação obrigatória de booktitle
    if (!entry.entryTags || !entry.entryTags.booktitle || entry.entryTags.booktitle.trim() === '') {
      return {
        success: false,
        reason: `Campo obrigatório ausente: 'booktitle' (nome do evento)`
      };
    }

    // Verificação obrigatória de location
    if (!entry.entryTags || !entry.entryTags.location || entry.entryTags.location.trim() === '') {
      return {
        success: false,
        reason: `Campo obrigatório ausente: 'location' (local da edição)`
      };
    }

    const requiredFields = ['title', 'author', 'year', 'pages', 'booktitle', 'location'];
    const missingFields = [];

    // Verificar campos obrigatórios
    requiredFields.forEach(field => {
      if (!entry.entryTags || !entry.entryTags[field] || entry.entryTags[field].trim() === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return {
        success: false,
        reason: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
        missingFields
      };
    }

    try {
      // Extrair dados do BibTeX
      console.log('Processing entry tags:', entry.entryTags);
      
      const title = this.cleanBibtexString(entry.entryTags.title);
      const authors = this.parseAuthors(entry.entryTags.author);
      const year = parseInt(entry.entryTags.year) || new Date().getFullYear();
      const booktitle = this.cleanBibtexString(entry.entryTags.booktitle);
      const location = this.cleanBibtexString(entry.entryTags.location);
      const pages = this.parsePages(entry.entryTags.pages);

      // Validação adicional de dados essenciais
      if (!title || title.length < 3) {
        return {
          success: false,
          reason: 'Título muito curto ou inválido'
        };
      }

      if (!booktitle || booktitle.length < 10) {
        return {
          success: false,
          reason: 'Booktitle (nome do evento) ausente, muito curto ou inválido.'
        };
      }

      // Verificar se o booktitle contém informações mínimas de um evento
      const eventKeywords = ['simpósio', 'congresso', 'conferência', 'workshop', 'encontro', 'jornada', 'escola', 'conference', 'symposium', 'meeting'];
      const hasEventKeyword = eventKeywords.some(keyword => 
        booktitle.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!hasEventKeyword) {
        return {
          success: false,
          reason: 'Booktitle não parece ser de um evento/conferência válido. Apenas artigos de eventos são aceitos.'
        };
      }

      if (!authors || authors.length === 0) {
        return {
          success: false,
          reason: 'Campo obrigatório ausente ou inválido: \'author\' (lista de autores)'
        };
      }

      // Validar páginas - deve ter inicial E final
      if (!pages.first || !pages.last || pages.first === pages.last) {
        return {
          success: false,
          reason: 'Campo \'pages\' deve conter página inicial e final (ex: 1-10, 1--10). Páginas: ' + (entry.entryTags.pages || 'ausente')
        };
      }

      // Validar se páginas são números válidos
      const startPage = parseInt(pages.first);
      const endPage = parseInt(pages.last);
      
      if (isNaN(startPage) || isNaN(endPage) || startPage >= endPage) {
        return {
          success: false,
          reason: 'Páginas inválidas: página inicial deve ser menor que final. Encontrado: ' + pages.first + '-' + pages.last
        };
      }

      // Buscar evento existente pelo nome
      const event = await EventsModel.findOne({
        $or: [
          { name: { $regex: new RegExp(booktitle, 'i') } },
          { sigla: { $regex: new RegExp(booktitle, 'i') } }
        ]
      });

      if (!event) {
        return {
          success: false,
          reason: `Evento não existente: ${booktitle}`
        };
      }

      // Buscar edição existente pelo evento, ano e local
      const edition = await EditionsModel.findOne({
        event: event._id,
        year: year,
        place: location
      });

      if (!edition) {
        return {
          success: false,
          reason: `Edição não existente para o evento '${booktitle}' no local '${location}' e ano '${year}'`
        };
      }

      // Verificar se já existe artigo com mesmo título na edição
      const existingArticle = await ArticleModel.findOne({
        title: title,
        edition: edition._id
      });

      if (existingArticle) {
        return {
          success: false,
          reason: `Artigo já existe na edição: ${title}`
        };
      }

      // Processar PDF se existir
      let pdfPath = null;
      const pdfFound = pdfFiles[entry.citationKey];
      
      if (pdfFound && fs.existsSync(pdfFound)) {
        pdfPath = await this.movePdfToArticles(pdfFound, entry.citationKey);
      }

      // Criar artigo
      const articleData = {
        title,
        author: Array.isArray(authors) ? authors.join(', ') : authors,
        edition: edition._id,
        year,
        first_page: pages.first,
        last_page: pages.last,
        pdf_file: pdfPath
      };

      console.log('Creating article with data:', articleData);
      const article = await ArticleModel.create(articleData);
      console.log('Article created successfully:', article._id);

      return {
        success: true,
        article,
        pdfFound: !!pdfFound
      };

    } catch (error) {
      return {
        success: false,
        reason: `Erro ao criar artigo: ${error.message}`
      };
    }
  }

  // Mover PDF para diretório de artigos
  async movePdfToArticles(tempPdfPath, citationKey) {
    const articlesDir = path.join(__dirname, '../../uploads/articles');
    const fileName = `${citationKey}-${Date.now()}.pdf`;
    const finalPath = path.join(articlesDir, fileName);

    // Criar diretório se não existir
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    // Mover arquivo
    fs.copyFileSync(tempPdfPath, finalPath);

    return `/uploads/articles/${fileName}`;
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

  parseAuthors(authorString) {
    if (!authorString) return [];
    
    return authorString
      .split(' and ')
      .map(author => this.cleanBibtexString(author))
      .filter(author => author.length > 0);
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
    if (!booktitle) return 'EVENTO';
    
    console.log('Generating sigla from booktitle:', booktitle);
    
    // Palavras importantes que devem ser priorizadas
    const importantWords = [
      'simpósio', 'simposio', 'congresso', 'conferência', 'conferencia',
      'brasileiro', 'brasileira', 'nacional', 'internacional',
      'engenharia', 'software', 'computação', 'computacao', 'informática', 'informatica',
      'ciência', 'ciencia', 'tecnologia', 'workshop', 'seminário', 'seminario',
      'encontro', 'jornada', 'escola'
    ];
    
    // Palavras a serem ignoradas
    const stopWords = [
      'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'nas', 'nos',
      'para', 'por', 'com', 'sobre', 'anais', 'proceedings', 'conference',
      'the', 'of', 'and', 'in', 'on', 'at', 'to', 'for', 'with', 'by'
    ];
    
    // Limpar e dividir em palavras
    const words = booktitle
      .toLowerCase()
      .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ') // Remove pontuação mas mantém acentos
      .split(/\s+/)
      .filter(word => word.length > 2) // Palavras com pelo menos 3 caracteres
      .filter(word => !stopWords.includes(word));
    
    console.log('Filtered words:', words);
    
    // Separar palavras importantes
    const priority = [];
    const regular = [];
    
    words.forEach(word => {
      if (importantWords.includes(word)) {
        priority.push(word);
      } else {
        regular.push(word);
      }
    });
    
    console.log('Priority words:', priority);
    console.log('Regular words:', regular);
    
    // Construir sigla priorizando palavras importantes
    let siglaWords = [];
    
    // Adicionar palavras importantes primeiro
    siglaWords.push(...priority);
    
    // Completar com palavras regulares se necessário
    const remaining = Math.max(0, Math.min(4, 6 - priority.length));
    siglaWords.push(...regular.slice(0, remaining));
    
    // Se ainda muito pequena, pegar as primeiras palavras disponíveis
    if (siglaWords.length < 3) {
      siglaWords = words.slice(0, Math.min(4, words.length));
    }
    
    // Gerar sigla
    const sigla = siglaWords
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    const finalSigla = sigla.length >= 2 ? sigla : 'EVENTO';
    console.log('Generated sigla:', finalSigla);
    
    return finalSigla;
  }

  // Limpeza de arquivos temporários
  cleanupTempFiles(bibtexFile, zipFile, pdfFiles) {
    // Remover arquivo BibTeX temporário
    if (fs.existsSync(bibtexFile.path)) {
      fs.unlinkSync(bibtexFile.path);
    }

    // Remover arquivo ZIP temporário
    if (zipFile && fs.existsSync(zipFile.path)) {
      fs.unlinkSync(zipFile.path);
    }

    // Remover PDFs temporários
    Object.values(pdfFiles).forEach(pdfPath => {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });

    // Remover diretório temporário se vazio
    const tempPdfDir = path.join(__dirname, '../../uploads/temp-pdfs');
    if (fs.existsSync(tempPdfDir)) {
      const files = fs.readdirSync(tempPdfDir);
      if (files.length === 0) {
        fs.rmdirSync(tempPdfDir);
      }
    }
  }
}

export default BulkArticleProcessor;