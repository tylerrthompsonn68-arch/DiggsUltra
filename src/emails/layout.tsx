import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

/** Shared shell for all DiggsUltra emails: brand colors, plain and readable. */
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f5f1ea", fontFamily: "Inter, Helvetica, Arial, sans-serif", color: "#161412", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Text style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 24px" }}>
            DIGGS <span style={{ color: "#8a3b1f", fontStyle: "italic", fontWeight: 400 }}>Ultra</span>
          </Text>
          <Section>{children}</Section>
          <Hr style={{ borderColor: "#ddd5c8", margin: "32px 0 16px" }} />
          <Text style={{ fontSize: 12, color: "#5c544a", margin: 0 }}>
            DiggsUltra · Everything Ultra Marathon · diggsultra.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const p = { fontSize: 15, lineHeight: "24px", margin: "0 0 14px" } as const;
export const h = { fontSize: 20, fontWeight: 800, margin: "0 0 14px" } as const;
