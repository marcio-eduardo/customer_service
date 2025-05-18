# Use a imagem base oficial do Node
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta 5173
EXPOSE 5173

# Comando para rodar a aplicação
CMD ["npm", "run", "dev", "--", "--host"]