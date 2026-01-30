package com.jobportal.aspect;

import com.jobportal.annotation.MonitoredAI;
import com.jobportal.dto.ChatResponse;
import com.jobportal.entity.AILog;
import com.jobportal.entity.User;
import com.jobportal.repository.AILogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AILoggingAspect {

    private final AILogRepository aiLogRepository;

    @Around("@annotation(monitoredAI)")
    public Object logAI(ProceedingJoinPoint joinPoint, MonitoredAI monitoredAI) throws Throwable {
        long start = System.currentTimeMillis();
        String userId = "anonymous";
        String userRole = "unknown";
        String userQuery = "";

        // Attempt to extract user info from arguments
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof User user) {
                userId = user.getId();
                userRole = user.getAccountType().name();
            } else if (arg instanceof String query) {
                userQuery = query;
            }
        }

        Object result = null;
        boolean success = false;
        String errorMessage = null;

        try {
            result = joinPoint.proceed();
            success = true;
            return result;
        } catch (Exception e) {
            errorMessage = e.getMessage();
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - start;
            
            String intent = "UNKNOWN";
            String responseText = "";
            
            if (result instanceof ChatResponse chatResponse) {
                intent = chatResponse.getIntent().name();
                responseText = chatResponse.getMessage();
            }

            AILog aiLog = AILog.builder()
                    .userId(userId)
                    .userRole(userRole)
                    .userQuery(userQuery)
                    .aiIntent(intent)
                    .aiResponse(responseText)
                    .responseTimeMs(duration)
                    .success(success)
                    .errorMessage(errorMessage)
                    .createdAt(LocalDateTime.now())
                    .build();

            aiLogRepository.save(aiLog);
            log.info("AI Interaction Logged: UserID={}, Intent={}, Duration={}ms, Success={}", 
                    userId, intent, duration, success);
        }
    }
}
