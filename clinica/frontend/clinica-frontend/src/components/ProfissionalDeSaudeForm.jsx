import { useState } from "react";

const CATEGORIAS = [
  { label:"Médico",         value:"MEDICO",         emoji:"🩺", desc:"Prescreve remédios",           av:{bg:"#B5D4F4",c:"#0C447C"}, sel:{bg:"#E6F1FB",b:"#185FA5",r:"#185FA5"}, badge:{bg:"#E6F1FB",c:"#0C447C",b:"#85B7EB"} },
  { label:"Fisioterapeuta", value:"FISIOTERAPEUTA",  emoji:"🏃", desc:"Prescreve atividade física",   av:{bg:"#C0DD97",c:"#27500A"}, sel:{bg:"#EAF3DE",b:"#3B6D11",r:"#3B6D11"}, badge:{bg:"#EAF3DE",c:"#27500A",b:"#97C459"} },
  { label:"Psicólogo",      value:"PSICOLOGO",       emoji:"🧠", desc:"Prescreve atividades mentais", av:{bg:"#CECBF6",c:"#3C3489"}, sel:{bg:"#EEEDFE",b:"#534AB7",r:"#534AB7"}, badge:{bg:"#EEEDFE",c:"#3C3489",b:"#AFA9EC"} },
];

const inp = { width:"100%",boxSizing:"border-box",padding:"9px 12px",borderRadius:8,border:"1px solid #d1d5db",fontSize:14,fontFamily:"inherit",background:"#fff",color:"#111827" };
const lbl = { display:"block",fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 };

export default function ProfissionalDeSaudeForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { nome:"", telefone:"", endereco:"", categoria:"MEDICO" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const cur = CATEGORIAS.find(c=>c.value===form.categoria) || CATEGORIAS[0];

  return (
    <>
      <div style={{marginBottom:"1.1rem"}}>
        <span style={lbl}>Categoria</span>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {CATEGORIAS.map(cat => {
            const sel = form.categoria === cat.value;
            return (
              <div key={cat.value} onClick={()=>set("categoria",cat.value)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",
                  border:sel?`1.5px solid ${cat.sel.b}`:"1px solid #e5e7eb",
                  background:sel?cat.sel.bg:"#fff"}}>
                <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                  border:sel?"none":"1.5px solid #d1d5db",background:sel?cat.sel.r:"transparent"}}>
                  {sel && <div style={{width:6,height:6,borderRadius:"50%",background:"white"}} />}
                </div>
                <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:cat.av.bg,color:cat.av.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{cat.emoji}</div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:500,color:"#111827"}}>{cat.label}</p>
                  <p style={{margin:"1px 0 0",fontSize:12,color:"#6b7280"}}>{cat.desc}</p>
                </div>
                <span style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:20,flexShrink:0,background:cat.badge.bg,color:cat.badge.c,border:`0.5px solid ${cat.badge.b}`}}>{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{marginBottom:"1rem"}}>
        <label style={lbl}>Nome completo</label>
        <input style={inp} value={form.nome} onChange={e=>set("nome",e.target.value)} placeholder="Ex: Carlos Silva" />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1rem"}}>
        <div><label style={lbl}>Telefone</label><input style={inp} value={form.telefone} onChange={e=>set("telefone",e.target.value)} placeholder="(00) 00000-0000" /></div>
        <div><label style={lbl}>Endereço</label><input style={inp} value={form.endereco} onChange={e=>set("endereco",e.target.value)} placeholder="Rua, nº, cidade" /></div>
      </div>

      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:"1rem",borderTop:"1px solid #f3f4f6"}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Cancelar</button>
        <button onClick={()=>onSave(form)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${cur.sel.b}`,background:cur.sel.bg,color:cur.badge.c,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit"}}>
          Salvar profissional
        </button>
      </div>
    </>
  );
}