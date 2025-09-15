import { GoogleAuth } from "google-auth-library";
import { sheets_v4, google } from "googleapis";

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  }

  async clearAndUpdateSheet(sheetName: string, data: any) {
    try {
      // Clear existing data
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      // Add new data
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: data,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Google Sheets Error:", error);
      throw error;
    }
  }

  async createSheetIfNotExists(sheetName: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheetExists = response.data.sheets?.some(
        (sheet: any) => sheet.properties?.title === sheetName
      );

      if (!sheetExists) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error("Error creating sheet:", error);
      throw error;
    }
  }
}
