import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Función para verificar y registrar el estado de la variable de entorno
function checkEnvironmentVariable() {
  if (process.env.REVALIDATION_SECRET) {
    console.log("REVALIDATION_SECRET está definido");
    console.log("Longitud de REVALIDATION_SECRET:", process.env.REVALIDATION_SECRET.length);
    console.log("Primeros 4 caracteres de REVALIDATION_SECRET:", process.env.REVALIDATION_SECRET.substring(0, 4));
  } else {
    console.log("ADVERTENCIA: REVALIDATION_SECRET no está definido");
  }
}

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

// Función para logging seguro del secreto
function logSecretInfo(receivedSecret: string | null, expectedSecret: string | undefined) {
  console.log("Longitud del secreto recibido:", receivedSecret?.length);
  console.log("Longitud del secreto esperado:", expectedSecret?.length);
  console.log("Primeros 4 caracteres del secreto recibido:", receivedSecret?.substring(0, 4));
  console.log("Primeros 4 caracteres del secreto esperado:", expectedSecret?.substring(0, 4));
  console.log("Últimos 4 caracteres del secreto recibido:", receivedSecret?.slice(-4));
  console.log("Últimos 4 caracteres del secreto esperado:", expectedSecret?.slice(-4));
}

// Manejador para solicitudes POST
export async function POST(request: NextRequest) {
  console.log("Iniciando manejador POST");
  checkEnvironmentVariable();
  try {
    console.log("Recibida solicitud POST para revalidación");
    const body = await request.json();
    console.log("Cuerpo de la solicitud:", JSON.stringify(body, (key, value) => key === 'secret' ? '[REDACTED]' : value));

    logSecretInfo(body.secret, process.env.REVALIDATION_SECRET);

    if (body.secret !== process.env.REVALIDATION_SECRET) {
      console.log("Verificación del secreto fallida");
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    console.log("Secreto verificado correctamente");

    if (!body.type) {
      console.log("Falta el tipo de contenido en la solicitud");
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }

    const result = await handleRevalidation(body.type, body.documentId);
    console.log("Revalidación completada:", result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error durante la revalidación POST:", err);
    return NextResponse.json({ message: "Error al revalidar" }, { status: 500 });
  }
}

// Manejador para solicitudes GET
export async function GET(request: NextRequest) {
  console.log("Iniciando manejador GET");
  checkEnvironmentVariable();
  try {
    console.log("Recibida solicitud GET para revalidación");
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const type = searchParams.get('type');
    const documentId = searchParams.get('documentId');

    console.log("Parámetros de la solicitud:", { type, documentId });
    logSecretInfo(secret, process.env.REVALIDATION_SECRET);

    if (secret !== process.env.REVALIDATION_SECRET) {
      console.log("Verificación del secreto fallida");
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    console.log("Secreto verificado correctamente");

    if (!type) {
      console.log("Falta el tipo de contenido en la solicitud");
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }

    const result = await handleRevalidation(type, documentId || undefined);
    console.log("Revalidación completada:", result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error durante la revalidación GET:", err);
    return NextResponse.json({ message: "Error al revalidar" }, { status: 500 });
  }
}

// Manejador para solicitudes OPTIONS (para CORS)
export async function OPTIONS() {
  console.log("Recibida solicitud OPTIONS");
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}