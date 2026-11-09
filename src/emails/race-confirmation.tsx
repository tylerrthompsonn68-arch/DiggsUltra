import { Text } from "@react-email/components";
import { booking } from "@/config/site";
import { EmailLayout, h, p } from "./layout";

type Props = { contactName: string; raceName: string; raceStartDate: string; shortNotice: boolean };

export function RaceConfirmationEmail({ contactName, raceName, raceStartDate, shortNotice }: Props) {
  const first = contactName.split(" ")[0];
  return (
    <EmailLayout preview={`Got your request for ${raceName}`}>
      <Text style={h}>Got it, {first}.</Text>
      <Text style={p}>
        Your request for <strong>{raceName}</strong> ({raceStartDate}) is in. I read every one myself.
      </Text>
      <Text style={p}><strong>What happens next:</strong></Text>
      <Text style={p}>
        1. I check my calendar for your race dates.<br />
        2. I&apos;ll get back to you {booking.responseTime} to set up a quick call.<br />
        3. After the call I send a quote. Every race is quoted individually.
      </Text>
      {shortNotice && (
        <Text style={p}>
          Heads up: your race is under {booking.minLeadDays} days out. Short-notice requests are hard to fit in, but I&apos;ll still take a look.
        </Text>
      )}
      <Text style={p}>
        Quick reminder: the race covers travel, lodging, and food for coverage. Quotes are separate from that.
      </Text>
      <Text style={p}>Just reply to this email if anything changes.</Text>
      <Text style={p}>Diggs</Text>
    </EmailLayout>
  );
}
