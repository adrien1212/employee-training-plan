package fr.adriencaubel.notification.config;

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

    @Value("${rabbitmq.exchange.exec}")
    private String execExchange;

    @Value("${rabbitmq.queue.commands}")
    private String commandsQueue;

    @Value("${rabbitmq.queue.exec}")
    private String execQueue;

    @Value("${rabbitmq.routing.key.create}")
    private String createRoutingKey;

    @Value("${rabbitmq.routing.key.exec}")
    private String execRoutingKey;

    @Bean
    public TopicExchange commandsExchange() {
        return new TopicExchange(commandsExchange);
    }

    @Bean
    public TopicExchange execExchange() {
        return new TopicExchange(execExchange);
    }

    @Bean
    public Queue commandsQueue() {
        return QueueBuilder.durable(commandsQueue).build();
    }

    @Bean
    public Queue execQueue() {
        return QueueBuilder.durable(execQueue).build();
    }

    @Bean
    public Binding commandCreateBinding() {
        return BindingBuilder
                .bind(commandsQueue())
                .to(commandsExchange())
                .with(createRoutingKey);
    }

    @Bean
    public Binding execBinding() {
        return BindingBuilder
                .bind(execQueue())
                .to(execExchange())
                .with(execRoutingKey);
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