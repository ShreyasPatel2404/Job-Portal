package com.jobportal.service;

import com.jobportal.entity.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SalaryInsightService {

    private final MongoTemplate mongoTemplate;

    public Map<String, Object> getSalaryInsight(String skill, String location) {
        Criteria criteria = new Criteria();
        if (skill != null && !skill.isEmpty()) {
            criteria.and("skills").is(skill);
        }
        if (location != null && !location.isEmpty()) {
            criteria.and("location").regex(location, "i");
        }

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group()
                        .avg("salaryMin").as("avgMin")
                        .avg("salaryMax").as("avgMax")
                        .count().as("sampleSize")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, Job.class, Map.class);
        Map<String, Object> result = results.getUniqueMappedResult() != null 
                ? (Map<String, Object>) results.getUniqueMappedResult() 
                : Map.of("avgMin", 0.0, "avgMax", 0.0, "sampleSize", 0);
                
        return result;
    }
}
