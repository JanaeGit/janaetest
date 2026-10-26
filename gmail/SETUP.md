# Connect Gmail to Tropic West appointment confirmations

Google Apps Script runs under the Google account that grants access. Set it up with the Google account you want to be the **sender** (the To/CC clinic recipients are fixed in Code.gs).

1. Sign in to the intended sending Google account and open https://script.google.com/home/projects/create .
2. Replace the contents of `Code.gs` with https://github.com/JanaeGit/janaetest/blob/main/gmail/Code.gs and Save.
3. Open **Project Settings → Script Properties → Add script property**. Name: `SCRIPT_SHARED_SECRET`; Value: a unique, long, randomly generated string. Do not commit or paste the value into GitHub or this chat.
4. To authorize Gmail, add and run a temporary function `function authorizeGmail(){ GmailApp.getAliases(); }` from the Apps Script editor and grant requested permissions; remove that function afterward.
5. **Deploy → New deployment → Web app**. Execute as **Me** (the intended sending Gmail account). Access: **Anyone** so the Cloudflare Worker can POST, but the handler checks `SCRIPT_SHARED_SECRET` before sending. Copy the production URL ending in `/exec`.
6. In Cloudflare → Workers & Pages → tropic-west-booking → Settings → Variables and Secrets, set **secret** `CLINIC_NOTIFY_URL` to that `/exec` URL and set **secret** `CLINIC_NOTIFY_SECRET` to the same random string as the Script Property.
7. Confirm the latest GitHub deployment is active. Test using synthetic names/email addresses, verify DB booking + email delivery + duplicate reservation returns 409, and test notification failures. **Never enable real patient booking until tested and privacy/security review completed.**

**Current safeguards and limitations:** The Worker refuses POST bookings if notification variables are unset, or if the script does not return `{ok:true}`. The Apps Script endpoint is public with a shared-secret gate. There are not yet anti-abuse/rate limits, idempotency protection, service-specific schedules, validated clinic hours, verified BAA coverage, or robust outbox/retry reconciliation. A failure after the clinic email but before the patient email could create an inconsistent notification outcome; this needs hardening before production. If the intended use is subject to HIPAA, confirm appropriate Google account edition, BAA, and safeguards; ordinary Gmail must not be assumed to meet those requirements.
