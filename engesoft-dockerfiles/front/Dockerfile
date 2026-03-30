# imagem base
FROM node:20-alpine

# diretório dentro do container
WORKDIR /app

# copia package.json primeiro (melhor cache)
COPY package*.json ./

# instala dependências
RUN npm install

# copia o resto do projeto
COPY . .


# expõe a porta do Next
EXPOSE 3000

# comando de start
CMD ["npm", "run", "dev"]