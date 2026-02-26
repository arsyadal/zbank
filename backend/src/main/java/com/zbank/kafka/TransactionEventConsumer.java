package com.zbank.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "zbank.transaction.completed", groupId = "zbank-websocket-group")
    public void handleTransactionCompleted(Map<String, Object> event) {
        log.info("Received transaction completed event: {}", event.get("transactionRef"));
        sendToAccounts(event);
    }

    @KafkaListener(topics = "zbank.transaction.failed", groupId = "zbank-websocket-group")
    public void handleTransactionFailed(Map<String, Object> event) {
        log.info("Received transaction failed event: {}", event.get("transactionRef"));
        sendToAccounts(event);
    }

    private void sendToAccounts(Map<String, Object> event) {
        String sourceAccount = (String) event.get("sourceAccount");
        String destinationAccount = (String) event.get("destinationAccount");

        if (sourceAccount != null && !sourceAccount.equals("EXTERNAL")) {
            messagingTemplate.convertAndSend("/topic/transactions/" + sourceAccount, event);
        }
        if (destinationAccount != null) {
            messagingTemplate.convertAndSend("/topic/transactions/" + destinationAccount, event);
        }
    }
}
