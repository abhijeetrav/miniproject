

# Stage 1 — builder
FROM node:18-alpine AS builder
WORKDIR /app

# add build tools if native modules are needed (uncomment if needed)
# RUN apk add --no-cache python3 make g++

# Copy package files first to leverage Docker cache
COPY package*.json ./

# If you use pnpm or yarn, change this line accordingly.
# Use npm ci if you committed package-lock.json, otherwise use npm install.
# If you previously had dependency conflicts and want a quick workaround, add --legacy-peer-deps.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the source (components, app/, pages/, tsconfig/jsconfig, next.config.*)
COPY . .

# Ensure Node env for build (optional)
ENV NODE_ENV=production

# Build the Next.js project
RUN npm run build

# Stage 2 — runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# copy public folder and next config if present
COPY --from=builder /app/public ./public
# copy next.config.* if you used one of these names
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

# Use next start (or npm start if your package.json maps start -> next start)
CMD ["npm", "start"]
