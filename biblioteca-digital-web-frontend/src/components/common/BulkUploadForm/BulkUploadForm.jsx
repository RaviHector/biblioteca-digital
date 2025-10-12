import { useState } from "react";
import { toast } from "react-toastify";
import { bulkUploadArticles } from "../../../services/api/endpoints";
import { FormContainer, Input, ErrorMsg, Actions, Button, Label, ContainerWrapper } from "./BulkUploadFormStyles";

export default function BulkUploadForm({ onClose }) {
  const [files, setFiles] = useState({
    bibtex: null,
    zip: null
  });
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (type, event) => {
    const file = event.target.files[0];
    setErrors(prev => ({ ...prev, [type]: null }));
    
    if (file) {
      // Validar tipo de arquivo
      if (type === 'bibtex') {
        const validExtensions = ['.bib', '.txt'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(extension)) {
          setErrors(prev => ({ ...prev, bibtex: "Por favor, selecione um arquivo .bib ou .txt" }));
          return;
        }
      } else if (type === 'zip') {
        if (!file.name.toLowerCase().endsWith('.zip')) {
          setErrors(prev => ({ ...prev, zip: "Por favor, selecione um arquivo .zip" }));
          return;
        }
      }
      
      // Validar tamanho (25MB por arquivo)
      const maxSize = 25 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [type]: "Arquivo muito grande (máximo 25MB)" }));
        return;
      }
      
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.bibtex) {
      setErrors(prev => ({ ...prev, bibtex: "Arquivo BibTeX é obrigatório" }));
      return;
    }
    
    if (!files.zip) {
      setErrors(prev => ({ ...prev, zip: "Arquivo ZIP é obrigatório" }));
      return;
    }

    setUploading(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append('files', files.bibtex);
      formData.append('files', files.zip);

      const result = await bulkUploadArticles(formData);
      setReport(result.report);
      
      toast.success(`Upload concluído! ${result.report.summary.successful} artigos processados com sucesso.`);
      
    } catch (error) {
      console.error('Erro no upload em massa:', error);
      toast.error(`Erro no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Upload em Massa de Artigos</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Faça upload de um arquivo BibTeX e um ZIP com os PDFs correspondentes para cadastrar múltiplos artigos de uma vez.
      </p>

      <FormContainer onSubmit={handleSubmit}>
        <ContainerWrapper>
          <Label>Arquivo BibTeX (.bib ou .txt)</Label>
          <Input 
            type="file" 
            accept=".bib,.txt"
            onChange={(e) => handleFileChange('bibtex', e)}
            style={{ padding: "8px" }}
          />
          {errors.bibtex && <ErrorMsg>{errors.bibtex}</ErrorMsg>}
          {files.bibtex && (
            <div style={{ color: "green", fontSize: "14px", marginTop: "4px" }}>
              ✓ {files.bibtex.name} ({(files.bibtex.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </ContainerWrapper>

        <ContainerWrapper>
          <Label>Arquivo ZIP com PDFs (.zip)</Label>
          <Input 
            type="file" 
            accept=".zip"
            onChange={(e) => handleFileChange('zip', e)}
            style={{ padding: "8px" }}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Os nomes dos PDFs devem corresponder exatamente às chaves de citação do BibTeX
          </div>
          {errors.zip && <ErrorMsg>{errors.zip}</ErrorMsg>}
          {files.zip && (
            <div style={{ color: "green", fontSize: "14px", marginTop: "4px" }}>
              ✓ {files.zip.name} ({(files.zip.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </ContainerWrapper>

        <Actions>
          <Button type="button" onClick={onClose} backgroundcolor="#ccc" disabled={uploading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            backgroundcolor={uploading ? "#ccc" : "#1976d2"}
            disabled={uploading || !files.bibtex || !files.zip}
          >
            {uploading ? "Processando..." : "Iniciar Upload"}
          </Button>
        </Actions>
      </FormContainer>

      {report && (
        <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Relatório de Processamento</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <h4>Resumo:</h4>
            <ul>
              <li><strong>Total processado:</strong> {report.summary.totalProcessed}</li>
              <li><strong>Sucessos:</strong> {report.summary.successful}</li>
              <li><strong>Pulados:</strong> {report.summary.skipped}</li>
              <li><strong>Taxa de sucesso:</strong> {report.summary.successRate}</li>
            </ul>
          </div>

          {report.successfulArticles.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4>Artigos Cadastrados com Sucesso:</h4>
              <ul>
                {report.successfulArticles.map((article, index) => (
                  <li key={index}>
                    <strong>{article.title}</strong> (Chave: {article.key})
                    {article.pdfFound && <span style={{ color: "green" }}> ✓ PDF</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.skippedArticles.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4>Artigos Pulados:</h4>
              <ul>
                {report.skippedArticles.map((article, index) => (
                  <li key={index} style={{ color: "red" }}>
                    <strong>Chave:</strong> {article.key} - <strong>Motivo:</strong> {article.reason}
                    {article.missingFields.length > 0 && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Campos ausentes: {article.missingFields.join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.errors.length > 0 && (
            <div>
              <h4>Erros:</h4>
              <ul>
                {report.errors.map((error, index) => (
                  <li key={index} style={{ color: "red" }}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}