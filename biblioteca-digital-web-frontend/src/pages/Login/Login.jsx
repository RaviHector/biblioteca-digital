import { useState } from "react";
import { toast } from "react-toastify";
import { FormInput } from "../../components/common";
import { useLogin, useCreateUser } from "../../hooks/query/sessions";
import { Button, Container, Form, InputsBox, ToggleForm } from "./Styles";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const auth = useAuthStore((state) => state.auth);
  const isCurrentUserAdmin = auth?.user?.isAdmin || false;
  
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch
  } = useForm();

  const { mutate: login } = useLogin({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      const { auth } = useAuthStore.getState();
      const isAdminPath = auth?.user?.isAdmin ? "/adminpage" : "/events";
      const redirectTo = state?.from || isAdminPath;
      navigate(redirectTo);
    },
    onError: (err) => {
      toast.error(`Erro ao fazer login: ${err.message}`);
    }
  });

  const { mutate: createUser } = useCreateUser({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso! Faça o login.");
      setIsRegistering(false); // Volta para a tela de login
    },
    onError: (err) => {
      toast.error(`Erro ao criar usuário: ${err.message}`);
    }
  });

  const onSubmit = (data) => {
    if (isRegistering) {
      createUser(data);
    } else {
      login(data);
    }
  };

  return (
    <Container>
      <InputsBox>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h2>{isRegistering ? "Criar Conta" : "Entrar"}</h2>
          
          {isRegistering && (
            <FormInput
              name="name"
              placeholder="Digite seu nome"
              register={register}
              errors={errors}
              required
            />
          )}

          <FormInput
            name="email"
            placeholder="Digite aqui seu email"
            register={register}
            errors={errors}
            required
          />
          <FormInput
            name="password"
            type="password"
            placeholder="Digite aqui sua senha"
            register={register}
            errors={errors}
            required
          />

          {isRegistering && isCurrentUserAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
              <input
                id="isAdmin"
                type="checkbox"
                {...register("isAdmin")}
              />
              <label htmlFor="isAdmin">Criar como Administrador</label>
            </div>
          )}

          <Button type="submit">{isRegistering ? "Cadastrar" : "Entrar"}</Button>
        </Form>
        <ToggleForm onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "Já tem uma conta? Entre aqui."
            : "Não tem uma conta? Cadastre-se."}
        </ToggleForm>
      </InputsBox>
    </Container>
  );
}
