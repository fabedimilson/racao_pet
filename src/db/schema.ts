import { pgTable, serial, text, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  email: text("email").notNull(),
  rendimento: text("rendimento").notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  bairro: text("bairro").notNull(),
  morada: text("morada").notNull(),
  numero: text("numero").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tipo: text("tipo").notNull(), // 'cao' ou 'gato'
  nome: text("nome").notNull(),
  idade: text("idade").notNull(),
  fotoVacinaUrl: text("foto_vacina_url"),
  fotoPetUrl: text("foto_pet_url"),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  protocolo: varchar("protocolo", { length: 20 }).notNull().unique(),
  status: text("status").default("Em Análise").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
