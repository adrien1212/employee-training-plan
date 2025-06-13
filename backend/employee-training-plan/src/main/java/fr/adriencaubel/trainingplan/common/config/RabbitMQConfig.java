package fr.adriencaubel.trainingplan.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
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

    @Value("${rabbitmq.queue.commands}")
    private String commandsQueueName;

    @Value("${rabbitmq.routing.key.create}")
    private String commandsCreateRoutingKey;

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

    @Bean
    public TopicExchange commandsExchange() {
        return new TopicExchange(commandsExchange);
    }

    @Bean
    public Queue commandsQueueName() {
        return new Queue(commandsQueueName);
    }

    @Bean
    public Binding commandsCreateRoutingKey() {
        return BindingBuilder
                .bind(commandsQueueName())
                .to(commandsExchange())
                .with(commandsCreateRoutingKey);
    }
}
