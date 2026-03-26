// hooks/receipt/getAllReceipts.ts
import { QueryParams, ReceiptsListResponse } from "../../types/receipt";
import { executeQuery } from "../executeQuery";

export const getAllReceipts = async (
  params: QueryParams = {},
): Promise<ReceiptsListResponse> => {
  const {
    page = 1,
    limit = 20,
    search,
    sortBy = "date",
    sortOrder = "DESC",
    dateFrom,
    dateTo,
    minTotal,
    maxTotal,
    currency,
  } = params;

  const offset = (page - 1) * limit;

  // Build WHERE clause dynamically
  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (search) {
    conditions.push("merchant LIKE ?");
    queryParams.push(`%${search}%`);
  }
  if (dateFrom) {
    conditions.push("date >= ?");
    queryParams.push(dateFrom);
  }
  if (dateTo) {
    conditions.push("date <= ?");
    queryParams.push(dateTo);
  }
  if (minTotal !== undefined && minTotal !== null) {
    conditions.push("total >= ?");
    queryParams.push(minTotal);
  }
  if (maxTotal !== undefined && maxTotal !== null) {
    conditions.push("total <= ?");
    queryParams.push(maxTotal);
  }
  if (currency) {
    conditions.push("currency = ?");
    queryParams.push(currency);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Count total matching receipts
  const countQuery = `SELECT COUNT(*) as total FROM receipts ${whereClause}`;
  const countResult = await executeQuery(countQuery, queryParams);
  const total = countResult[0]?.total || 0;

  // Validate sortBy to prevent SQL injection
  const allowedSortFields = ["date", "merchant", "total"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  // Get paginated receipts
  const receiptsQuery = `
    SELECT * FROM receipts
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortOrder}
    LIMIT ? OFFSET ?
  `;
  const receipts = await executeQuery(receiptsQuery, [
    ...queryParams,
    limit,
    offset,
  ]);

  // For each receipt, fetch its items (optional: could join, but separate query is simpler)
  // We'll fetch items in a separate query to avoid N+1 if many receipts, but for now we'll do it per receipt
  // To optimize, we could get all items for the receipts in one query.
  const receiptIds = receipts.map((r: any) => r.id);
  let itemsMap: Record<string, any[]> = {};
  if (receiptIds.length) {
    const itemsQuery = `
      SELECT * FROM receipt_items
      WHERE receipt_id IN (${receiptIds.map(() => "?").join(",")})
      ORDER BY created_at ASC
    `;
    const allItems = await executeQuery(itemsQuery, receiptIds);
    itemsMap = allItems.reduce((acc: any, item: any) => {
      if (!acc[item.receipt_id]) acc[item.receipt_id] = [];
      acc[item.receipt_id].push(item);
      return acc;
    }, {});
  }

  const receiptsWithItems = receipts.map((receipt: any) => ({
    ...receipt,
    items: itemsMap[receipt.id] || [],
  }));

  const hasMore = offset + receipts.length < total;

  return {
    receipts: receiptsWithItems,
    total,
    page,
    limit,
    hasMore,
  };
};
