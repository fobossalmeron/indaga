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

// Función para verificar el secreto
function isValidSecret(receivedSecret: string | null, expectedSecret: string | undefined): boolean {
  console.log("Verificando secreto:");
  console.log("Recibido (primeros 4 caracteres):", receivedSecret?.substring(0, 4));
  console.log("Esperado (primeros 4 caracteres):", expectedSecret?.substring(0, 4));
  return receivedSecret === expectedSecret;
}

// Manejador para solicitudes POST
export async function POST(request: NextRequest) {
  console.log("Iniciando manejador POST");
  try {
    const body = await request.json();
    console.log("Cuerpo de la solicitud POST:", JSON.stringify(body, (key, value) => key === 'secret' ? '[REDACTED]' : value));

    if (!isValidSecret(body.secret, process.env.REVALIDATION_SECRET)) {
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
  console.log("Iniciando manejador GET");
  try {
    console.log("Solicitud completa:", {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers),
    });
    
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const type = searchParams.get('type');
    const documentId = searchParams.get('documentId');

    console.log("Parámetros de la solicitud GET:", {
      type,
      documentId,
      secretRecibido: secret ? 'Presente' : 'Ausente'
    });

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      console.log("Verificación del secreto fallida");
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    console.log("Secreto verificado correctamente");

    // Prismic envía 'type' como 'types' en el webhook
    const contentType = type || searchParams.get('types');

    if (!contentType) {
      console.log("Falta el tipo de contenido en la solicitud");
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }

    const result = await handleRevalidation(contentType, documentId || undefined);
    console.log("Revalidación completada:", result);
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