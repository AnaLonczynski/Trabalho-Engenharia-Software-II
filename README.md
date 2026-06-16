# Trabalho-Engenharia-Software-II

# 🏥 Sistema de Gestão de Clínica de Saúde

Um sistema completo (Fullstack) desenvolvido para facilitar o gerenciamento de uma clínica de saúde. A aplicação permite cadastrar profissionais de saúde, agendar e registrar atendimentos, e vincular exames laboratoriais aos pacientes.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas e boas práticas de desenvolvimento e infraestrutura:

### **Backend**
* **Java & Spring Boot:** API RESTful robusta e escalável.
* **Maven:** Gerenciamento de dependências e automação de builds.
* **JUnit & MockMvc:** Testes unitários e de integração garantindo a qualidade do código.
* **H2 Database:** Banco de dados em memória isolado para execução rápida de testes automáticos.

### **Frontend**
* **React:** Construção da interface de usuário dinâmica.
* **Vite:** Ferramenta de build super rápida (`npm run build`).
* **Node.js:** Ambiente de execução para gerenciamento de pacotes (`npm`).

### **Banco de Dados & Infraestrutura**
* **PostgreSQL:** Banco de dados relacional oficial de produção.
* **Docker & Docker Compose:** Contêineres para orquestrar e rodar todo o ambiente localmente com um único comando.
* **GitHub Actions (CI/CD):** Pipeline de Integração Contínua que testa o Java e valida o build do React a cada push.
* **Render.com:** Hospedagem em nuvem (Cloud). Deploy automatizado condicionado ao sucesso dos testes no GitHub.

---

## ⚙️ Funcionalidades Principais

* **Profissionais de Saúde:** Cadastro, listagem e gerenciamento de médicos, fisioterapeutas, etc. (`/api/profissional_de_saude`)
* **Atendimentos:** Registro de consultas, incluindo sintomas e vinculação ao profissional responsável. (`/api/atendimentos`)
* **Exames Laboratoriais:** Criação e listagem de exames solicitados na clínica. (`/api/exame_lab`)

---

## 💻 Para Visualização acesse:
https://trabalho-engenharia-software-ii-clinica.onrender.com

## 👩‍💻 Equipe e Divisão de Papéis

Este projeto foi desenvolvido de forma colaborativa, com as responsabilidades divididas para otimizar a entrega e garantir a qualidade do código em todas as camadas da aplicação:

* **Ana Clara** - *Profissionais de Saúde*
  * Estruturação da API RESTful com Spring Boot .
  * Modelagem do banco de dados PostgreSQL.
  * Desenvolvimento da interface de usuário com React e Vite.

* **Rayssa Mell** - *Atendimentos e Exame Lab*
  * Estruturação da API RESTful com Spring Boot.
  * Modelagem do banco de dados PostgreSQL.
  * Desenvolvimento da interface de usuário com React e Vite.


