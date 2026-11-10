# Animal Sale Waitlist Storage Handoff

The Animals for Sale waitlist form collects name, email, optional phone, animal interest, optional notes, and explicit permission to contact the visitor. Each successful submission is stored server-side.

## Storage and persistence

- Source file: `/data/waitlist/animal-sale-waitlist.csv` inside the website container.
- Format: UTF-8 CSV with quoted cells, one column per submitted field, readable by Excel.
- Columns: Submitted At (UTC), Name, Email, Phone, Animal Interest, Notes, Consent.
- Each Docker Compose environment has its **own named persistent volume**: `udderly-website-staging_waitlist-data` or `udderly-website-production_waitlist-data`.
- Website root filesystem remains read-only. Only the named waitlist volume is writable to the `node` user.
- The CSV is never copied into `public`, a Git commit, build output, a log, or a public download endpoint.
- The form is enabled only when `WAITLIST_DATA_DIR` is configured. A success message requires successful file append.

## Owner export

From an authorized SSH session on the server, copy the existing file directly into a private, access-controlled location (substitute the relevant container):

```bash
docker cp udderly-website-staging-website-1:/data/waitlist/animal-sale-waitlist.csv ./animal-sale-waitlist.csv
```

The file opens directly in Excel. To create a native `.xlsx`, open the CSV in Excel and use **Save As > Excel Workbook**. A future admin backend can import these rows.

Do **not** put the waitlist file in the website repository, an email attachment to an unauthorized recipient, or public cloud storage.

## Ongoing operations

- Back up the waitlist volume independently of website deploys and Git history.
- Before replacing a volume or moving servers, export and verify all submitted rows.
- Protect exports as personal information. Limit access to authorized farm staff.
- Confirm retention/privacy policy wording before public launch.
- Rate limiting is currently per app process. Use a reverse-proxy/WAF rate limiter as another safeguard.
- Staging test entries must not be treated as real production enquiries.
