const { queries, waitFor } = require('pptr-testing-library');
const { getRepository, getProject, getBaseUrl } = require('./env-helper.js');

/**
 * @param {import("puppeteer").Page} page
 * @param {string} sourceBranch
 * @return {Promise<{pullRequestId: number}>}
 */
async function createPullRequest(page, sourceBranch = 'basic_branching') {
    console.debug(`Pull Request: Creating a new pull request...`);

    const baseUrl = getBaseUrl();
    const project = getProject();
    const repository = getRepository();

    const prRestApiUrl = `${baseUrl}/rest/api/latest/projects/${project}/repos/${repository}/pull-requests`;
    const payload = {
        title: 'My Pull Request',
        description: '',
        state: 'OPEN',
        open: true,
        closed: false,
        fromRef: {
            id: `refs/heads/${sourceBranch}`,
            repository: {
                slug: repository,
                name: null,
                project: {
                    key: project,
                },
            },
        },
        toRef: {
            id: 'refs/heads/master',
            repository: {
                slug: repository,
                name: null,
                project: {
                    key: project,
                },
            },
        },
        locked: false,
        reviewers: [],
    };

    const pullRequestIdOrError = await page.evaluate(
        async (url, requestBody) => {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status !== 201) {
                return {
                    error: await response.text(),
                };
            }

            const { id: pullRequestId } = await response.json();

            return pullRequestId;
        },
        prRestApiUrl,
        payload
    );

    if (pullRequestIdOrError && pullRequestIdOrError.error) {
        throw new Error(pullRequestIdOrError.error);
    }

    const pullRequestId = pullRequestIdOrError;

    console.debug(`Pull Request: A new pull request ${pullRequestId} was created`);

    return {
        pullRequestId,
    };
}

/**
 * @param {import("puppeteer").Page} page
 * @param {number} pullRequestId
 * @param {number} version
 * @return {Promise<void>}
 */
async function deletePullRequest(page, pullRequestId, version = 0) {
    console.debug(`Pull Request: Deleting pull request ${pullRequestId}...`);

    const baseUrl = getBaseUrl();
    const project = getProject();
    const repository = getRepository();

    const prRestApiUrl = `${baseUrl}/rest/api/latest/projects/${project}/repos/${repository}/pull-requests/${pullRequestId}`;
    const payload = {
        version,
    };

    const result = await page.evaluate(
        // eslint-disable-next-line consistent-return
        async (url, requestBody) => {
            const response = await fetch(url, {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status !== 204) {
                return {
                    error: await response.text(),
                };
            }
        },
        prRestApiUrl,
        payload
    );

    if (result && result.error) {
        throw new Error(result.error);
    }

    console.debug(`Pull Request: Pull request ${pullRequestId} was deleted`);
}

/**
 * @param {import("puppeteer").Page} page
 * @param {number} pullRequestId
 * @param {string} commentText
 * @return {Promise<void>}
 */
async function createRegularCommentOnPullRequest(
    page,
    pullRequestId,
    commentText = 'Testing is fun!'
) {
    console.debug('[Pull Request]: Creating regular comment...');

    const baseUrl = getBaseUrl();
    const project = getProject();
    const repository = getRepository();

    const diffRestApiUrl = `${baseUrl}/rest/api/latest/projects/${project}/repos/${repository}/pull-requests/${pullRequestId}/comments?diffType=EFFECTIVE`;

    await page.evaluate(
        async (url, text) => {
            const payload = { text, severity: 'NORMAL' };

            await fetch(url, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        },
        diffRestApiUrl,
        commentText
    );

    console.debug('[Pull Request]: Regular comment created.');
}

/**
 * @param {import("puppeteer").ElementHandle} $document
 * @return {Promise<void>}
 */
async function waitForCseToBeLoaded($document) {
    await waitFor(() => queries.getByText($document, 'My overview extension'));
}

module.exports = {
    createPullRequest,
    deletePullRequest,
    createRegularCommentOnPullRequest,
    waitForCseToBeLoaded,
};
