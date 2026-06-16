import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import ProfissionalDeSaudeForm from "./components/ProfissionalDeSaudeForm";
import AtendimentoForm from "./components/AtendimentosForm";
import ExameLabForm from "./components/ExameLabForm";

import { listar as listarProf, salvar as salvarProf, excluir as excluirProf } from "./services/profissionaisDeSaudeService";
import { listar as listarAtend, salvar as salvarAtend, excluir as excluirAtend } from "./services/atendimentoService";
import { listar as listarExam, salvar as salvarExam, excluir as excluirExam } from "./services/exameLabService";

const CAT_LABEL = { MEDICO:"Médico", FISIOTERAPEUTA:"Fisioterapeuta", PSICOLOGO:"Psicólogo" };
const CAT_COLORS = {
  MEDICO:         { av:{bg:"#B5D4F4",color:"#0C447C"}, badge:{bg:"#E6F1FB",color:"#0C447C",border:"#85B7EB"} },
  FISIOTERAPEUTA: { av:{bg:"#C0DD97",color:"#27500A"}, badge:{bg:"#EAF3DE",color:"#27500A",border:"#97C459"} },
  PSICOLOGO:      { av:{bg:"#CECBF6",color:"#3C3489"}, badge:{bg:"#EEEDFE",color:"#3C3489",border:"#AFA9EC"} },
};

