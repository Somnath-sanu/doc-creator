import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      authorization: {
        params: { scope: "repo user" },
      },
      profile(githubProfile, tokens) {
        return {
          id: githubProfile.id.toString(),
          name: githubProfile.name,
          email: githubProfile.email,
          image: githubProfile.avatar_url,
          repositoryCount: githubProfile.public_repos,
          reposUrl: githubProfile.repos_url,
          githubId: githubProfile.id,
          // Save GitHub OAuth access token here (custom property)
          githubAccessToken: tokens.access_token,
        };
      },
    }),
  ],
});
