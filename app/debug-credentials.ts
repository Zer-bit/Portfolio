import fs from "fs";

async function debugSupabaseApiDirectly() {
  console.log("=== DEBUGGING SUPABASE CREDENTIALS & API ===");

  const envText = fs.readFileSync(".env.local", "utf8");
  const urlMatch = envText.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = envText.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

  const rawUrl = urlMatch ? urlMatch[1].trim() : "";
  const rawKey = keyMatch ? keyMatch[1].trim() : "";

  console.log("URL:", rawUrl);
  console.log("Key Length:", rawKey.length);
  console.log("Key First 20 chars:", rawKey.substring(0, 20));
  console.log("Key Last 20 chars:", rawKey.substring(rawKey.length - 20));

  // Test Direct REST API fetch on projects table
  const restUrl = `${rawUrl}/rest/v1/projects?select=*`;
  console.log("\n1. Testing GET on REST API:", restUrl);
  try {
    const res = await fetch(restUrl, {
      headers: {
        apikey: rawKey,
        Authorization: `Bearer ${rawKey}`,
      },
    });
    console.log("GET Response Status:", res.status, res.statusText);
    const body = await res.json();
    console.log("GET Response Body:", Array.isArray(body) ? `Array of ${body.length} items` : body);
  } catch (err) {
    console.error("GET Fetch Failed:", err);
  }

  // Test Direct REST API POST (Insert)
  const testObj = {
    title: "DEBUG_TEST_" + Date.now(),
    slug: "debug-test-" + Date.now(),
    description: "Testing API credentials",
    image: "/Images/IHI.png",
    link: "#",
    accent: "#9cbd09",
    order_index: 999,
  };
  console.log("\n2. Testing POST (Insert) on REST API...");
  try {
    const res = await fetch(`${rawUrl}/rest/v1/projects`, {
      method: "POST",
      headers: {
        apikey: rawKey,
        Authorization: `Bearer ${rawKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(testObj),
    });
    console.log("POST Response Status:", res.status, res.statusText);
    const body = await res.json();
    console.log("POST Response Body:", body);

    if (res.status === 201 && Array.isArray(body) && body.length > 0) {
      const createdId = body[0].id;
      console.log("\n3. Testing DELETE on REST API for ID:", createdId);
      const delRes = await fetch(`${rawUrl}/rest/v1/projects?id=eq.${createdId}`, {
        method: "DELETE",
        headers: {
          apikey: rawKey,
          Authorization: `Bearer ${rawKey}`,
          Prefer: "return=representation",
        },
      });
      console.log("DELETE Response Status:", delRes.status, delRes.statusText);
      const delBody = await delRes.json();
      console.log("DELETE Response Body:", delBody);
    }
  } catch (err) {
    console.error("POST Fetch Failed:", err);
  }
}

debugSupabaseApiDirectly();
