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

    @Value("${spring.data.mongodb.uri:mongodb+srv://crimeSolver_admin:crimeSolver%402026@cluster0.hn72ik2.mongodb.net/crime_solver_db?retryWrites=true&w=majority&appName=Cluster0}")
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
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToSocketSettings(builder -> 
                        builder.connectTimeout(15, TimeUnit.SECONDS)
                               .readTimeout(15, TimeUnit.SECONDS))
                .build();

        return MongoClients.create(mongoClientSettings);
    }
}
