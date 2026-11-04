# Next E-commerce
Loja online full-stack em Next.js com carrinho, cupões de desconto, pagamentos com Stripe e painel de administração com estatísticas de vendas.  > 
## Demo

🔗 **[Ver demo](COLOCA_AQUI_O_LINK_DA_DEMO)**

## Funcionalidades

**Clientes**
- Registo, login e logout com JWT guardado num cookie (válido 7 dias) e password encriptada com bcrypt
- Navegação por categorias: Jeans, Shoes, Glasses, Jackets, Suits e Bags
- Produtos em destaque na página inicial e recomendações ("Quem comprou também levou")
- Carrinho: adicionar, remover e alterar quantidades
- Cupões de desconto: validação do código e verificação da data de validade
- Pagamento com **Stripe Checkout**
- Cupão de oferta de 10% gerado automaticamente em compras a partir de $200
- Página de compra concluída (com confetes) e página de compra cancelada

**Administração**
- Criar produtos com upload de imagem para o Cloudinary
- Listar e apagar produtos, e marcar ou desmarcar produtos em destaque
- Painel de estatísticas: utilizadores, produtos, vendas e receita, mais um gráfico de vendas dos últimos 7 dias
- Rotas de administração protegidas por perfil (`admin`)

**Desempenho**
- Os produtos em destaque ficam em cache no **Redis** (Upstash)

## Tecnologias

- **Next.js 16** (App Router + Route Handlers) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · Framer Motion · Recharts · Lucide
- **MongoDB + Mongoose**
- **Stripe** (Checkout e cupões)
- **Upstash Redis** (cache)
- **Cloudinary** (imagens)
- **jose / jsonwebtoken + bcryptjs** (autenticação)

## Como correr localmente

### Pré-requisitos

- **Node.js 20.9 ou superior**
- Uma base de dados **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- Uma conta **[Stripe](https://stripe.com)** em modo de teste
- Uma base de dados Redis no **[Upstash](https://upstash.com)**
- Uma conta **[Cloudinary](https://cloudinary.com)**

### 1. Clonar e instalar

```bash
git clone https://github.com/Cleyton-Tembe/Next-Ecommerce.git
cd Next-Ecommerce
npm install
```

### 2. Variáveis de ambiente

Cria um ficheiro `.env.local` na raiz:

```env
# Base de dados
NEXT_DB_URL=mongodb+srv://<utilizador>:<password>@<cluster>/<base-de-dados>

# Segredo usado para assinar o JWT (qualquer texto longo e aleatório)
NEXT_SECRET_TOKEN=um-segredo-longo-e-aleatorio

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_SECRET_KEY=pk_test_...   # inserir a chave PUBLICÁVEL (pk_...)

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3. Rodar

```bash
npm run dev
```

Abre `http://localhost:3000`. O Stripe está configurado para voltar a este endereço depois do pagamento.

### 4. Tornar-te administrador

Todas as contas novas são criadas com o perfil `customer`. Para aceder a `/admin`, regista-te e, no MongoDB, muda o campo `role` do teu utilizador para `"admin"`.

### Pagamentos de teste

Usa o cartão de teste do Stripe `4242 4242 4242 4242`, com qualquer data futura e qualquer CVC.

## Autor

**Cleyton Tembe** - [GitHub](https://github.com/Cleyton-Tembe)
