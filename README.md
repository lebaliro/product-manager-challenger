# Visão Geral
Um pequeno projeto voltado para gerenciar produtos integrados com a IA Gemine.

Para mais informações do projeto, como requisitos do sistema, fluxos do sistema e regras de negócio segue o [link do figma](https://www.figma.com/board/F3QeGaJpgPVWaeVSzWdFvz/product-manager?node-id=0-1&p=f&t=JdkOrilX5eSDLrx6-0).

# Tecnologias
- NestJs
- DockerFile
- Jest / SuperTest
- Gemine IA
- Passport | Apikey Auth
- Prisma

# Testando o Projeto
Não é necessário clonar e rodar o projeto localmente pois ele está sendo executado em uma Cloud Run do google. Basta apenas acessar [esse link do postman] e fazer os testes utilizando a collection de staging.

# Configurações
Para rodar o projeto é necessário configurar a `.env` e a `.env.test`. Estarei disponibilizando todos os dados das envs, menos para a api key do Gemine, nesse caso, será necessário criar uma.
Para criar uma api key você pode acessar [esse link](https://aistudio.google.com/app/apikey?hl=pt-br).

```env
GEMINE_API_KEY=

POSTGRES_USER=product-manager-api
POSTGRES_PASSWORD=12345678
DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager?schema=public"
TEST_DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager-test?schema=public"

SALT_TO_API_KEY=kSkmSlkmd2M4emKM4dbPOE453UEhGLqÇ-
```

```env.test
TEST_DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager-test?schema=public"
```

Será necessário possuir o [docker](https://docs.docker.com/manuals/) instalado na sua máquina.

# Como rodar o projeto
Primeiro vamos clonar o repositório e acessá-lo:

```git
git clone https://github.com/lebaliro/product-manager-challenger.git
cd product-manager-challenger
```

Agora vamos rodar o código para subir os containers e depois verificar se estão executando.

```bash
docker compose -f 'compose.yaml' up -d --build
docker ps
``` 

![image](https://github.com/user-attachments/assets/c73b004e-4b21-4cab-a6c2-d57113e03837)

Com os containers em execução podemos começar a fazer as requisições, disponibilizo uma [collection do postman](https://www.postman.com/orbital-module-observer-12483690/product-manager-api/folder/4smew0y/auth) para facilitar essas requisições, pode ser utilizado junto com o fluxo do sistema no figma.

# Utilizando o postman
Você precisará baixar o desktop agent do postman e fazer um fork da minha collection:
![image](https://github.com/user-attachments/assets/91aef5ce-6636-4191-9c88-5d68d6f9bedc)

Após isso, vá no módulo de auth > signup e faça a requisição, será retornado a apikey
![image](https://github.com/user-attachments/assets/4a4d9a9b-3ccd-410d-a68f-51b8abafbbf8)

Pega essa apikey e adicione na authorization da collection, assim você tera authorização para todas as rotas
![image](https://github.com/user-attachments/assets/36657696-e9f8-4185-9092-375e3346f4da)

