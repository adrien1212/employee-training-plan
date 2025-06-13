package fr.adriencaubel.trainingplan.emailservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.adriencaubel.trainingplan.emailservice.dto.EmailMessageDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmailServiceApplication {
    public static void main(String[] args) throws JsonProcessingException {
        SpringApplication.run(EmailServiceApplication.class, args);
    }
}
