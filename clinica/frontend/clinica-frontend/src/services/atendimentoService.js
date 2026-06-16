import { request } from "./api";

export const listar   = ()     => request("GET",    "/atendimentos");
export const salvar   = (form) => form.id
  ? request("PUT",  `/atendimentos/${form.id}`, form)
  : request("POST", "/atendimentos", form);
export const excluir  = (id)   => request("DELETE", `/atendimentos/${id}`);