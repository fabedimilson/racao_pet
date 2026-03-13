'use server';

import { db } from "@/db";
import { users, pets, applications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function submitRegistration(data: any) {
  try {
    // 1. Criar Usuário
    const [user] = await db.insert(users).values({
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      rendimento: data.rendimento,
      cep: data.cep,
      bairro: data.bairro,
      morada: data.morada,
      numero: data.numero,
    }).returning();

    // 2. Criar Pets
    const petsToInsert = [
      ...data.pets_caes.map((p: any) => ({ ...p, tipo: 'cao', userId: user.id })),
      ...data.pets_gatos.map((p: any) => ({ ...p, tipo: 'gato', userId: user.id }))
    ];

    if (petsToInsert.length > 0) {
      await db.insert(pets).values(petsToInsert.map(p => ({
        userId: p.userId,
        tipo: p.tipo,
        nome: p.nome,
        idade: p.idade,
        fotoVacinaUrl: "pending_upload",
        fotoPetUrl: "pending_upload"
      })));
    }

    // 3. Criar Protocolo
    const protocolo = `MN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await db.insert(applications).values({
      userId: user.id,
      protocolo: protocolo,
      status: "Em Análise",
    });

    return { success: true, protocolo };
  } catch (error: any) {
    console.error("Erro na submissão:", error);
    return { success: false, error: error.message };
  }
}

export async function consultProcess(identifier: string) {
  try {
    // Buscar por Protocolo
    const appResult = await db.select()
      .from(applications)
      .where(eq(applications.protocolo, identifier))
      .limit(1);

    if (appResult.length > 0) {
      const app = appResult[0];
      const userResult = await db.select()
        .from(users)
        .where(eq(users.id, app.userId))
        .limit(1);
      
      const user = userResult[0];

      return { 
        success: true, 
        data: {
          protocolo: app.protocolo,
          nome: user.nome,
          status: app.status,
          data: app.created_at?.toLocaleDateString('pt-BR'),
          mensagem: "Os documentos estão em fase de verificação pela equipe da SEMMAS."
        }
      };
    }

    // Tentar por CPF
    const userResult = await db.select()
      .from(users)
      .where(eq(users.cpf, identifier))
      .limit(1);

    if (userResult.length > 0) {
      const user = userResult[0];
      const appCPFResult = await db.select()
        .from(applications)
        .where(eq(applications.userId, user.id))
        .limit(1);

      if (appCPFResult.length > 0) {
        const app = appCPFResult[0];
        return { 
          success: true, 
          data: {
            protocolo: app.protocolo,
            nome: user.nome,
            status: app.status,
            data: app.created_at?.toLocaleDateString('pt-BR'),
            mensagem: "Os documentos estão em fase de verificação pela equipe da SEMMAS."
          }
        };
      }
    }

    return { success: false, error: "Nenhum processo encontrado." };
  } catch (error) {
    console.error("Erro na consulta:", error);
    return { success: false, error: "Erro ao consultar processo." };
  }
}
