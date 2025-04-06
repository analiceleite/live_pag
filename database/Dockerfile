FROM postgres:15

# Define variáveis de ambiente para criar o banco automaticamente
ENV POSTGRES_DB=brecho
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root

# Copia o script SQL de criação para dentro do container
COPY init.sql /docker-entrypoint-initdb.d/init.sql
