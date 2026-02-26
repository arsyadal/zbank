package com.zbank.kafka;

import com.zbank.entity.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionEventPublisher {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String TOPIC_TRANSACTION_COMPLETED = "zbank.transaction.completed";
    private static final String TOPIC_TRANSACTION_FAILED = "zbank.transaction.failed";
    
    public void publishTransactionCompleted(Transaction transaction) {
        Map<String, Object> event = new HashMap<>();
        event.put("transactionRef", transaction.getTransactionRef());
        event.put("sourceAccount", transaction.getSourceAccount());
        event.put("destinationAccount", transaction.getDestinationAccount());
        event.put("amount", transaction.getAmount());
        event.put("type", transaction.getType().name());
        event.put("status", transaction.getStatus().name());
        event.put("timestamp", transaction.getProcessedAt());
        
        kafkaTemplate.send(TOPIC_TRANSACTION_COMPLETED, transaction.getTransactionRef(), event);
        log.info("Published transaction completed event: {}", transaction.getTransactionRef());
    }
    
    public void publishTransactionFailed(Transaction transaction) {
        Map<String, Object> event = new HashMap<>();
        event.put("transactionRef", transaction.getTransactionRef());
        event.put("sourceAccount", transaction.getSourceAccount());
        event.put("destinationAccount", transaction.getDestinationAccount());
        event.put("amount", transaction.getAmount());
        event.put("type", transaction.getType().name());
        event.put("failureReason", transaction.getFailureReason());
        event.put("timestamp", transaction.getCreatedAt());
        
        kafkaTemplate.send(TOPIC_TRANSACTION_FAILED, transaction.getTransactionRef(), event);
        log.info("Published transaction failed event: {}", transaction.getTransactionRef());
    }
}
