import { useState } from "react";

const inp = { width:"100%",boxSizing:"border-box",padding:"9px 12px",borderRadius:8,border:"1px solid #d1d5db",fontSize:14,fontFamily:"inherit",background:"#fff",color:"#111827" };
const lbl = { display:"block",fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 };

export default function ExameLabForm({ atendimentos = [], initial, onSave, onClose }) {
  
  const [form, setForm] = useState(initial || { descricao: "", atendimentoId: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.atendimentoId) {
      alert("Por favor, selecione um atendimento.");
      return;
    }
    const payload = {
      descricao: form.descricao,
      atendimento: { id: parseInt(form.atendimentoId) } 
    };

    onSave(payload);
  };

  return (
    <>
      <div style={{marginBottom:"1rem"}}>
        <label style={lbl}>Atendimento Vinculado</label>
        <select 
          style={inp} 
          value={form.atendimentoId} 
          onChange={e => set("atendimentoId", e.target.value)}
        >
          <option value="">-- Escolha um atendimento --</option>
          {atendimentos.map(a => (
            <option key={a.id} value={a.id}>
              {a.data} - {a.problema_texto?.substring(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      <div style={{marginBottom:"1rem"}}>
        <label style={lbl}>Descrição do exame</label>
        <input 
          style={inp} 
          value={form.descricao} 
          onChange={e => set("descricao", e.target.value)} 
          placeholder="Ex: Hemograma" 
        />
      </div>

      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:"0.75rem",borderTop:"1px solid #f3f4f6"}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>Cancelar</button>
        <button onClick={handleSubmit} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #BFDBFE",background:"#EFF6FF",color:"#1D4ED8",cursor:"pointer",fontWeight:500}}>
          Salvar exame
        </button>
      </div>
    </>
  );
}