import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions, BasicAuthProvider } from '@wexcute/catalyst-next-auth-config';
interface RouteHandlerContext {
  params: { nextauth: string[] };
}

const handler = async function auth(req: NextRequest, context: RouteHandlerContext) {
  return await NextAuth(
    req,
    context,
    authOptions({ providers: [BasicAuthProvider({ endpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/login` })] }),
  );
};

export { handler as GET, handler as POST };
