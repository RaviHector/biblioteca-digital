import React, { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import { Button, ContainerWrapper, Form, Input, Label } from "./Styles";

export default function EventEditForm({
  initialData = {},
  onCancel = () => {},
  onSave = () => {},
}) {
  const [form, setForm] = useState({
    name: "",
    entity: "",
    sigla: "",
    ...initialData,
  });

  useEffect(() => {
    setForm({ name: "", entity: "", sigla: "", ...initialData });
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }
  const theme = useTheme();
  return (
    <Form onSubmit={handleSubmit}>
      <ContainerWrapper>
        <Label
          style={{
            display: "block",
            marginBottom: 6,
            color: theme.colors.font.black,
          }}
        >
          Nome
        </Label>
        <Input name="name" value={form.name} onChange={handleChange} />
      </ContainerWrapper>
      <ContainerWrapper>
        <Label>Entidade</Label>
        <Input name="entity" value={form.entity} onChange={handleChange} />
      </ContainerWrapper>
      <ContainerWrapper>
        <Label>Sigla</Label>
        <Input name="sigla" value={form.sigla} onChange={handleChange} />
      </ContainerWrapper>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button type="Button" onClick={onCancel} backgroundcolor="#ccc">
          Cancelar
        </Button>
        <Button type="submit" backgroundcolor="#1976d2">
          Salvar
        </Button>
      </div>
    </Form>
  );
}
