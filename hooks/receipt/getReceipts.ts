// app/services/receipt/getReceipts.ts
import { Receipt } from "../../types/receipt";
import { executeQuery } from "../executeQuery";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
  currency?: string;
  sortBy?: "date" | "total" | "merchant";
  sortOrder?: "ASC" | "DESC";
}

interface PaginatedResult {
  receipts: Receipt[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get paginated receipts with optional filters and sorting.
 * Does NOT include items (use getReceiptById for full details).
 */
export async function getReceiptsPaginated(
  params: PaginationParams = {},
): Promise<PaginatedResult> {
  const {
    page = 1,
    limit = 20,
    search,
    dateFrom,
    dateTo,
    minTotal,
    maxTotal,
    currency,
    sortBy = "date",
    sortOrder = "DESC",
  } = params;

  const offset = (page - 1) * limit;

  // Build WHERE clauses
  const whereConditions: string[] = [];
  const queryParams: any[] = [];

  if (search) {
    whereConditions.push("merchant LIKE ?");
    queryParams.push(`%${search}%`);
  }
  if (dateFrom) {
    whereConditions.push("date >= ?");
    queryParams.push(dateFrom);
  }
  if (dateTo) {
    whereConditions.push("date <= ?");
    queryParams.push(dateTo);
  }
  if (minTotal !== undefined) {
    whereConditions.push("total >= ?");
    queryParams.push(minTotal);
  }
  if (maxTotal !== undefined) {
    whereConditions.push("total <= ?");
    queryParams.push(maxTotal);
  }
  if (currency) {
    whereConditions.push("currency = ?");
    queryParams.push(currency);
  }

  const whereClause = whereConditions.length
    ? "WHERE " + whereConditions.join(" AND ")
    : "";

  // Sort column mapping
  const sortColumnMap: Record<string, string> = {
    date: "date",
    total: "total",
    merchant: "merchant",
  };
  const orderBy = `ORDER BY ${sortColumnMap[sortBy] || "date"} ${sortOrder}`;

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM receipts ${whereClause}`;
  const countResult = await executeQuery(countQuery, queryParams);
  const total = countResult[0]?.total || 0;

  // Get paginated results
  const dataQuery = `
    SELECT id, merchant, date, time, currency, total, thumbnail, file_type, created_at, updated_at
    FROM receipts
    ${whereClause}
    ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const dataParams = [...queryParams, limit, offset];
  const rows = await executeQuery(dataQuery, dataParams);

  const receipts = rows.map((row: any) => ({
    id: row.id,
    merchant: row.merchant,
    date: row.date,
    time: row.time,
    currency: row.currency,
    total: row.total,
    thumbnail: row.thumbnail,
    file_type: row.file_type,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: [], // items not included in list view
  }));

  return {
    receipts,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Get the N most recent receipts (no items).
 */
export async function getRecentReceipts(limit: number = 5): Promise<Receipt[]> {
  const query = `
    SELECT id, merchant, date, time, currency, total, thumbnail, file_type, created_at, updated_at
    FROM receipts
    ORDER BY date DESC, time DESC
    LIMIT ?
  `;
  const rows = await executeQuery(query, [limit]);

  return rows.map((row: any) => ({
    id: row.id,
    merchant: row.merchant,
    date: row.date,
    time: row.time,
    currency: row.currency,
    total: row.total,
    thumbnail: row.thumbnail,
    file_type: row.file_type,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: [],
  }));
}
