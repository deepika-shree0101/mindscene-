package com.mysterygame.servicebackend.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:${MONGODB_URI:}}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:crime_solver_db}")
    private String databaseName;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        if (mongoUri == null || mongoUri.trim().isEmpty()) {
            throw new IllegalStateException("MongoDB URI is not configured! Please check your .env file or MONGODB_URI environment variable.");
        }

        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings mongoSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToSocketSettings(builder -> 
                        builder.connectTimeout(15, TimeUnit.SECONDS)
                               .readTimeout(15, TimeUnit.SECONDS))
                .build();

        return MongoClients.create(mongoSettings);
    }
}
