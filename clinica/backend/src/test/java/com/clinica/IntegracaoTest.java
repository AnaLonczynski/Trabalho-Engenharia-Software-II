package com.clinica;

import com.clinica.model.Atendimento;
import com.clinica.model.ProfissionalDeSaude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES DE INTEGRAÇÃO
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracaoTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveExecutarFluxoCompletoProfissional() throws Exception {
        // 1. CRIAR profissional
        ProfissionalDeSaude profissional = new ProfissionalDeSaude();
        profissional.setNome("Carlos Machado");
        profissional.setTelefone("31998547564");
        profissional.setCategoria("MEDICO");
        profissional.setEndereco("Rua Dom Cabral, 21");

        MvcResult result = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Carlos Machado"))
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        // 2. BUSCAR profissional criado
        mockMvc.perform(get("/api/profissionais/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value("MEDICO"));

        // 3. ATUALIZAR profissional
        profissional.setNome("Carlos Machado Silva");
        profissional.setTelefone("31900000000");

        mockMvc.perform(put("/api/profissionais/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Carlos Machado Silva"));

        // 4. DELETAR profissional
        mockMvc.perform(delete("/api/profissionais/" + id))
                .andExpect(status().isOk()); 
    }

    @Test
    void deveVincularAtendimentoAProfissional() throws Exception {
        // Criar profissional
        ProfissionalDeSaude profissional = new ProfissionalDeSaude();
        profissional.setNome("Maria Rodrigues");
        profissional.setCategoria("FISIOTERAPEUTA");

        MvcResult profResult = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(status().isCreated())
                .andReturn();

        Long profId = objectMapper.readTree(
                profResult.getResponse().getContentAsString()).get("id").asLong();

        // Criar atendimento vinculado
        String atendJson = String.format("""
            {
                "problemaTexto": "Dores na lombar",
                "data": "2026-06-20",
                "horario": "10:00",
                "profissional": {"id": %d}
            }
            """, profId);

        mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(atendJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problemaTexto").value("Dores na lombar"));
    }
}