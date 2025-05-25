package fr.adriencaubel.trainingplan.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
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

    private final ConnectionFactory connectionFactory;

    @Value("${rabbitmq.exchange.email}")
    private String emailExchange;

    @Value("${rabbitmq.queue.subscription}")
    private String subscriptionQueueName;

    @Value("${rabbitmq.routing.subscription}")
    private String subscriptionRoutingKey;

    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(emailExchange);
    }

    @Bean
    public Queue subscriptionQueue() {
        return new Queue(subscriptionQueueName);
    }

    @Bean
    public Binding subscriptionBinding() {
        return BindingBuilder
                .bind(subscriptionQueue())
                .to(emailExchange())
                .with(subscriptionRoutingKey);
    }

    /**
     * Allow to send message to the queue
     */
    @Bean
    public AmqpTemplate amqpTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jacksonConverter());
        return rabbitTemplate;
    }

    @Bean
    public MessageConverter jacksonConverter() {
        return new Jackson2JsonMessageConverter();
    }

}
