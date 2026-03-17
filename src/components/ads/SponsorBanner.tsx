"use client";

import { useEffect, useRef } from "react";
import { getActiveSponsor, recordImpression, recordClick } from "@/lib/data";

interface SponsorBannerProps {
  placementType: string;
  entityType?: string;
  entityId?: number;
  className?: string;
}

export default function SponsorBanner({
  placementType,
  entityType,
  entityId,
  className,
}: SponsorBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    // Fetch and display sponsor
    const loadSponsor = async () => {
      try {
        const placement = await getActiveSponsor(
          placementType,
          entityType,
          entityId
        );

        if (placement && containerRef.current) {
          // Record impression
          if (!hasTrackedImpression.current) {
            await recordImpression(placement.id);
            hasTrackedImpression.current = true;
          }

          // Render sponsor creative
          if (placement.creative_html) {
            containerRef.current.innerHTML = placement.creative_html;

            // Add click tracking to links
            const links = containerRef.current.querySelectorAll("a");
            links.forEach((link) => {
              link.addEventListener("click", async () => {
                await recordClick(placement.id);
              });
            });
          } else {
            // Fallback: show logo with link
            containerRef.current.innerHTML = `
              <div style="text-align: center; padding: 16px; background: #f0f0f0; border-radius: 8px;">
                ${
                  placement.sponsors?.logo_url
                    ? `<img src="${placement.sponsors.logo_url}" alt="${placement.sponsors?.name}" style="max-width: 100%; height: auto; max-height: 100px;" />`
                    : `<p style="font-weight: bold;">${placement.sponsors?.name}</p>`
                }
                <p style="font-size: 0.75rem; color: #999; margin-top: 8px;">Sponsored</p>
              </div>
            `;

            if (placement.sponsors?.website_url) {
              const link = document.createElement("a");
              link.href = placement.sponsors.website_url;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              link.style.textDecoration = "none";
              link.onclick = async () => {
                await recordClick(placement.id);
              };

              if (containerRef.current) {
                link.appendChild(containerRef.current.firstChild!);
                containerRef.current.appendChild(link);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load sponsor:", error);
        // Show fallback if sponsor loading fails
      }
    };

    loadSponsor();
  }, [placementType, entityType, entityId]);

  return (
    <div
      ref={containerRef}
      className={`sponsor-banner ${className || ""}`}
      style={{
        minHeight: "100px",
      }}
    />
  );
}
