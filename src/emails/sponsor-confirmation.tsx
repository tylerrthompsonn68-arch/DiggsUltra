import { Text } from "@react-email/components";
import { booking } from "@/config/site";
import { EmailLayout, h, p } from "./layout";

export function SponsorConfirmationEmail({ contactName, brandName }: { contactName: string; brandName: string }) {
  const first = contactName.split(" ")[0];
  return (
    <EmailLayout preview={`Thanks for reaching out, ${brandName}`}>
      <Text style={h}>Thanks, {first}.</Text>
      <Text style={p}>
        Got your note about partnering with <strong>{brandName}</strong>. I&apos;ll get back to you {booking.responseTime} with ideas and next steps.
      </Text>
      <Text style={p}>Just reply to this email if you want to add anything.</Text>
      <Text style={p}>Diggs</Text>
    </EmailLayout>
  );
}
