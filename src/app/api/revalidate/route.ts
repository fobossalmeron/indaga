import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  // Obtener el cuerpo de la solicitud
  const body = await request.json();

  // Verificar el secreto
  if (body.secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Obtener el tipo de contenido del cuerpo de la solicitud
  const contentType = body.type;

  if (!contentType) {
    return NextResponse.json({ message: "Missing content type" }, { status: 400 });
  }

  try {
    // Revalidar el tag correspondiente al tipo de contenido
    await revalidateTag(contentType);

    // Si es un documento específico, también revalidamos su tag individual
    if (body.documentId) {
      await revalidateTag(`${contentType}-${body.documentId}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      revalidatedType: contentType,
      revalidatedDocument: body.documentId ? `${contentType}-${body.documentId}` : undefined
    });
  } catch (err) {
    console.error("Error during revalidation:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}