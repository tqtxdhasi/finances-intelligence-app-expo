// executeQuery.ts

const accountId = "66a2c7cafe7eacfcf75c5979bee610cb";
const apiToken = "cfat_xh7VEhleMPxgugNanpPygz6iih5sBthNwS8WynId4587387b";
const databaseId = "03a253d7-7c77-494e-8cec-12795bfb6cd3";

export const executeQuery = async (
  sql: string,
  params: any[] = [],
): Promise<any> => {
  if (!accountId || !apiToken || !databaseId) {
    throw new Error("D1 configuration missing");
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params: params.map((p) => String(p)) }),
    },
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(`D1 API error: ${JSON.stringify(data.errors)}`);
  }

  const result = data.result[0];
  if (!result) return [];

  const isSelect = sql.trim().toUpperCase().startsWith("SELECT");
  if (isSelect) {
    return result.results || [];
  }

  return {
    success: true,
    changes: result.meta?.changes || 0,
    results: result.results || [],
    lastRowId: result.meta?.last_row_id,
  };
};
