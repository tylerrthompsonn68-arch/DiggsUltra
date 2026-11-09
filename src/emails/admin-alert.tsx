import { Button, Text } from "@react-email/components";
import { EmailLayout, h, p } from "./layout";

type Row = [label: string, value: string | number | null | undefined];

/** Full inquiry summary to ADMIN_EMAIL with a deep link to the admin record. */
export function AdminAlertEmail({
  title,
  link,
  rows,
  warning,
}: {
  title: string;
  link: string;
  rows: Row[];
  warning?: string;
}) {
  return (
    <EmailLayout preview={title}>
      <Text style={h}>{title}</Text>
      {warning && <Text style={{ ...p, color: "#8a3b1f", fontWeight: 700 }}>{warning}</Text>}
      {rows
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([label, value]) => (
          <Text key={label} style={{ ...p, margin: "0 0 8px" }}>
            <span style={{ color: "#5c544a" }}>{label}:</span> {String(value)}
          </Text>
        ))}
      <Button
        href={link}
        style={{ backgroundColor: "#8a3b1f", color: "#f5f1ea", padding: "12px 20px", borderRadius: 2, fontWeight: 700, marginTop: 16 }}
      >
        Open in admin
      </Button>
    </EmailLayout>
  );
}
