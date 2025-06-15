package fr.adriencaubel.trainingplan.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.commands}")
    private String commandsExchange;

    @Value("${rabbitmq.queues.session-enrollment}")
    private String sessionEnrollmentQueue;

    @Value("${rabbitmq.routing-keys.session-enrollment}")
    private String sessionEnrollmentKey;

    @Value("${rabbitmq.queues.trainer}")
    private String trainerQueue;

    @Value("${rabbitmq.routing-keys.trainer}")
    private String trainerKey;

    @Bean
    public MessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf,
                                         MessageConverter converter) {
        RabbitTemplate tpl = new RabbitTemplate(cf);
        tpl.setMessageConverter(converter);
        return tpl;
    }

/*    @Bean
    public TopicExchange commandsExchange() {
        return new TopicExchange(commandsExchange);
    }

    @Bean
    public Queue sessionEnrollmentQueue() {
        return QueueBuilder.durable(sessionEnrollmentQueue).build();
    }

    @Bean
    public Queue trainerQueue() {
        return QueueBuilder.durable(trainerQueue).build();
    }

    @Bean
    public Binding sessionEnrollmentBinding() {
        return BindingBuilder
                .bind(sessionEnrollmentQueue())
                .to(commandsExchange())
                .with(sessionEnrollmentKey);
    }

    @Bean
    public Binding trainerBinding() {
        return BindingBuilder
                .bind(trainerQueue())
                .to(commandsExchange())
                .with(trainerKey);
    }*/
}
