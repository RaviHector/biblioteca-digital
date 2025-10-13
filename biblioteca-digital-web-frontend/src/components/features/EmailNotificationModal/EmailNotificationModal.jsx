import { useState } from 'react';
import { toast } from 'react-toastify';
import { Mail, User, Bell, X } from 'lucide-react';
import styled from 'styled-components';
import { subscribeEmailNotification, unsubscribeEmailNotification } from '../../../services/api/endpoints';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.h2`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UnsubscribeButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export default function EmailNotificationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      await subscribeEmailNotification({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      toast.success('Email cadastrado com sucesso! Você receberá notificações sobre novos artigos deste autor.');
      setFormData({ name: '', email: '' });
      onClose();
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao cadastrar email para notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Por favor, preencha o nome e email para se desinscrever');
      return;
    }

    setIsLoading(true);

    try {
      await unsubscribeEmailNotification({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      toast.success('Email removido das notificações com sucesso!');
      setFormData({ name: '', email: '' });
      setShowUnsubscribe(false);
      onClose();
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover email das notificações');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <Title>
          <Bell size={24} />
          Notificações por Email
        </Title>

        <Description>
          {showUnsubscribe 
            ? "Preencha os dados para se desinscrever das notificações:"
            : "Cadastre seu email para receber notificações sempre que um artigo do autor especificado for publicado na biblioteca digital."
          }
        </Description>

        <Form onSubmit={showUnsubscribe ? handleUnsubscribe : handleSubmit}>
          <InputGroup>
            <Label>
              <User size={16} />
              Nome do Autor
            </Label>
            <Input
              type="text"
              placeholder="Ex: João Silva"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <Mail size={16} />
              Seu Email
            </Label>
            <Input
              type="email"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              "Processando..."
            ) : showUnsubscribe ? (
              <>
                <X size={16} />
                Desinscrever
              </>
            ) : (
              <>
                <Bell size={16} />
                Cadastrar Notificação
              </>
            )}
          </SubmitButton>
        </Form>

        <UnsubscribeButton
          type="button"
          onClick={() => setShowUnsubscribe(!showUnsubscribe)}
        >
          {showUnsubscribe ? "Voltar ao Cadastro" : "Já tem notificação? Clique para se desinscrever"}
        </UnsubscribeButton>
      </ModalContent>
    </ModalOverlay>
  );
}