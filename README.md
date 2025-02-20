# Visão Geral
Um pequeno projeto voltado para gerenciar produtos integrados com a IA Gemine.

Para mais informações do projeto, como requisitos do sistema, fluxos do sistema e regras de negócio segue o [link do figma](https://www.figma.com/board/F3QeGaJpgPVWaeVSzWdFvz/product-manager?node-id=0-1&p=f&t=JdkOrilX5eSDLrx6-0).

# Tecnologias
#### Back-end:
- NestJs
- DockerFile
- Jest / SuperTest
- Gemine IA
- Passport | Apikey Auth
- Prisma
#### Infra:
- Cloud Run e Cloud SQL
- GitHub Actions

# Testando o Projeto


# Back-end
A api pode ser testada de **duas formas** distintas: 

1. **Utilizando o Postman com a Cloud Run do Google**  
   O projeto já está em execução na **Cloud Run**, o que significa que você não precisa clonar ou configurar o ambiente localmente para começar a testá-lo. Basta acessar [esse link do Postman](https://www.postman.com/orbital-module-observer-12483690/product-manager-api/collection/39881858-41abad9a-a98c-4c5a-8970-ed3b677276ab) e utilizar a **collection de staging** para realizar os testes diretamente no ambiente hospedado.

2. **Rodando Localmente com Docker Compose**  
   Se preferir, você também pode rodar o projeto localmente utilizando o **Docker Compose**. Para isso, será necessário configurar as variáveis de ambiente e seguir os passos descritos abaixo.

---

# Como Rodar o Projeto Localmente

Se optar por rodar o projeto localmente, siga os passos abaixo:

### 1. Clone o repositório e acesse o diretório:
```bash
git clone https://github.com/lebaliro/product-manager-challenger.git
cd product-manager-challenger
```

### 2. Configurações

Para rodar a api localmente, é necessário configurar os arquivos `.env` e `.env.test` que se encontram dentro da pasta `/product-manager-api`. Abaixo estão os dados necessários para essas configurações, exceto pela **API Key do Gemine**, que precisará ser criada por você.

### Criando uma API Key
Você pode criar sua própria API Key acessando [esse link](https://aistudio.google.com/app/apikey?hl=pt-br).

### Exemplo de `.env`
```env
GEMINE_API_KEY= # Insira sua chave aqui
POSTGRES_USER=product-manager-api
POSTGRES_PASSWORD=12345678
DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager?schema=public"
TEST_DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager-test?schema=public"
SALT_TO_API_KEY=kSkmSlkmd2M4emKM4dbPOE453UEhGLqÇ-
```

### Exemplo de `.env.test`
```env
TEST_DATABASE_URL="postgresql://product-manager-api:12345678@postgres:5432/product-manager-test?schema=public"
```

> **Nota:** Certifique-se de ter o [Docker](https://docs.docker.com/manuals/) instalado em sua máquina antes de prosseguir.


### 3. Suba os containers usando o Docker Compose:
```bash
docker compose -f 'compose.yaml' up -d --build
```

### 4. Verifique se os containers estão em execução:
```bash
docker ps
```

![image](https://github.com/user-attachments/assets/c73b004e-4b21-4cab-a6c2-d57113e03837)

Com os containers em execução, você poderá começar a fazer requisições ao sistema.

---

# Utilizando o Postman

Independente da forma escolhida (Cloud Run ou local), você pode utilizar o **Postman** para testar as rotas da API. Disponibilizamos uma [collection do Postman](https://www.postman.com/orbital-module-observer-12483690/product-manager-api/folder/4smew0y/auth) para facilitar esse processo.

### Passo a Passo no Postman:

1. **Baixe o Desktop Agent do Postman** e faça um fork da nossa collection:
   
   ![image](https://github.com/user-attachments/assets/91aef5ce-6636-4191-9c88-5d68d6f9bedc)

2. **Realize o cadastro de um usuário**:
   - Acesse o módulo `auth > signup` e faça a requisição.
   - Será retornado uma **API Key**.

   ![image](https://github.com/user-attachments/assets/4a4d9a9b-3ccd-410d-a68f-51b8abafbbf8)

3. **Configure a API Key na Collection**:
   Copie a API Key retornada e adicione-a na aba de **Authorization** da collection.
   Isso garantirá que você tenha autorização para acessar todas as rotas da API
   
  ![image](https://github.com/user-attachments/assets/36657696-e9f8-4185-9092-375e3346f4da)

---

# Fluxo do Sistema

O fluxo completo do sistema pode ser consultado no Figma. As imagens fornecidas acima ajudam a entender como as requisições devem ser feitas e como configurar o ambiente corretamente.

---

Agora você está pronto para testar o projeto tanto na **Cloud Run** quanto **localmente**!
