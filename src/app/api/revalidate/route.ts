import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Función auxiliar para manejar la revalidación
async function handleRevalidation(type: string, documentId?: string) {
  await revalidateTag(type);
  if (documentId) {
    await revalidateTag(`${type}-${documentId}`);
  }
  return {
    revalidado: true,
    ahora: Date.now(),
    tipoRevalidado: type,
    documentoRevalidado: documentId ? `${type}-${documentId}` : undefined
  };
}

// Manejador para solicitudes POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }
    if (!body.type) {
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }
    const result = await handleRevalidation(body.type, body.documentId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error durante la revalidación POST:", err);
    return NextResponse.json({ message: "Error al revalidar" }, { status: 500 });
  }
}

// Manejador para solicitudes GET
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const type = searchParams.get('type');
    const documentId = searchParams.get('documentId');

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }
    if (!type) {
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }

    const result = await handleRevalidation(type, documentId || undefined);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error durante la revalidación GET:", err);
    return NextResponse.json({ message: "Error al revalidar" }, { status: 500 });
  }
}

// Manejador para solicitudes OPTIONS (para CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}