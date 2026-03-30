import { createClient } from "@/lib/data/common";

export interface DYKFact {
  id: number;
  fact: string;
  playerName: string | null;
  playerId: number | null;
  categoryType: string; // 'reactive' or 'curated'
}

export async function ReactiveDidYouKnow() {
  const supabase = await createClient();

  // First try reactive facts (from recent big games, last 7 days)
  const { data: reactiveFacts } = await (supabase as any)
    .from("did_you_know")
    .select("id, fact, player_name, player_id, category_type")
    .eq("category_type", "reactive")
    .eq("approved", true)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  // Fallback to curated facts
  let facts: DYKFact[] = [];
  if (reactiveFacts && reactiveFacts.length > 0) {
    facts = reactiveFacts.map((f: any) => ({
      id: f.id,
      fact: f.fact,
      playerName: f.player_name,
      playerId: f.player_id,
      categoryType: f.category_type,
    }));
  } else {
    const { data: curatedFacts } = await (supabase as any)
      .from("did_you_know")
      .select("id, fact, player_name, player_id, category_type")
      .eq("approved", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10);

    if (curatedFacts) {
      // Randomly pick one
      const shuffled = curatedFacts.sort(() => Math.random() - 0.5);
      facts = shuffled.slice(0, 3).map((f: any) => ({
        id: f.id,
        fact: f.fact,
        playerName: f.player_name,
        playerId: f.player_id,
        categoryType: f.category_type || "curated",
      }));
    }
  }

  if (facts.length === 0) return null;

  const fact = facts[0]; // Show the first one (client-side rotation can be added later)

  return (
    <section style={{
      padding: "20px 16px",
      background: "#111827",
      borderRadius: "12px",
      borderLeft: "3px solid rgba(240, 165, 0, 0.3)",
    }}>
      <h3 style={{
        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
        fontSize: "18px",
        color: "#f5f0e8",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span>DID YOU KNOW?</span>
      </h3>
      <p style={{
        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        fontSize: "15px",
        lineHeight: 1.6,
        color: "#d1d5db",
      }}>
        {fact.fact}
      </p>
      {fact.categoryType === "reactive" && fact.playerId && (
        <a
          href={`/next-level/${fact.playerId}`}
          style={{
            display: "inline-block",
            marginTop: "12px",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#f0a500",
            textDecoration: "none",
          }}
        >
          See full career &rarr;
        </a>
      )}
    </section>
  );
}
