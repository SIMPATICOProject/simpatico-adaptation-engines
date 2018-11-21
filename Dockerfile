FROM openjdk:8-jdk

WORKDIR /app

ADD . /app
COPY docker-configs/application.properties src/main/resources/application.properties

EXPOSE 8080
CMD ./mvnw package -Dmaven.test.skip=true && cd target && java -jar simpatico-adaptation-engines.jar
