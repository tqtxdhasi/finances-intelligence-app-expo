// d1Batch.js
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;

export async function executeBatch(statements) {
  // statements: [{ sql: "...", params: [...] }]
  const batch = statements.map((stmt) => ({
    sql: stmt.sql,
    params: stmt.params.map((p) => String(p)),
  }));

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batch }),
    },
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(`D1 API error: ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}
