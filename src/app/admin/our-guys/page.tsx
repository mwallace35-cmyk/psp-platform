"use client";

import { useState } from "react";

interface TrackedPerson {
  id: number;
  person_name: string;
  current_level: string;
  current_org: string;
  current_role: string;
  college: string;
  pro_team: string;
  pro_league: string;
  draft_info: string;
  social_twitter: string;
  social_instagram: string;
  featured: boolean;
  bio_note: string;
  status: string;
  high_school_id: number | null;
  sport_id: string;
}

interface SocialPostEntry {
  id: number;
  tracking_id: number;
  platform: string;
  post_url: string;
  post_embed_html: string;
  caption_preview: string;
  featured: boolean;
}

const EMPTY_PERSON: Omit<TrackedPerson, "id"> = {
  person_name: "",
  current_level: "college",
  current_org: "",
  current_role: "",
  college: "",
  pro_team: "",
  pro_league: "",
  draft_info: "",
  social_twitter: "",
  social_instagram: "",
  featured: false,
  bio_note: "",
  status: "active",
  high_school_id: null,
  sport_id: "football",
};

const LEVELS = ["college", "pro", "coaching", "staff"];
const LEAGUES = ["NFL", "NBA", "MLB", "MLS", "other"];
const SPORTS = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"];

