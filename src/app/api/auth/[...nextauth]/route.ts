import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from "next-auth/providers/discord";
import Api from '@/server-actions/Api';

const handler = NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0"
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ session, token, user, }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user){

                if(token.sub) session.user.id = token.sub
                if(token.account) session.user.provider = token.account.provider
                if(token.profile.data){
                    session.user.handle = token.profile.data.username
                } else if (token.profile){
                    session.user.handle = token.profile.username
                }
                session.user.email = token.email
                // session.user.image = token.picture
            }
            

            console.log("DJFD")
            console.log(session)
            return session
        },
        async jwt({ token, account, user, profile, session}) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user)    token.user = user
            if (profile) token.profile = profile
            if (account) token.account = account

            return token
        }
    }
})

export { handler as GET, handler as POST }