function initials(nome){ return (nome||"?").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

function Badge({ categoria }) {
  const cc = CAT_COLORS[categoria]; if(!cc) return null;
  return <span style={{background:cc.badge.bg,color:cc.badge.color,border:`0.5px solid ${cc.badge.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:500,flexShrink:0}}>{CAT_LABEL[categoria]||categoria}</span>;
}

function Modal({ title, subtitle, onClose, children }) {
  return createPortal(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",width:520,maxWidth:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"1.25rem 1.5rem 1rem",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <p style={{margin:0,fontSize:16,fontWeight:500}}>{title}</p>
            {subtitle && <p style={{margin:"2px 0 0",fontSize:12,color:"#6b7280"}}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:20,padding:"2px 6px",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:"1.25rem 1.5rem",overflowY:"auto",flex:1}}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

function ProfCard({ p, onEdit, onDelete, onVerAtend }) {
  const cc = CAT_COLORS[p.categoria] || CAT_COLORS["Médico"];
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:cc.av.bg,color:cc.av.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,flexShrink:0}}>{initials(p.nome)}</div>
          <div>
            <p style={{margin:0,fontWeight:500,fontSize:14}}>{p.nome}</p>
            <p style={{margin:"2px 0 0",fontSize:12,color:"#6b7280"}}>{p.telefone}</p>
          </div>
        </div>
        <Badge categoria={p.categoria} />
      </div>
      {p.endereco && <p style={{margin:0,fontSize:12,color:"#9ca3af"}}>{p.endereco}</p>}
      <div style={{display:"flex",gap:6,borderTop:"1px solid #f3f4f6",paddingTop:10}}>
        <button onClick={() => onVerAtend(p)} style={btnStyle}>Atendimentos</button>
        <button onClick={() => onEdit(p)} style={btnStyle}>Editar</button>
        <button onClick={() => onDelete(p.id)} style={{...btnStyle,color:"#dc2626",borderColor:"#fca5a5"}}>Excluir</button>
      </div>
    </div>
  );
}

function AtendCard({ a, profissionais, onEdit, onDelete }) {
  const profId = a.profissional?.id || a.profissionalId;
  const prof = profissionais.find(p => String(p.id) === String(profId));
  
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <p style={{margin:0,fontWeight:500,fontSize:14}}>{a.data} às {a.horario}</p>
          {prof && <p style={{margin:"2px 0 0",fontSize:12,color:"#6b7280"}}>{prof.nome}</p>}
        </div>
        {prof && <Badge categoria={prof.categoria} />}
      </div>
      <p style={{margin:"0 0 10px",fontSize:13,color:"#6b7280",lineHeight:1.5}}>{a.problema_texto}</p>
      <div style={{display:"flex",gap:6,borderTop:"1px solid #f3f4f6",paddingTop:10}}>
        <button onClick={() => onEdit(a)} style={btnStyle}>Editar</button>
        <button onClick={() => onDelete(a.id)} style={{...btnStyle,color:"#dc2626",borderColor:"#fca5a5"}}>Excluir</button>
      </div>
    </div>
  );
}

function ExameCard({ exame, atendimentos, onEdit, onDelete }) {
  const atend = atendimentos.find(a => String(a.id) === String(exame.atendimento?.id));
  
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 16px"}}>
      <div style={{marginBottom:10}}>
        <p style={{margin:0,fontWeight:500,fontSize:14,color:"#111827"}}>{exame.descricao}</p>
        {atend ? (
          <p style={{margin:"4px 0 0",fontSize:12,color:"#6b7280"}}>
            Vinculado ao atendimento de {atend.data} às {atend.horario}
          </p>
        ) : (
          <p style={{margin:"4px 0 0",fontSize:12,color:"#9ca3af",fontStyle:"italic"}}>Sem atendimento vinculado</p>
        )}
      </div>
      <div style={{display:"flex",gap:6,borderTop:"1px solid #f3f4f6",paddingTop:10}}>
        <button onClick={() => onEdit(exame)} style={btnStyle}>Editar</button>
        <button onClick={() => onDelete(exame.id)} style={{...btnStyle,color:"#dc2626",borderColor:"#fca5a5"}}>Excluir</button>
      </div>
    </div>
  );
}

const btnStyle = {cursor:"pointer",borderRadius:7,fontSize:12,padding:"5px 11px",border:"1px solid #e5e7eb",background:"#fff",color:"#374151",fontFamily:"inherit"};

const TABS = ["profissionais","atendimentos","exames"];
const TAB_LABELS = {profissionais:"Profissionais",atendimentos:"Atendimentos",exames:"Exames Lab"};

export default function App() {
  const [tab, setTab]               = useState("profissionais");
  const [profissionais, setProf]    = useState([]);
  const [atendimentos, setAtend]    = useState([]);
  const [exames, setExam] = useState([]);
  const [modal, setModal]           = useState(null); // { tipo: "prof"|"atend"|"exame", data: obj|null }
  const [filtro, setFiltro]         = useState("");
  const [filtroCat, setFiltroCat]   = useState("");
  const [profFocus, setProfFocus]   = useState(null);
  const [erro, setErro]             = useState("");
  

  const reload = async () => {
    try { setProf(await listarProf());  } catch { setProf([]); }
    try { setAtend(await listarAtend()); } catch { setAtend([]); }
    try { setExam(await listarExam()); } catch { setExam([]); }
  };

  useEffect(() => { reload(); }, []);

  const onSaveProf = async (form) => {
    try { await salvarProf(form); await reload(); setModal(null); }
    catch { setErro("Erro ao salvar profissional."); }
  };
  const onDelProf = async (id) => {
    if(!confirm("Excluir profissional?")) return;
    await excluirProf(id); await reload();
  };
  const onSaveAtend = async (form) => {
    try { await salvarAtend(form); await reload(); setModal(null); }
    catch { setErro("Erro ao salvar atendimento."); }
  };
  const onDelAtend = async (id) => {
    if(!confirm("Excluir atendimento?")) return;
    await excluirAtend(id); await reload();
  };

  const onSaveExam = async (form) => {
    try { await salvarExam(form); await reload(); setModal(null); }
    catch { setErro("Erro ao salvar exame."); }
  };
  const onDelExam = async (id) => {
    if(!confirm("Excluir exame?")) return;
    await excluirExam(id); await reload();
  };
    

  const profFiltrados = profissionais.filter(p =>
    (!filtro || p.nome?.toLowerCase().includes(filtro.toLowerCase())) &&
    (!filtroCat || p.categoria === filtroCat)
  );
  const getProfId = (a) => {
    return a.profissionalId || a.profissional?.id || a.profissionalDeSaude?.id || a.profissional_de_saude?.id;
  };

  const atendFiltrados = profFocus
    ? atendimentos.filter(a => String(getProfId(a)) === String(profFocus.id))
    : atendimentos.filter(a => {
        if(!filtro) return true;
        const pId = getProfId(a);
        const p = profissionais.find(x => String(x.id) === String(pId));
        return a.problema_texto?.toLowerCase().includes(filtro.toLowerCase()) || p?.nome?.toLowerCase().includes(filtro.toLowerCase());
      });
      
  const stats = [
    {label:"Profissionais",   val:profissionais.length},
    {label:"Médicos",         val:profissionais.filter(p=>p.categoria==="MEDICO").length},
    {label:"Fisioterapeutas", val:profissionais.filter(p=>p.categoria==="FISIOTERAPEUTA").length},
    {label:"Psicólogos",      val:profissionais.filter(p=>p.categoria==="PSICOLOGO").length},
    {label:"Atendimentos",    val:atendimentos.length},
  ];

  const tabBtn = (t) => ({
    fontSize:13, padding:"6px 14px", borderRadius:8, cursor:"pointer", fontFamily:"inherit",
    background: tab===t ? "#EFF6FF" : "transparent",
    color:      tab===t ? "#1D4ED8" : "#6b7280",
    border:     tab===t ? "1px solid #BFDBFE" : "1px solid transparent",
    fontWeight: tab===t ? 500 : 400,
  });

  const switchTab = (t) => { setTab(t); setProfFocus(null); setFiltro(""); setFiltroCat(""); };

  const newBtnLabel = tab==="profissionais" ? "Novo profissional" : tab==="atendimentos" ? "Novo atendimento" : "Novo exame";
  const newBtnTipo  = tab==="profissionais" ? "prof" : tab==="atendimentos" ? "atend" : "exame";

  return (
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 2rem"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🏥</span>
            <span style={{fontWeight:600,fontSize:15}}>Sistema de Saúde</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            {TABS.map(t => <button key={t} style={tabBtn(t)} onClick={() => switchTab(t)}>{TAB_LABELS[t]}</button>)}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"1.25rem 2rem"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:"1.25rem"}}>
          {stats.map(s => (
            <div key={s.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px"}}>
              <p style={{margin:0,fontSize:11,color:"#6b7280"}}>{s.label}</p>
              <p style={{margin:"3px 0 0",fontSize:22,fontWeight:600,color:"#111827"}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Erro */}
        {erro && (
          <div style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:8,padding:"10px 14px",marginBottom:"1rem",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {erro}<button onClick={()=>setErro("")} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:16}}>✕</button>
          </div>
        )}

        {/* Toolbar */}
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"1rem",flexWrap:"wrap"}}>
          {profFocus && <button onClick={()=>setProfFocus(null)} style={btnStyle}>← Todos</button>}
          <input value={filtro} onChange={e=>setFiltro(e.target.value)}
            placeholder={tab==="profissionais"?"Buscar profissional...":"Buscar..."}
            style={{width:200,padding:"7px 10px",borderRadius:8,border:"1px solid #d1d5db",fontSize:13,fontFamily:"inherit"}} />
          {tab==="profissionais" && (
            <select value={filtroCat} onChange={e=>setFiltroCat(e.target.value)}
              style={{padding:"7px 10px",borderRadius:8,border:"1px solid #d1d5db",fontSize:13,fontFamily:"inherit",background:"#fff"}}>
              <option value="">Todas categorias</option>
              <option value="MEDICO">Médico</option><option value="FISIOTERAPEUTA">Fisioterapeuta</option><option value="PSICOLOGO">Psicólogo</option>
            </select>
          )}
          <div style={{flex:1}} />
          <button onClick={()=>setModal({tipo:newBtnTipo,data:null})}
            style={{background:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE",fontSize:13,padding:"7px 16px",fontWeight:500,borderRadius:8,cursor:"pointer",fontFamily:"inherit"}}>
            + {newBtnLabel}
          </button>
        </div>

        {profFocus && (
          <div style={{marginBottom:"1rem",padding:"9px 14px",background:"#F0F9FF",borderRadius:8,border:"1px solid #BAE6FD",display:"flex",gap:10,alignItems:"center",fontSize:13}}>
            <span style={{color:"#6b7280"}}>Atendimentos de:</span>
            <span style={{fontWeight:500}}>{profFocus.nome}</span>
            <Badge categoria={profFocus.categoria} />
          </div>
        )}

        {/* Listas */}
        {tab==="profissionais" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
            {profFiltrados.length===0
              ? <p style={{color:"#6b7280",fontSize:14}}>Nenhum profissional encontrado.</p>
              : profFiltrados.map(p =>
                  <ProfCard key={p.id} p={p}
                    onEdit={p=>setModal({tipo:"prof",data:p})}
                    onDelete={onDelProf}
                    onVerAtend={p=>{setProfFocus(p);setTab("atendimentos");}} />
                )}
          </div>
        )}
        {tab==="atendimentos" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
            {atendFiltrados.length===0
              ? <p style={{color:"#6b7280",fontSize:14}}>Nenhum atendimento encontrado.</p>
              : atendFiltrados.map(a =>
                  <AtendCard key={a.id} a={a} profissionais={profissionais}
                    onEdit={a=>setModal({tipo:"atend",data:a})}
                    onDelete={onDelAtend} />
                )}
          </div>
        )}
        {tab==="exames" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
            {exames.length===0
              ? <p style={{color:"#6b7280",fontSize:14}}>Nenhum exame encontrado.</p>
              : exames.map(exame => (
                  <ExameCard 
                    key={exame.id} 
                    exame={exame} 
                    atendimentos={atendimentos} // Passamos a lista de atendimentos para o card achar a referência
                    onEdit={exame => setModal({tipo:"exame",data:exame})}
                    onDelete={onDelExam} 
                  />
                ))
            }
          </div>
        )}
      </div>

      {/* Modais */}
      {modal?.tipo==="prof" && (
        <Modal title={modal.data?"Editar profissional":"Novo profissional"} subtitle="Preencha os dados" onClose={()=>setModal(null)}>
          <ProfissionalDeSaudeForm initial={modal.data} onSave={onSaveProf} onClose={()=>setModal(null)} />
        </Modal>
      )}
      {modal?.tipo==="atend" && (
        <Modal title={modal.data?"Editar atendimento":"Novo atendimento"} subtitle="Preencha os dados" onClose={()=>setModal(null)}>
          <AtendimentoForm profissionais={profissionais} initial={modal.data} onSave={onSaveAtend} onClose={()=>setModal(null)} />
        </Modal>
      )}
      {modal?.tipo==="exame" && (
        <Modal title={modal.data?"Editar exame":"Novo exame"} subtitle="Preencha os dados" onClose={()=>setModal(null)}>
          <ExameLabForm atendimentos={atendimentos} initial={modal.data} onSave={onSaveExam} onClose={()=>setModal(null)} />
        </Modal>
      )}
    </div>
  );
}