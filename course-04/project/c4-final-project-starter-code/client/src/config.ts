// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'lx4bolli63'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE_TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'vukhiemtinh.jp.auth0.com',            // Auth0 domain
  clientId: 'GHFvFiCKpxx1RmHzfweWAwcJRTv6TLNH',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
