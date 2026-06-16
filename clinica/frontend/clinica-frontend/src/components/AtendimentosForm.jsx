import { useState } from "react";

// Mapeia categoria do profissional → enum ReceitaSaude do backend
const CAT_MAP = {
  MEDICO:         { label:"Médico",         receitaEnum:"REMEDIO",          receitaLabel:"Remédio",            receita:{bg:"#E6F1FB",border:"#85B7EB",color:"#0C447C"}, av:{bg:"#B5D4F4",c:"#0C447C"}, badge:{bg:"#E6F1FB",c:"#0C447C",b:"#85B7EB"}, sel:{bg:"#E6F1FB",b:"#185FA5",r:"#185FA5"} },
  FISIOTERAPEUTA: { label:"Fisioterapeuta", receitaEnum:"ATIVIDADE_FISICA",  receitaLabel:"Atividade Física",   receita:{bg:"#EAF3DE",border:"#97C459",color:"#27500A"}, av:{bg:"#C0DD97",c:"#27500A"}, badge:{bg:"#EAF3DE",c:"#27500A",b:"#97C459"}, sel:{bg:"#EAF3DE",b:"#3B6D11",r:"#3B6D11"} },
  PSICOLOGO:      { label:"Psicólogo",      receitaEnum:"ATIVIDADE_MENTAL",  receitaLabel:"Atividades Mentais", receita:{bg:"#EEEDFE",border:"#AFA9EC",color:"#3C3489"}, av:{bg:"#CECBF6",c:"#3C3489"}, badge:{bg:"#EEEDFE",c:"#3C3489",b:"#AFA9EC"}, sel:{bg:"#EEEDFE",b:"#534AB7",r:"#534AB7"} },
};

const inp = { width:"100%",boxSizing:"border-box",padding:"9px 12px",borderRadius:8,border:"1px solid #d1d5db",fontSize:14,fontFamily:"inherit",background:"#fff",color:"#111827" };
const lbl = { display:"block",fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 };

function initials(nome){ return (nome||"?").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

// Extrai o id do profissional independente de como o backend retornou
function getProfId(a) {
  if (!a) return "";
  if (a.profissionalDeSaude?.id) return String(a.profissionalDeSaude.id);
  if (a.profissionalId)          return String(a.profissionalId);
  return "";
}

export default function AtendimentosForm({ profissionais = [], initial, onSave, onClose }) {
  const [profissionalId, setProfissionalId] = useState(getProfId(initial));
  const [form, setForm] = useState({
    data:          initial?.data          || "",
    horario:       initial?.horario       || "",
    problemaTexto: initial?.problemaTexto || "",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const profSel = profissionais.find(p => String(p.id) === profissionalId);
  const cfg     = profSel ? CAT_MAP[profSel.categoria] : null;

  const handleSave = () => {
    if (!profissionalId) return;
    // Monta o payload exatamente como o Spring espera
    const payload = {
      ...(initial?.id ? { id: initial.id } : {}),
      data:          form.data,
      horario:       form.horario,
      problemaTexto: form.problemaTexto,
      receitaSaude:  cfg?.receitaEnum || null,
      profissionalDeSaude: { id: Number(profissionalId) },
    };
    onSave(payload);
  };

  return (
    <>
      {/* Profissional */}
      <div style={{marginBottom:"1.1rem"}}>
        <span style={lbl}>Profissional responsável</span>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {profissionais.length === 0 && <p style={{fontSize:13,color:"#6b7280"}}>Nenhum profissional cadastrado.</p>}
          {profissionais.map(p => {
            const sel = String(p.id) === profissionalId;
            const cc  = CAT_MAP[p.categoria] || CAT_MAP["MEDICO"];
            return (
              <div key={p.id} onClick={() => setProfissionalId(String(p.id))}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",
                  border: sel ? `1.5px solid ${cc.sel.b}` : "1px solid #e5e7eb",
                  background: sel ? cc.sel.bg : "#fff"}}>
                <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                  border: sel ? "none" : "1.5px solid #d1d5db", background: sel ? cc.sel.r : "transparent"}}>
                  {sel && <div style={{width:6,height:6,borderRadius:"50%",background:"white"}} />}
                </div>
                <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,background:cc.av.bg,color:cc.av.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500}}>
                  {initials(p.nome)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:14,fontWeight:500,color:"#111827"}}>{p.nome}</p>
                  <p style={{margin:"1px 0 0",fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {p.telefone}{p.endereco ? ` · ${p.endereco}` : ""}
                  </p>
                </div>
                <span style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:20,flexShrink:0,background:cc.badge.bg,color:cc.badge.c,border:`0.5px solid ${cc.badge.b}`}}>
                  {cc.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data + Hora */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1rem"}}>
        <div><label style={lbl}>Data</label><input style={inp} type="date" value={form.data} onChange={e=>set("data",e.target.value)} /></div>
        <div><label style={lbl}>Horário</label><input style={inp} type="time" value={form.horario} onChange={e=>set("horario",e.target.value)} /></div>
      </div>

      {/* Problema */}
      <div style={{marginBottom:"1rem"}}>
        <label style={lbl}>Descrição do problema</label>
        <textarea
          style={{...inp,minHeight:78,resize:"vertical",lineHeight:1.5}}
          value={form.problemaTexto}
          onChange={e=>set("problemaTexto",e.target.value)}
          placeholder="Descreva o que o paciente relatou..."
        />
      </div>

      {/* Receita dinâmica */}
      {cfg && (
        <div style={{display:"flex",alignItems:"center",gap:10,borderRadius:8,padding:"11px 13px",marginBottom:"1rem",background:cfg.receita.bg,border:`1px solid ${cfg.receita.border}`}}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={cfg.receita.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
          <div>
            <p style={{margin:0,fontSize:10,fontWeight:500,color:cfg.receita.color,textTransform:"uppercase",letterSpacing:"0.05em",opacity:.75}}>Receita gerada automaticamente</p>
            <p style={{margin:"2px 0 0",fontSize:13,fontWeight:500,color:cfg.receita.color}}>{cfg.receitaLabel}</p>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:"0.75rem",borderTop:"1px solid #f3f4f6"}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Cancelar</button>
        <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #BFDBFE",background:"#EFF6FF",color:"#1D4ED8",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"inherit"}}>
          Salvar atendimento
        </button>
      </div>
    </>
  );
}