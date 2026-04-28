# EngeSoft - Sistema de Gestão de Artigos Científicos

O **EngeSoft** é uma plataforma full-stack desenvolvida para gerenciar o ciclo de vida de publicações científicas, abrangendo desde a submissão por autores até a revisão por pares e a gestão de assinaturas.

## 🚀 Tecnologias

### Frontend
- **Framework:** Next.js 16.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS e Shadcn/UI.
- **Formulários:** React Hook Form com validação Zod.

### Backend
- **Runtime:** Node.js com Express 5.
- **ORM:** Prisma.
- **Banco de Dados:** PostgreSQL 15.
- **Segurança:** Autenticação JWT e criptografia de senhas com Bcrypt.

## 🛠️ Infraestrutura e Docker

O projeto utiliza **Docker Compose** para orquestrar os seguintes serviços:

- **db-engesoft:** Banco de dados PostgreSQL.
- **back-engesoft:** API Node.js que realiza migrações automáticas do Prisma ao iniciar (`npx prisma migrate deploy`).
- **front-engesoft:** Aplicação Next.js integrada com variáveis de ambiente para serviços como Cloudinary.
- **pgadmin-engesoft:** Interface visual para administração do banco de dados.

---
📌 Desenvolvido por **Letícia Cardoso Rodrigues**
