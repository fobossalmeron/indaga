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
    console.log("Solicitud completa:", request);

    // Intentar leer el cuerpo de la solicitud
    let body;
    try {
      body = await request.json();
      console.log("Cuerpo de la solicitud:", body);
    } catch (error) {
      console.log("No se pudo leer el cuerpo de la solicitud como JSON:", error);
    }

    // Si no pudimos leer el cuerpo como JSON, intentemos leerlo como texto
    if (!body) {
      try {
        const textBody = await request.text();
        console.log("Cuerpo de la solicitud como texto:", textBody);
        // Intentar parsear el texto como JSON
        body = JSON.parse(textBody);
      } catch (error) {
        console.log("No se pudo leer el cuerpo de la solicitud como texto:", error);
      }
    }

    // Verificar el secreto
    const secret = body?.secret || request.headers.get('x-prismic-secret');
    if (secret !== process.env.REVALIDATION_SECRET) {
      console.log("Verificación del secreto fallida");
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    console.log("Secreto verificado correctamente");

    // Determinar el tipo de contenido
    const contentType = body?.type || body?.types || request.headers.get('x-prismic-type');

    if (!contentType) {
      console.log("Falta el tipo de contenido en la solicitud");
      return NextResponse.json({ message: "Falta el tipo de contenido" }, { status: 400 });
    }

    // Realizar la revalidación
    await revalidateTag(contentType);
    console.log("Revalidación completada para el tipo:", contentType);

    return NextResponse.json({
      revalidado: true,
      ahora: Date.now(),
      tipoRevalidado: contentType
    });
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