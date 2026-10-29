import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/products/:path*",
        "/customers/:path*",
        "/pos/:path*",
        "/sales/:path*",
        "/purchases/:path*",
        "/expenses/:path*",
        "/reports/:path*",
        "/settings/:path*",
    ],
}
