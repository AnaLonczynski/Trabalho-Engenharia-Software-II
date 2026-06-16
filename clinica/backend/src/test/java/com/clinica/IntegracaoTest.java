package com.clinica;

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

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

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
        ProfissionalDeSaude profissional = new ProfissionalDeSaude();
        profissional.setNome("Carlos Machado");
        profissional.setTelefone("31998547564");
        profissional.setCategoria("MEDICO");
        profissional.setEndereco("Rua Dom Cabral, 21");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/profissional_de_saude")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nome").value("Carlos Machado"))
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(MockMvcRequestBuilders.get("/api/profissional_de_saude/" + id))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.categoria").value("MEDICO"));

        profissional.setNome("Carlos Machado Silva");
        profissional.setTelefone("31900000000");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/profissional_de_saude/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nome").value("Carlos Machado Silva"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/profissional_de_saude/" + id))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void deveVincularAtendimentoAProfissional() throws Exception {
        ProfissionalDeSaude profissional = new ProfissionalDeSaude();
        profissional.setNome("Maria Rodrigues");
        profissional.setCategoria("FISIOTERAPEUTA");

        MvcResult profResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/profissional_de_saude")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        Long profId = objectMapper.readTree(
                profResult.getResponse().getContentAsString()).get("id").asLong();

        String atendJson = String.format("""
            {
                "problemaTexto": "Dores na lombar",
                "data": "2026-06-20",
                "horario": "10:00",
                "profissionalDeSaude": {"id": %d}
            }
            """, profId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(atendJson))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.problemaTexto").value("Dores na lombar"));
    }
}