import { request } from "./api";

const PATH = "/profissional_de_saude";

export const listar        = ()     => request("GET",    PATH);
export const buscarPorId   = (id)   => request("GET",    `${PATH}/${id}`);
export const buscarPorNome = (nome) => request("GET",    `${PATH}/buscar?nome=${encodeURIComponent(nome)}`);
export const buscarPorCat  = (cat)  => request("GET",    `${PATH}/categoria/${encodeURIComponent(cat)}`);
export const salvar        = (form) => form.id
  ? request("PUT",  `${PATH}/${form.id}`, form)
  : request("POST", PATH, form);
export const excluir       = (id)   => request("DELETE", `${PATH}/${id}`);