import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const API_BASE = "http://localhost:8080/api";
const CATEGORIAS = ["Médico", "Fisioterapeuta", "Psicólogo"];
const CATEGORIA_CONFIG = {
  Médico:         { receitaTipo: "Remédio",           emoji: "🩺", desc: "Prescreve remédios" },
  Fisioterapeuta: { receitaTipo: "Atividade Física",  emoji: "🏃", desc: "Prescreve atividade física" },
  Psicólogo:      { receitaTipo: "Atividades Mentais",emoji: "🧠", desc: "Prescreve atividades mentais" },
};
const CAT_COLORS = {
  Médico:         { av:{bg:"#B5D4F4",color:"#0C447C"}, badge:{bg:"#E6F1FB",color:"#0C447C",border:"#85B7EB"}, receita:{bg:"#E6F1FB",border:"#85B7EB",color:"#0C447C"}, sel:{border:"#185FA5",bg:"#E6F1FB",radio:"#185FA5"} },
  Fisioterapeuta: { av:{bg:"#C0DD97",color:"#27500A"}, badge:{bg:"#EAF3DE",color:"#27500A",border:"#97C459"}, receita:{bg:"#EAF3DE",border:"#97C459",color:"#27500A"}, sel:{border:"#3B6D11",bg:"#EAF3DE",radio:"#3B6D11"} },
  Psicólogo:      { av:{bg:"#CECBF6",color:"#3C3489"}, badge:{bg:"#EEEDFE",color:"#3C3489",border:"#AFA9EC"}, receita:{bg:"#EEEDFE",border:"#AFA9EC",color:"#3C3489"}, sel:{border:"#534AB7",bg:"#EEEDFE",radio:"#534AB7"} },
};
const initialProf  = { nome:"", telefone:"", endereco:"", categoria:"Médico" };
const initialAtend = { data:"", horario:"", problema_texto:"", profissionalId:"" };
const inp = { width:"100%", boxSizing:"border-box", padding:"9px 12px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", fontSize:14, background:"var(--color-background-primary)", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)" };
const lbl = { display:"block", fontSize:11, fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:7 };

