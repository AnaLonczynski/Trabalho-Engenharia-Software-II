import com.clinica.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findAllByOrderByDataAscHoraAsc() ;

    List<Atendimento> findByReceitaSaudeContainingIgnoreCase(String receita) ;

}

