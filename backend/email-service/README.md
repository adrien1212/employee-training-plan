# Email Service with RabbitMQ

Spring Boot application that listens to RabbitMQ queue for email messages and sends emails.

## Features

- RabbitMQ listener for email subscription queue
- Email sending with support for:
  - HTML and plain text emails
  - CC and BCC recipients
  - File attachments
- Retry mechanism for failed messages
- Comprehensive logging

## Configuration

### RabbitMQ Settings
- Exchange: `email.exchange`
- Queue: `email.subscription`
- Routing Key: `subscription`

### Environment Variables
Set the following environment variables for email configuration:
- `MAIL_USERNAME`: Your email address
- `MAIL_PASSWORD`: Your email app password

## Running the Application

1. Start RabbitMQ server
2. Set environment variables for email configuration
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Message Format

The listener expects JSON messages in the following format:

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "isHtml": false,
  "cc": ["cc1@example.com", "cc2@example.com"],
  "bcc": ["bcc@example.com"],
  "attachments": [
    {
      "fileName": "document.pdf",
      "contentType": "application/pdf",
      "content": "base64-encoded-content"
    }
  ]
}
```

## Testing

Send a test message to the RabbitMQ queue to verify the listener is working:

```bash
# Using RabbitMQ Management UI or CLI tools
rabbitmqadmin publish exchange=email.exchange routing_key=subscription payload='{"to":"test@example.com","subject":"Test","body":"Hello World","isHtml":false}'
```

## Dependencies

- Spring Boot Starter Web
- Spring Boot Starter AMQP (RabbitMQ)
- Spring Boot Starter Mail
- Lombok
- Jackson (JSON processing)

## Error Handling

- Messages with missing 'to' field are rejected
- Failed email sending triggers retry mechanism (3 attempts)
- All errors are logged with detailed information
