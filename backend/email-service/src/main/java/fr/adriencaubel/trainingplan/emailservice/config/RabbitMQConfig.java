package fr.adriencaubel.trainingplan.emailservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.email}")
    private String emailExchange;

    @Value("${rabbitmq.queue.subscription}")
    private String subscriptionQueue;

    @Value("${rabbitmq.routing.subscription}")
    private String subscriptionRoutingKey;

    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange(emailExchange);
    }

    @Bean
    public Queue subscriptionQueue() {
        return QueueBuilder.durable(subscriptionQueue).build();
    }

    @Bean
    public Binding subscriptionBinding() {
        return BindingBuilder
                .bind(subscriptionQueue())
                .to(emailExchange())
                .with(subscriptionRoutingKey);
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
}
