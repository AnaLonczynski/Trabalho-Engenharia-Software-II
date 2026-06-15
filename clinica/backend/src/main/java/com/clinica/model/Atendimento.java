package com.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "atendimentos")
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private LocalTime horario;

    private String problemaTexto;

    @Enumerated(EnumType.STRING)
    private ReceitaSaude receitaSaude;

    //@ManyToOne
    //@JoinColumn(name = "profissional_id")
   // private ProfissionalDeSaude profissionalDeSaude;

    public enum ReceitaSaude {
        REMEDIO,
        ATIVIDADE_FISICA,
        ATIVIDADE_MENTAL,
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHorario() {
        return horario;
    }  

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }   

    public String getProblemaTexto() {
        return problemaTexto;
    }

    public void setProblemaTexto(String problemaTexto) {
        this.problemaTexto = problemaTexto;
    }

    public ReceitaSaude getReceitaSaude() {
        return receitaSaude;
    }

    public void setReceitaSaude(ReceitaSaude receitaSaude) {
        this.receitaSaude = receitaSaude;
    }

    
    public ProfissionalDeSaude getProfissionalDeSaude() {
        return profissionalDeSaude;
    }

    public void setProfissionalDeSaude(ProfissionalDeSaude profissionalDeSaude) {
        this.profissionalDeSaude = profissionalDeSaude;
    }
    
}