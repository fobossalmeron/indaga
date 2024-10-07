import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Manejador para solicitudes POST
export async function POST(request: NextRequest) {
  console.log("Iniciando manejador POST de revalidación");
  try {
    const body = await request.json();
    console.log("Cuerpo de la solicitud POST:", JSON.stringify(body, (key, value) => key === 'secret' ? '[REDACTED]' : value));

    // Verificar el secreto
    if (body.secret !== process.env.REVALIDATION_SECRET) {
      console.log("Verificación del secreto fallida");
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    console.log("Secreto verificado correctamente");

    // Revalidar el tag 'prismic' que se usa en todas las páginas con contenido de Prismic
    await revalidateTag("prismic");
    console.log("Tag 'prismic' revalidado");

    return NextResponse.json({ 
      revalidado: true, 
      ahora: Date.now(),
      mensaje: "Todas las páginas con contenido de Prismic han sido revalidadas"
    });
  } catch (err) {
    console.error("Error durante la revalidación:", err);
    return NextResponse.json({ message: "Error al revalidar" }, { status: 500 });
  }
}