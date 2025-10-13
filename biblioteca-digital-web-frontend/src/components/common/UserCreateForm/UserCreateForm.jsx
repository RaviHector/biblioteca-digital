import { useForm } from "react-hook-form";
import { FormContainer, Input, ErrorMsg, Actions, Button, ContainerWrapper, Label } from "./UserCreateFormStyles";

export default function UserCreateForm({ onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSave(data);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Cadastrar Usuário</h2>
      
      <ContainerWrapper>
        <Label>Nome</Label>
        <Input 
          {...register("name", { 
            required: "Nome é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter pelo menos 2 caracteres"
            }
          })} 
          placeholder="Digite o nome do usuário" 
        />
        {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Email</Label>
        <Input 
          {...register("email", { 
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          })} 
          placeholder="Digite o email do usuário" 
          type="email"
        />
        {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Senha</Label>
        <Input 
          {...register("password", { 
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "Senha deve ter pelo menos 6 caracteres"
            }
          })} 
          placeholder="Digite a senha" 
          type="password"
        />
        {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="isAdmin"
            type="checkbox"
            {...register("isAdmin")}
          />
          <Label htmlFor="isAdmin" style={{ margin: 0 }}>Administrador</Label>
        </div>
      </ContainerWrapper>
      
      <Actions>
        <Button type="button" onClick={onCancel} backgroundcolor="#ccc">
          Cancelar
        </Button>
        <Button type="submit" backgroundcolor="#1976d2">
          Cadastrar
        </Button>
      </Actions>
    </FormContainer>
  );
}