package org.fhir.auth;


import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.eclipse.microprofile.config.ConfigProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.utility.MountableFile;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/** @noinspection resource*/
public class HapiTestResourceLifecycleManager implements QuarkusTestResourceLifecycleManager {

    private static GenericContainer<?> hapiContainer;

    public HapiTestResourceLifecycleManager() {
    }

    private final static Logger LOGGER = LoggerFactory.getLogger(HapiTestResourceLifecycleManager.class);

    @Override
    public Map<String, String> start() {
        Slf4jLogConsumer logConsumer = new Slf4jLogConsumer(LOGGER).withSeparateOutputStreams();
        hapiContainer = new GenericContainer<>("hapiproject/hapi:v6.10.1")
                .withCopyFileToContainer(MountableFile.forClasspathResource("fhir-configs/irccs-application.yaml", 484), "/data/hapi/irccs-application.yaml")
                .withEnv("SPRING_CONFIG_LOCATION", "file:///data/hapi/irccs-application.yaml")
                .withExposedPorts(8080)
                .waitingFor(Wait.forLogMessage(".*Started Application.*", 1))
                .withStartupTimeout(Duration.ofMinutes(10));

        hapiContainer.start();
        hapiContainer.followOutput(logConsumer);

        Map<String, String> conf = new HashMap<>();
        conf.put("quarkus.testcontainers.hapi.port", hapiContainer.getFirstMappedPort().toString());
        return conf;
    }

    @Override
    public void stop() {
        hapiContainer.stop();
    }

    protected static String getHapiPort(){
        return ConfigProvider.getConfig().getConfigValue("quarkus.testcontainers.hapi.port").getValue();
    }
}
