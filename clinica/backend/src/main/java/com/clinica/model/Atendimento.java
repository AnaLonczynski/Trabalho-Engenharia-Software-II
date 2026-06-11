package com.agenda.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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

    @Column(length = 1000)
    private String problema_texto;

    @Enumerated(EnumType.STRING)
    private ReceitaSaude receitaSaude;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private ProfissionalDeSaude profissionalDeSaude;

    public enum ReceitaSaude {
        REMEDIO,
        ATIVIDADE_FISICA,
        ATIVIDADE_MENTAL,
    }


    public int getId() {
        return id.intValue();
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

    public String getProblema_Texto() {
        return problema_texto;
    }

    public void setProblema_Texto(String problema_texto) {
        this.problema_texto = problema_texto;
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
