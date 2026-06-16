import { request } from "./api";

export const listar   = ()     => request("GET",    "/exame_lab");
export const salvar   = (form) => form.id
  ? request("PUT",  `/exame_lab/${form.id}`, form)
  : request("POST", "/exame_lab", form);
export const excluir  = (id)   => request("DELETE", `/exame_lab/${id}`);