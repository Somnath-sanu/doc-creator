import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { Octokit } from "octokit";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const get = action({
  args: {},
  // direct destructuring from ctx and args
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    console.log("userId:", userId);

    if (!userId) {
      return;
    }

    const userDetails = await ctx.runMutation(internal.test.getUser, {
      userId: userId,
    });

    console.log("userDetails:", userDetails);

    const githubToken = userDetails?.githubAccessToken;
    if (!githubToken) {
      throw new Error("No GitHub token found for user");
    }

    const octokit = new Octokit({ auth: githubToken });

    const repos = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: "all",
      per_page: 100,
      sort: "updated",
      direction: "desc",
    });
    // only keep non-forked repos owned by the user
    const myRepos = repos.data.filter(
      (repo) => !repo.fork && repo.owner.type === "User"
    );

    console.log("my repos:", myRepos); // send this to UI for display

    // For first repo, fetch tree properly:
    const refResp = await octokit.rest.git.getRef({
      owner: myRepos[0].owner.login,
      repo: myRepos[0].name,
      ref: "heads/main",
    });
    const commitSha = refResp.data.object.sha;

    const commitResp = await octokit.rest.git.getCommit({
      owner: myRepos[0].owner.login,
      repo: myRepos[0].name,
      commit_sha: commitSha,
    });
    const treeSha = commitResp.data.tree.sha;

    const treeResp = await octokit.rest.git.getTree({
      owner: myRepos[0].owner.login,
      repo: myRepos[0].name,
      tree_sha: treeSha,
      recursive: "true",
    });

    // For each file, fetch the content (could be optimized for large trees)
    const fileContents = await Promise.all(
      treeResp.data.tree
        .filter((item) => item.type === "blob")
        .map(async (file) => {
          const contentResp = await octokit.rest.git.getBlob({
            owner: myRepos[0].owner.login,
            repo: myRepos[0].name,
            file_sha: file.sha!,
          });
          const content = atob(contentResp.data.content || "");
          return { path: file.path, content };
        })
    );

    console.log("fileContents:", fileContents);
  },
});

export const getUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const dbUser = await ctx.db.get(userId);
    return dbUser;
  },
});
