FROM eclipse-temurin:21-jre-ubi9-minimal
WORKDIR /app
ARG folder
COPY $folder/quarkus-app/ /app/
RUN microdnf install -y dos2unix iputils procps nano

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'COMPONENTPATH=/app/quarkus-run.jar' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'until [ "$(curl -s -w '%{http_code}' -o /dev/null "http://fhir:8080/fhir/metadata")" -eq 200 ]' >> /app/start.sh && \
    echo 'do' >> /app/start.sh && \
    echo '  echo "I'\''m waiting for the FHIR Server is up...";' >> /app/start.sh && \
    echo '  sleep 5' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ -f "$COMPONENTPATH" ]; then' >> /app/start.sh && \
    echo '    echo "Starting service"' >> /app/start.sh && \
    echo '    nohup java -jar $COMPONENTPATH &' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'tail -f /dev/null' >> /app/start.sh

RUN dos2unix /app/start.sh
RUN chmod +x /app/start.sh
CMD ["bash","/app/start.sh"]
