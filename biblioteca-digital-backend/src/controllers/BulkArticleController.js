import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import BulkArticleProcessor from "../services/BulkArticleService.js";
import { BadRequest } from "../errors/baseErrors.js";

export const bulkUploadArticles = asyncHandler(async (req, res) => {
  // Verificar se ambos os arquivos foram enviados
  if (!req.files || req.files.length !== 2) {
    throw new BadRequest("Dois arquivos são necessários: BibTeX (.bib) e ZIP (.zip)");
  }

  const files = req.files;
  let bibtexFile = null;
  let zipFile = null;

  // Identificar qual arquivo é qual baseado na extensão
  files.forEach(file => {
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    if (extension === 'bib' || extension === 'txt') {
      bibtexFile = file;
    } else if (extension === 'zip') {
      zipFile = file;
    }
  });

  if (!bibtexFile) {
    throw new BadRequest("Arquivo BibTeX (.bib ou .txt) não encontrado");
  }

  if (!zipFile) {
    throw new BadRequest("Arquivo ZIP (.zip) não encontrado");
  }

  console.log('Iniciando processamento em massa:', {
    bibtex: bibtexFile.originalname,
    zip: zipFile.originalname,
    bibtexSize: bibtexFile.size,
    zipSize: zipFile.size
  });

  // Processar arquivos
  const processor = new BulkArticleProcessor();
  const report = await processor.processBulkUpload(bibtexFile, zipFile);

  console.log('Processamento concluído:', report);

  res.status(SUCCESS_CODES.OK).json({
    message: "Processamento em massa concluído",
    report: {
      summary: {
        totalProcessed: report.processed,
        successful: report.successful,
        skipped: report.skipped,
        successRate: report.processed > 0 ? 
          ((report.successful / report.processed) * 100).toFixed(1) + '%' : '0%'
      },
      successfulArticles: report.successfulArticles,
      skippedArticles: report.skippedArticles,
      errors: report.errors
    }
  });
});