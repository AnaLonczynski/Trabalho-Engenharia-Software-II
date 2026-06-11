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

}
