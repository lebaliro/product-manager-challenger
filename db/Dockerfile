# This is installing the pgvector extension for postgres

FROM postgres:17

# Update package lists and install necessary dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  git \
  postgresql-server-dev-all
# Clone the pgvector and pgai repositories
WORKDIR /tmp
RUN git clone https://github.com/pgvector/pgvector.git

# Build and install pgvector
WORKDIR /tmp/pgvector
RUN make
RUN make install
