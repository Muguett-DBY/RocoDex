export const CSTD_SECURITY_TXT = `Contact: mailto:cstd@custard.top
Expires: 2027-08-09T00:00:00.000Z
Preferred-Languages: zh, en
Canonical: https://custard.top/.well-known/security.txt
`;

export function createCstdSecurityTxtResponse() {
  return new Response(CSTD_SECURITY_TXT, {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
