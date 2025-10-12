import React, { useState, useEffect } from 'react';

export default function EventEditForm({ initialData = {}, onCancel = () => {}, onSave = () => {} }) {
  const [form, setForm] = useState({
    name: '',
    entity: '',
    sigla: '',
    ...initialData,
  });

  useEffect(() => {
    setForm({ name: '', entity: '', sigla: '', ...initialData });
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 500 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Nome</label>
        <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Entidade</label>
        <input name="entity" value={form.entity} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Sigla</label>
        <input name="sigla" value={form.sigla} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button type="button" onClick={onCancel} style={{ padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: 4 }}>Cancelar</button>
        <button type="submit" style={{ padding: '8px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Salvar</button>
      </div>
    </form>
  );
}
