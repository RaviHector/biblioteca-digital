// Script para remover índice único do campo year e criar índice composto
// Execute este script no MongoDB ou através do Node.js

import mongoose from 'mongoose';

// URI do MongoDB (substitua pelos seus dados de conexão)
const MONGO_URI = 'mongodb+srv://ravihector02_db_user:yglOIPChhKBtnDit@biblioteca-digital.wjux5j8.mongodb.net/BibliotecDigitalDevelopment?retryWrites=true&w=majority&appName=Dharma';

async function updateIndexes() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const db = mongoose.connection.db;
    const collection = db.collection('editions');
    
    // Listar todos os índices atuais
    const indexes = await collection.indexes();
    console.log('Índices atuais:', indexes);
    
    // Tentar remover o índice único do campo year se existir
    try {
      await collection.dropIndex({ year: 1 });
      console.log('✅ Índice único do campo year removido com sucesso');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ Índice único do campo year não encontrado (já foi removido ou nunca existiu)');
      } else {
        console.log('⚠️ Erro ao remover índice único do year:', error.message);
      }
    }
    
    // Criar o novo índice composto se não existir
    try {
      await collection.createIndex({ event: 1, year: 1 }, { unique: true });
      console.log('✅ Índice composto (event + year) criado com sucesso');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict' || error.code === 85) {
        console.log('ℹ️ Índice composto (event + year) já existe');
      } else {
        console.log('⚠️ Erro ao criar índice composto:', error.message);
      }
    }
    
    // Verificar índices finais
    const finalIndexes = await collection.indexes();
    console.log('Índices finais:', finalIndexes);
    
  } catch (error) {
    console.error('Erro na operação:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexão fechada');
  }
}

updateIndexes();