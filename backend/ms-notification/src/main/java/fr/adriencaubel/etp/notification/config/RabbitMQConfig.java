package fr.adriencaubel.etp.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * commands exchange = for receiving notification creation events published by the core application.
 * execution exchange = used to dispatch delayed notification messages back into the execution queue for scheduled processing
 */
@Configuration
@EnableRabbit
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

    @Value("${rabbitmq.queues.slot-signature}")
    private String slotSignatureQueue;

    @Value("${rabbitmq.routing-keys.slot-signature}")
    private String slotSignatureKey;

    @Bean
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
    public Queue slotSignatureQueue() { return QueueBuilder.durable(slotSignatureQueue).build(); }

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
    }

    @Bean
    public Binding slotSignatureBinding() {
        return BindingBuilder
                .bind(slotSignatureQueue())
                .to(commandsExchange())
                .with(slotSignatureKey);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory cf
    ) {
        SimpleRabbitListenerContainerFactory factory =
                new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(cf);
        factory.setMessageConverter(messageConverter());
        return factory;
    }
}