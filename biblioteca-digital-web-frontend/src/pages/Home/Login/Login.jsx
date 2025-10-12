import { toast } from "react-toastify";
import { FormInput } from "../../components/common";
import { useLogin } from "../../hooks/query/sessions";
import { Button, Container, Form, InputsBox } from "./Styles";
import { useForm } from "react-hook-form";
//import useAuthStore from "../../stores/auth";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";

export default function Login() {
  const navigate = useNavigate();
  const {state} = useLocation();
  // Form handlers
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { mutate: login } = useLogin({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");

      const { auth } = useAuthStore.getState();
      const isAdminPath = auth?.user?.isAdmin ? "/adminpage" : "/events";
      const redirectTo = state?.from || isAdminPath;
      navigate(redirectTo);
    },
  });
  const onSubmit = (data) => login(data);

  return (
    <Container>
      <InputsBox>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            placeholder="Digite aqui seu email"
            register={register}
            errors={errors}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="Digite aqui sua senha"
            register={register}
            errors={errors}
          />
          <Button>Entrar</Button>
        </Form>
      </InputsBox>
    </Container>
  );
}
