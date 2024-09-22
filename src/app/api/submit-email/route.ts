import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { email, route } = await request.json();

    // Configurar la autenticación de Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ID de tu hoja de cálculo y rango donde quieres añadir el email y la ruta
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Correos!A2:C'; // Comenzamos desde A2 para preservar el encabezado

    // Formatear la fecha correctamente para Google Sheets
    const fechaRegistro = new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

    // Añadir el email, la ruta y la fecha formateada a la hoja de cálculo
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', // Asegura que siempre inserte nuevas filas
      requestBody: {
        values: [[email, route, fechaRegistro]],
      },
    });

    return NextResponse.json({ message: 'Datos guardados exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
