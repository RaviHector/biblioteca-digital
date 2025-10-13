import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do storage do multer para upload em massa
const bulkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Criar diretório uploads/bulk se não existir
    const uploadPath = path.join(__dirname, "../../uploads/bulk");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Manter nome original com timestamp para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    cb(null, `${name}-${uniqueSuffix}${extension}`);
  }
});

// Filtro para aceitar apenas BibTeX (.bib) e ZIP (.zip)
const bulkFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/x-bibtex', 'text/plain', 'application/zip', 'application/x-zip-compressed'];
  const allowedExtensions = ['.bib', '.zip', '.txt'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos BibTeX (.bib) e ZIP (.zip) são permitidos'), false);
  }
};

// Configuração do multer para upload em massa
const bulkUpload = multer({
  storage: bulkStorage,
  fileFilter: bulkFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limite total
    files: 2 // Máximo 2 arquivos (BibTeX + ZIP)
  }
});

export default bulkUpload;