export default function AdminOurGuysPage() {
  const [tab, setTab] = useState<"people" | "social">("people");
  const [people, setPeople] = useState<TrackedPerson[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPostEntry[]>([]);
  const [editingPerson, setEditingPerson] = useState<Omit<TrackedPerson, "id"> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Social post form
  const [socialForm, setSocialForm] = useState({ tracking_id: 0, post_url: "", caption_preview: "" });
  const [oembedLoading, setOembedLoading] = useState(false);
  const [oembedPreview, setOembedPreview] = useState<string | null>(null);

  const handleSavePerson = () => {
    if (!editingPerson || !editingPerson.person_name.trim()) return;
    if (editingId !== null) {
      setPeople(prev => prev.map(p => p.id === editingId ? { ...editingPerson, id: editingId } as TrackedPerson : p));
    } else {
      const newId = Date.now();
      setPeople(prev => [...prev, { ...editingPerson, id: newId } as TrackedPerson]);
    }
    setEditingPerson(null);
    setEditingId(null);
  };

  const handleDeletePerson = (id: number) => {
    if (confirm("Remove this person?")) {
      setPeople(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleFetchOembed = async () => {
    if (!socialForm.post_url.trim()) return;
    setOembedLoading(true);
    setOembedPreview(null);
    try {
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(socialForm.post_url)}`);
      if (res.ok) {
        const data = await res.json();
        setOembedPreview(data.html || "<p>No embed available</p>");
      } else {
        setOembedPreview("<p style='color:red'>Failed to fetch embed. Check the URL.</p>");
      }
    } catch {
      setOembedPreview("<p style='color:red'>Error fetching embed.</p>");
    }
    setOembedLoading(false);
  };

  const handleAddSocialPost = () => {
    if (!socialForm.post_url.trim() || !socialForm.tracking_id) return;
    const platform = socialForm.post_url.includes("instagram") ? "instagram" : "twitter";
    setSocialPosts(prev => [...prev, {
      id: Date.now(),
      tracking_id: socialForm.tracking_id,
      platform,
      post_url: socialForm.post_url,
      post_embed_html: oembedPreview || "",
      caption_preview: socialForm.caption_preview,
      featured: false,
    }]);
    setSocialForm({ tracking_id: 0, post_url: "", caption_preview: "" });
    setOembedPreview(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 className="psp-h4">Our Guys Manager</h1>
          <p style={{ fontSize: 12, color: "var(--g400)", margin: "4px 0 0" }}>
            Track alumni at the next level and curate their social media posts.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid var(--g100)" }}>
        {[
          { key: "people" as const, label: "👥 People", count: people.length },
          { key: "social" as const, label: "📱 Social Posts", count: socialPosts.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: tab === t.key ? "2px solid #f0a500" : "2px solid transparent",
              background: "none",
              color: tab === t.key ? "#f0a500" : "var(--g400)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              marginBottom: -2,
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* PEOPLE TAB */}
      {tab === "people" && (
        <div>
          {/* Add/Edit Form */}
          {editingPerson ? (
            <div style={{
              background: "var(--card)",
              border: "1px solid var(--g200)",
              borderRadius: 8,
              padding: 20,
              marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>
                {editingId ? "Edit Person" : "Add New Person"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={editingPerson.person_name}
                    onChange={e => setEditingPerson({ ...editingPerson, person_name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Sport</label>
                  <select style={inputStyle} value={editingPerson.sport_id}
                    onChange={e => setEditingPerson({ ...editingPerson, sport_id: e.target.value })}>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Current Level</label>
                  <select style={inputStyle} value={editingPerson.current_level}
                    onChange={e => setEditingPerson({ ...editingPerson, current_level: e.target.value })}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Pro League</label>
                  <select style={inputStyle} value={editingPerson.pro_league}
                    onChange={e => setEditingPerson({ ...editingPerson, pro_league: e.target.value })}>
                    <option value="">—</option>
                    {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Current Org</label>
                  <input style={inputStyle} value={editingPerson.current_org}
                    onChange={e => setEditingPerson({ ...editingPerson, current_org: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Current Role</label>
                  <input style={inputStyle} value={editingPerson.current_role}
                    onChange={e => setEditingPerson({ ...editingPerson, current_role: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>College</label>
                  <input style={inputStyle} value={editingPerson.college}
                    onChange={e => setEditingPerson({ ...editingPerson, college: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Pro Team</label>
                  <input style={inputStyle} value={editingPerson.pro_team}
                    onChange={e => setEditingPerson({ ...editingPerson, pro_team: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Draft Info</label>
                  <input style={inputStyle} value={editingPerson.draft_info} placeholder="e.g. 2021 NFL Draft, Rd 1 Pick 4"
                    onChange={e => setEditingPerson({ ...editingPerson, draft_info: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={editingPerson.status}
                    onChange={e => setEditingPerson({ ...editingPerson, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Twitter Handle</label>
                  <input style={inputStyle} value={editingPerson.social_twitter} placeholder="@username"
                    onChange={e => setEditingPerson({ ...editingPerson, social_twitter: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Instagram Handle</label>
                  <input style={inputStyle} value={editingPerson.social_instagram} placeholder="@username"
                    onChange={e => setEditingPerson({ ...editingPerson, social_instagram: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={labelStyle}>Bio Note</label>
                <textarea style={{ ...inputStyle, minHeight: 60 }} value={editingPerson.bio_note}
                  onChange={e => setEditingPerson({ ...editingPerson, bio_note: e.target.value })} />
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={editingPerson.featured}
                    onChange={e => setEditingPerson({ ...editingPerson, featured: e.target.checked })} />
                  {" "}Featured (appears in spotlight)
                </label>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={handleSavePerson} style={btnPrimary}>
                  {editingId ? "Save Changes" : "Add Person"}
                </button>
                <button onClick={() => { setEditingPerson(null); setEditingId(null); }} style={btnSecondary}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditingPerson({ ...EMPTY_PERSON })} style={btnPrimary}>
              + Add Person
            </button>
          )}

          {/* People list */}
          <div style={{ marginTop: 16 }}>
            {people.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--g400)", fontSize: 13 }}>
                No people tracked yet. Click &quot;Add Person&quot; to get started.
                <br /><br />
                <span style={{ fontSize: 11 }}>
                  Tip: Import 72 pro athletes from unified_enrichments.csv for bulk seeding.
                </span>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--g200)" }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Level</th>
                    <th style={thStyle}>Org / Team</th>
                    <th style={thStyle}>Sport</th>
                    <th style={thStyle}>Featured</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--g100)" }}>
                      <td style={tdStyle}>
                        <strong>{p.person_name}</strong>
                        {p.social_twitter && <span style={{ fontSize: 10, color: "var(--g400)", marginLeft: 6 }}>𝕏</span>}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                          background: p.current_level === "pro" ? "#f0a500" : "#3b82f6",
                          color: p.current_level === "pro" ? "#0a1628" : "#fff",
                          padding: "1px 6px", borderRadius: 3,
                        }}>
                          {p.current_level}
                        </span>
                      </td>
                      <td style={tdStyle}>{p.current_org || p.pro_team || "—"}</td>
                      <td style={tdStyle}>{p.sport_id}</td>
                      <td style={tdStyle}>{p.featured ? "⭐" : "—"}</td>
                      <td style={tdStyle}>
                        <button onClick={() => { setEditingPerson(p); setEditingId(p.id); }}
                          style={{ ...btnSmall, marginRight: 4 }}>Edit</button>
                        <button onClick={() => handleDeletePerson(p.id)} style={{ ...btnSmall, color: "#dc2626" }}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL TAB */}
      {tab === "social" && (
        <div>
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--g200)",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>
              Add Social Post
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Person</label>
                <select style={inputStyle} value={socialForm.tracking_id}
                  onChange={e => setSocialForm({ ...socialForm, tracking_id: Number(e.target.value) })}>
                  <option value={0}>Select person...</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.person_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Post URL (Twitter or Instagram)</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={socialForm.post_url}
                    placeholder="https://twitter.com/... or https://instagram.com/p/..."
                    onChange={e => setSocialForm({ ...socialForm, post_url: e.target.value })} />
                  <button onClick={handleFetchOembed} disabled={oembedLoading} style={btnPrimary}>
                    {oembedLoading ? "Loading..." : "Fetch Embed"}
                  </button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Caption Preview (optional)</label>
              <input style={inputStyle} value={socialForm.caption_preview}
                placeholder="Brief caption or quote from the post..."
                onChange={e => setSocialForm({ ...socialForm, caption_preview: e.target.value })} />
            </div>

            {/* oEmbed preview */}
            {oembedPreview && (
              <div style={{
                marginTop: 14,
                padding: 14,
                background: "var(--bg)",
                borderRadius: 6,
                border: "1px solid var(--g200)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--g400)", marginBottom: 8, textTransform: "uppercase" }}>
                  Embed Preview
                </div>
                <div dangerouslySetInnerHTML={{ __html: oembedPreview }} style={{ maxHeight: 300, overflow: "auto" }} />
              </div>
            )}

            <button onClick={handleAddSocialPost} disabled={!socialForm.tracking_id || !socialForm.post_url}
              style={{ ...btnPrimary, marginTop: 14, opacity: (!socialForm.tracking_id || !socialForm.post_url) ? 0.5 : 1 }}>
              + Add Social Post
            </button>
          </div>

          {/* Social posts list */}
          {socialPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--g400)", fontSize: 13 }}>
              No social posts curated yet. Add people first, then paste their tweet or Instagram post URLs above.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {socialPosts.map(sp => (
                <div key={sp.id} style={{
                  background: "var(--card)",
                  border: "1px solid var(--g200)",
                  borderRadius: 6,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      color: sp.platform === "twitter" ? "#000" : "#e1306c",
                    }}>
                      {sp.platform === "twitter" ? "𝕏 Twitter" : "📷 Instagram"}
                    </span>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                      {people.find(p => p.id === sp.tracking_id)?.person_name || `ID: ${sp.tracking_id}`}
                    </div>
                    {sp.caption_preview && (
                      <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>{sp.caption_preview}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <a href={sp.post_url} target="_blank" rel="noopener noreferrer" style={btnSmall}>View</a>
                    <button onClick={() => setSocialPosts(prev => prev.filter(s => s.id !== sp.id))} style={{ ...btnSmall, color: "#dc2626" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--g400)", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "7px 10px", borderRadius: 5, border: "1px solid var(--g200)", background: "var(--bg)", color: "var(--text)", fontSize: 12 };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "var(--g400)", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { padding: "8px 10px", verticalAlign: "middle" };
const btnPrimary: React.CSSProperties = { padding: "7px 16px", borderRadius: 5, border: "none", background: "#f0a500", color: "#0a1628", fontWeight: 700, fontSize: 12, cursor: "pointer" };
const btnSecondary: React.CSSProperties = { padding: "7px 16px", borderRadius: 5, border: "1px solid var(--g200)", background: "none", color: "var(--text)", fontWeight: 600, fontSize: 12, cursor: "pointer" };
const btnSmall: React.CSSProperties = { padding: "3px 10px", borderRadius: 4, border: "1px solid var(--g200)", background: "none", color: "var(--text)", fontSize: 11, cursor: "pointer", textDecoration: "none" };
