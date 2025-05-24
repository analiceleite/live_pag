FROM postgres:15

ENV POSTGRES_DB=brecho
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root

COPY init.sql /docker-entrypoint-initdb.d/init.sql
    