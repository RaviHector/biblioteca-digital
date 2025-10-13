import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do storage do multer para upload em massa
const bulkStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Criar diretório uploads/bulk se não existir
    const uploadPath = path.join(__dirname, "../../uploads/bulk");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Manter nome original com timestamp para evitar conflitos
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    // Sanitizar o nome do arquivo para remover quebras de linha e caracteres inválidos
    let name = path.basename(file.originalname, extension);
    // Remover caracteres de nova linha e espaços extras
    name = name.replace(/\r|\n/g, "").trim();
    // Substituir espaços por '-' e remover caracteres não alfanuméricos exceto '_' e '-'
    name = name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    if (!name) {
      name = "file";
    }
    cb(null, `${name}-${uniqueSuffix}${extension}`);
  },
});

// Filtro para aceitar apenas BibTeX (.bib) e ZIP (.zip)
const bulkFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/x-bibtex",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ];
  const allowedExtensions = [".bib", ".zip", ".txt"];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Apenas arquivos BibTeX (.bib) e ZIP (.zip) são permitidos"),
      false
    );
  }
};

// Configuração do multer para upload em massa
const bulkUpload = multer({
  storage: bulkStorage,
  fileFilter: bulkFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limite total
    files: 2, // Máximo 2 arquivos (BibTeX + ZIP)
  },
});

export default bulkUpload;
