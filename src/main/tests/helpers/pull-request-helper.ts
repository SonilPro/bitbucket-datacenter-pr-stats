import { APIRequestContext, expect, request } from '@playwright/test';

export const PROJECT_KEY = 'PROJECT_1';
export const REPO_KEY = 'rep_1';

// @ts-ignore -- actually the built-in TS config has this setup for us
const requestContext = await request.newContext({
    httpCredentials: {
        username: 'admin',
        password: 'admin'
    }
})

const AUTH_HEADER = 'Basic YWRtaW46YWRtaW4='; // admin:admin

export async function disablePullRequestOnBoarding(baseUrl: string) {
    const result = await requestContext.put(`${baseUrl}/rest/chaperone/1/chaperone/7.0-pull-request`, {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            Authorization: AUTH_HEADER,
        },
        data: 'the-value-doesnt-matter',
    });

    expect(result.ok()).toBeTruthy();
}

export async function createPullRequest(baseUrl: string, sourceBranch = 'basic_branching'): Promise<string> {
    const prRestApiUrl = `${baseUrl}/rest/api/latest/projects/${PROJECT_KEY}/repos/${REPO_KEY}/pull-requests`;
    const payload = {
        title: 'My Pull Request',
        description: '',
        state: 'OPEN',
        open: true,
        closed: false,
        fromRef: {
            id: `refs/heads/${sourceBranch}`,
            repository: {
                slug: REPO_KEY,
                name: null,
                project: {
                    key: PROJECT_KEY,
                },
            },
        },
        toRef: {
            id: 'refs/heads/master',
            repository: {
                slug: REPO_KEY,
                name: null,
                project: {
                    key: PROJECT_KEY,
                },
            },
        },
        locked: false,
        reviewers: [],
    };

    const result = await requestContext.post(prRestApiUrl, {
        headers: {
            'Content-type': 'application/json',
            Authorization: AUTH_HEADER,
        },
        data: payload,
    });

    expect(result.ok()).toBeTruthy();
    const { id: pullRequestId } = await result.json();
    expect(pullRequestId).not.toBeUndefined();

    return pullRequestId;
}

export async function deletePullRequest(baseUrl: string, pullRequestId: string, version = 0) {
    const prRestApiUrl = `${baseUrl}/rest/api/latest/projects/${PROJECT_KEY}/repos/${REPO_KEY}/pull-requests/${pullRequestId}`;

    const result = await requestContext.delete(prRestApiUrl, {
        headers: {
            'content-type': 'application/json',
            Authorization: AUTH_HEADER,
        },
        data: {
            version,
        },
    });

    expect(result.ok()).toBeTruthy();
}

export async function createRegularCommentOnPullRequest(
    baseUrl: string,
    pullRequestId: string,
    commentText = 'Testing is fun!',
) {
    const diffRestApiUrl = `${baseUrl}/rest/api/latest/projects/${PROJECT_KEY}/repos/${REPO_KEY}/pull-requests/${pullRequestId}/comments?diffType=EFFECTIVE`;

    const result = await requestContext.post(diffRestApiUrl, {
        headers: {
            'content-type': 'application/json',
            Authorization: AUTH_HEADER,
        },
        data: {
            text: commentText,
            severity: 'NORMAL',
        },
    });

    expect(result.ok()).toBeTruthy();
}