function initials(nome){ return (nome||"?").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

function Badge({ categoria }) {
  const cc = CAT_COLORS[categoria]; if(!cc) return null;
  return <span style={{background:cc.badge.bg,color:cc.badge.color,border:`0.5px solid ${cc.badge.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:500,flexShrink:0}}>{categoria}</span>;
}

function Radio({ selected, color }) {
  return (
    <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,border:selected?"none":`1.5px solid var(--color-border-secondary)`,background:selected?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {selected && <div style={{width:6,height:6,borderRadius:"50%",background:"white"}} />}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return createPortal(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:"var(--color-background-primary)",borderRadius:16,border:"0.5px solid var(--color-border-tertiary)",width:500,maxWidth:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"1.25rem 1.5rem 1rem",borderBottom:"0.5px solid var(--color-border-tertiary)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <p style={{margin:0,fontSize:16,fontWeight:500,color:"var(--color-text-primary)"}}>{title}</p>
            {subtitle && <p style={{margin:"2px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:18,padding:"2px 4px"}}>✕</button>
        </div>
        <div style={{padding:"1.25rem 1.5rem",overflowY:"auto",flex:1}}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

function ProfissionalForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || initialProf);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const cc = CAT_COLORS[form.categoria] || CAT_COLORS["Médico"];
  return (
    <>
      <div style={{marginBottom:"1.2rem"}}>
        <span style={lbl}>Categoria</span>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {CATEGORIAS.map(cat => {
            const sel = form.categoria === cat;
            const c = CAT_COLORS[cat];
            const cfg = CATEGORIA_CONFIG[cat];
            return (
              <div key={cat} onClick={()=>set("categoria",cat)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",border:sel?`1.5px solid ${c.sel.border}`:"0.5px solid var(--color-border-tertiary)",background:sel?c.sel.bg:"var(--color-background-primary)"}}>
                <Radio selected={sel} color={c.sel.radio} />
                <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:c.av.bg,color:c.av.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{cfg.emoji}</div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{cat}</p>
                  <p style={{margin:"1px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{cfg.desc}</p>
                </div>
                <Badge categoria={cat} />
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
        <div>
          <label style={lbl}>Telefone</label>
          <input style={inp} value={form.telefone} onChange={e=>set("telefone",e.target.value)} placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label style={lbl}>Endereço</label>
          <input style={inp} value={form.endereco} onChange={e=>set("endereco",e.target.value)} placeholder="Rua, nº, cidade" />
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:"1rem",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={()=>onSave(form)} style={{background:cc.sel.bg,color:cc.receita.color,border:`0.5px solid ${cc.sel.border}`,fontWeight:500}}>Salvar profissional</button>
      </div>
    </>
  );
}

function AtendimentoForm({ profissionais, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || initialAtend);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const profSel = profissionais.find(p=>String(p.id)===String(form.profissionalId));
  const receitaTipo   = profSel ? CATEGORIA_CONFIG[profSel.categoria]?.receitaTipo : null;
  const receitaColors = profSel ? CAT_COLORS[profSel.categoria]?.receita : null;
  return (
    <>
      <div style={{marginBottom:"1.2rem"}}>
        <span style={lbl}>Profissional responsável</span>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {profissionais.length === 0 && <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>Nenhum profissional cadastrado.</p>}
          {profissionais.map(p => {
            const sel = String(p.id)===String(form.profissionalId);
            const cc = CAT_COLORS[p.categoria]||CAT_COLORS["Médico"];
            return (
              <div key={p.id} onClick={()=>set("profissionalId",p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",border:sel?`1.5px solid ${cc.sel.border}`:"0.5px solid var(--color-border-tertiary)",background:sel?cc.sel.bg:"var(--color-background-primary)"}}>
                <Radio selected={sel} color={cc.sel.radio} />
                <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,background:cc.av.bg,color:cc.av.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500}}>{initials(p.nome)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>{p.nome}</p>
                  <p style={{margin:"1px 0 0",fontSize:12,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.telefone}{p.endereco?` · ${p.endereco}`:""}</p>
                </div>
                <Badge categoria={p.categoria} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.1rem"}}>
        <div><label style={lbl}>Data</label><input style={inp} type="date" value={form.data} onChange={e=>set("data",e.target.value)} /></div>
        <div><label style={lbl}>Horário</label><input style={inp} type="time" value={form.horario} onChange={e=>set("horario",e.target.value)} /></div>
      </div>
      <div style={{marginBottom:"1.1rem"}}>
        <label style={lbl}>Descrição do problema</label>
        <textarea style={{...inp,minHeight:80,resize:"vertical",lineHeight:1.5}} value={form.problema_texto} onChange={e=>set("problema_texto",e.target.value)} placeholder="Descreva o que o paciente relatou..." />
      </div>
      {receitaTipo && receitaColors && (
        <div style={{display:"flex",alignItems:"center",gap:10,borderRadius:8,padding:"12px 14px",marginBottom:"1rem",background:receitaColors.bg,border:`0.5px solid ${receitaColors.border}`}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={receitaColors.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          <div>
            <p style={{margin:0,fontSize:11,fontWeight:500,color:receitaColors.color,textTransform:"uppercase",letterSpacing:"0.05em",opacity:0.75}}>Receita gerada</p>
            <p style={{margin:"2px 0 0",fontSize:14,fontWeight:500,color:receitaColors.color}}>{receitaTipo}</p>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:"0.75rem",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={()=>onSave(form)} style={{background:"#E6F1FB",color:"#0C447C",border:"0.5px solid #185FA5",fontWeight:500}}>Salvar atendimento</button>
      </div>
    </>
  );
}

function ProfissionalCard({ p, onEdit, onDelete, onVerAtendimentos }) {
  const cc = CAT_COLORS[p.categoria]||CAT_COLORS["Médico"];
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1rem 1.25rem",display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:cc.av.bg,color:cc.av.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,flexShrink:0}}>{initials(p.nome)}</div>
          <div>
            <p style={{margin:0,fontWeight:500,fontSize:15,color:"var(--color-text-primary)"}}>{p.nome}</p>
            <p style={{margin:"2px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{p.telefone}</p>
          </div>
        </div>
        <Badge categoria={p.categoria} />
      </div>
      {p.endereco && <p style={{margin:0,fontSize:12,color:"var(--color-text-tertiary)"}}>{p.endereco}</p>}
      <div style={{display:"flex",gap:6,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:10}}>
        <button onClick={()=>onVerAtendimentos(p)} style={{fontSize:12}}>Atendimentos</button>
        <button onClick={()=>onEdit(p)} style={{fontSize:12}}>Editar</button>
        <button onClick={()=>onDelete(p.id)} style={{fontSize:12,color:"var(--color-text-danger)",borderColor:"var(--color-border-danger)"}}>Excluir</button>
      </div>
    </div>
  );
}

function AtendimentoCard({ a, profissionais, onEdit, onDelete }) {
  const prof = profissionais.find(p=>String(p.id)===String(a.profissionalId));
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1rem 1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <p style={{margin:0,fontWeight:500,fontSize:14,color:"var(--color-text-primary)"}}>{a.data} às {a.horario}</p>
          {prof && <p style={{margin:"2px 0 0",fontSize:12,color:"var(--color-text-secondary)"}}>{prof.nome}</p>}
        </div>
        {prof && <Badge categoria={prof.categoria} />}
      </div>
      <p style={{margin:"0 0 10px",fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.5}}>{a.problema_texto}</p>
      <div style={{display:"flex",gap:6,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:10}}>
        <button onClick={()=>onEdit(a)} style={{fontSize:12}}>Editar</button>
        <button onClick={()=>onDelete(a.id)} style={{fontSize:12,color:"var(--color-text-danger)",borderColor:"var(--color-border-danger)"}}>Excluir</button>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("profissionais");
  const [profissionais, setProfissionais] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [modal, setModal] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [filtroCat, setFiltroCat] = useState("");
  const [profFocus, setProfFocus] = useState(null);
  const [erro, setErro] = useState("");

  const fetchProfissionais = async () => { try { const r = await fetch(`${API_BASE}/profissionais`); if(r.ok) setProfissionais(await r.json()); } catch { setProfissionais([]); } };
  const fetchAtendimentos  = async () => { try { const r = await fetch(`${API_BASE}/atendimentos`);  if(r.ok) setAtendimentos(await r.json());  } catch { setAtendimentos([]);  } };
  useEffect(() => { fetchProfissionais(); fetchAtendimentos(); }, []);

  const saveProfissional = async (form) => {
    try {
      const method = form.id?"PUT":"POST";
      const url = form.id?`${API_BASE}/profissionais/${form.id}`:`${API_BASE}/profissionais`;
      const r = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!r.ok) throw new Error();
      await fetchProfissionais(); setModal(null);
    } catch { setErro("Erro ao salvar profissional."); }
  };
  const deleteProfissional = async (id) => {
    if(!confirm("Excluir profissional?")) return;
    await fetch(`${API_BASE}/profissionais/${id}`,{method:"DELETE"}); await fetchProfissionais();
  };
  const saveAtendimento = async (form) => {
    try {
      const method = form.id?"PUT":"POST";
      const url = form.id?`${API_BASE}/atendimentos/${form.id}`:`${API_BASE}/atendimentos`;
      const r = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!r.ok) throw new Error();
      await fetchAtendimentos(); setModal(null);
    } catch { setErro("Erro ao salvar atendimento."); }
  };
  const deleteAtendimento = async (id) => {
    if(!confirm("Excluir atendimento?")) return;
    await fetch(`${API_BASE}/atendimentos/${id}`,{method:"DELETE"}); await fetchAtendimentos();
  };

  const profFiltrados = profissionais.filter(p=>(!filtro||p.nome.toLowerCase().includes(filtro.toLowerCase()))&&(!filtroCat||p.categoria===filtroCat));
  const atendFiltrados = profFocus
    ? atendimentos.filter(a=>String(a.profissionalId)===String(profFocus.id))
    : atendimentos.filter(a=>{ if(!filtro) return true; const p=profissionais.find(p=>String(p.id)===String(a.profissionalId)); return a.problema_texto?.toLowerCase().includes(filtro.toLowerCase())||p?.nome?.toLowerCase().includes(filtro.toLowerCase()); });

  const stats = [
    {label:"Profissionais",   val:profissionais.length},
    {label:"Médicos",         val:profissionais.filter(p=>p.categoria==="Médico").length},
    {label:"Fisioterapeutas", val:profissionais.filter(p=>p.categoria==="Fisioterapeuta").length},
    {label:"Psicólogos",      val:profissionais.filter(p=>p.categoria==="Psicólogo").length},
    {label:"Atendimentos",    val:atendimentos.length},
  ];

  const barStyle = (t) => ({fontSize:13,padding:"6px 14px",borderRadius:8,background:tab===t?"var(--color-background-info)":"transparent",color:tab===t?"var(--color-text-info)":"var(--color-text-secondary)",border:tab===t?"0.5px solid var(--color-border-info)":"0.5px solid transparent",cursor:"pointer"});

  return (
    <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)",fontFamily:"var(--font-sans)"}}>
      <div style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"0 2rem"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>🏥</span>
            <span style={{fontWeight:500,fontSize:15,color:"var(--color-text-primary)"}}>Sistema de Saúde</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button style={barStyle("profissionais")} onClick={()=>{setTab("profissionais");setProfFocus(null);setFiltro("");setFiltroCat("");}}>Profissionais</button>
            <button style={barStyle("atendimentos")}  onClick={()=>{setTab("atendimentos"); setProfFocus(null);setFiltro("");setFiltroCat("");}}>Atendimentos</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"1.5rem 2rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:"1.5rem"}}>
          {stats.map(s=>(
            <div key={s.label} style={{background:"var(--color-background-secondary)",borderRadius:8,padding:"12px 14px"}}>
              <p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)"}}>{s.label}</p>
              <p style={{margin:"4px 0 0",fontSize:24,fontWeight:500,color:"var(--color-text-primary)"}}>{s.val}</p>
            </div>
          ))}
        </div>

        {erro && (
          <div style={{background:"var(--color-background-danger)",color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",borderRadius:8,padding:"10px 14px",marginBottom:"1rem",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {erro}<button onClick={()=>setErro("")} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:16}}>✕</button>
          </div>
        )}

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"1rem",flexWrap:"wrap"}}>
          {profFocus && <button onClick={()=>setProfFocus(null)} style={{fontSize:13}}>← Todos</button>}
          <input style={{width:220,boxSizing:"border-box",padding:"7px 10px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",fontSize:13,background:"var(--color-background-primary)",color:"var(--color-text-primary)"}} value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder={tab==="profissionais"?"Buscar por nome...":"Buscar atendimento..."} />
          {tab==="profissionais" && (
            <select style={{padding:"7px 10px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",fontSize:13,background:"var(--color-background-primary)",color:"var(--color-text-primary)"}} value={filtroCat} onChange={e=>setFiltroCat(e.target.value)}>
              <option value="">Todas categorias</option>
              {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
            </select>
          )}
          <div style={{flex:1}} />
          <button onClick={()=>setModal(tab==="profissionais"?{tipo:"prof",data:null}:{tipo:"atend",data:null})} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",fontSize:13,padding:"7px 16px",fontWeight:500,borderRadius:8,cursor:"pointer"}}>
            + {tab==="profissionais"?"Novo profissional":"Novo atendimento"}
          </button>
        </div>

        {profFocus && (
          <div style={{marginBottom:"1rem",padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:8,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>Atendimentos de:</span>
            <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{profFocus.nome}</span>
            <Badge categoria={profFocus.categoria} />
          </div>
        )}

        {tab==="profissionais" ? (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {profFiltrados.length===0 ? <p style={{color:"var(--color-text-secondary)",fontSize:14}}>Nenhum profissional encontrado.</p>
              : profFiltrados.map(p=><ProfissionalCard key={p.id} p={p} onEdit={p=>setModal({tipo:"prof",data:p})} onDelete={deleteProfissional} onVerAtendimentos={p=>{setProfFocus(p);setTab("atendimentos");}} />)}
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
            {atendFiltrados.length===0 ? <p style={{color:"var(--color-text-secondary)",fontSize:14}}>Nenhum atendimento encontrado.</p>
              : atendFiltrados.map(a=><AtendimentoCard key={a.id} a={a} profissionais={profissionais} onEdit={a=>setModal({tipo:"atend",data:a})} onDelete={deleteAtendimento} />)}
          </div>
        )}
      </div>

      {modal?.tipo==="prof" && (
        <Modal title={modal.data?"Editar profissional":"Novo profissional"} subtitle="Preencha os dados do profissional" onClose={()=>setModal(null)}>
          <ProfissionalForm initial={modal.data} onSave={saveProfissional} onClose={()=>setModal(null)} />
        </Modal>
      )}
      {modal?.tipo==="atend" && (
        <Modal title={modal.data?"Editar atendimento":"Novo atendimento"} subtitle="Preencha os dados do atendimento" onClose={()=>setModal(null)}>
          <AtendimentoForm profissionais={profissionais} initial={modal.data} onSave={saveAtendimento} onClose={()=>setModal(null)} />
        </Modal>
      )}
    </div>
  );
}