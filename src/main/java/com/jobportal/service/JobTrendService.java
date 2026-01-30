package com.jobportal.service;

import com.jobportal.entity.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobTrendService {

    private final MongoTemplate mongoTemplate;

    public List<String> getTrendingSkills(int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("skills"),
                Aggregation.group("skills").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(limit)
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, Job.class, Map.class);
        
        return results.getMappedResults().stream()
                .map(m -> m.get("_id").toString())
                .collect(Collectors.toList());
    }
}
