import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { FormContainer, Input, ErrorMsg, Actions, Button, ContainerWrapper, Label } from "./UserEditFormStyles";

export default function UserEditForm({ user, onSave, onCancel }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("isAdmin", user.isAdmin);
    }
  }, [user, setValue]);

  const handleFormSubmit = (data) => {
    // Remove senha se estiver vazia (não alteração de senha)
    if (!data.password) {
      delete data.password;
    }
    onSave(data);
  };

  if (!user) return null;

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Editar Usuário</h2>
      
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
        <Label>Nova Senha (opcional)</Label>
        <Input 
          {...register("password", { 
            minLength: {
              value: 6,
              message: "Senha deve ter pelo menos 6 caracteres"
            }
          })} 
          placeholder="Digite nova senha (deixe vazio para não alterar)" 
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
          Salvar
        </Button>
      </Actions>
    </FormContainer>
  );
}