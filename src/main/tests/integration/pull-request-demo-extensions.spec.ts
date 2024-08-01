import { expect, test } from '@playwright/test';
import {
    createPullRequest,
    createRegularCommentOnPullRequest,
    deletePullRequest,
    disablePullRequestOnBoarding, PROJECT_KEY, REPO_KEY,
} from '../helpers/pull-request-helper';
import { queries } from 'pptr-testing-library';

let pullRequestId = null;

test.beforeAll(async ({ request, baseURL }) => {
    await disablePullRequestOnBoarding(baseURL);
    pullRequestId = await createPullRequest(baseURL);
    await createRegularCommentOnPullRequest(baseURL, pullRequestId);
})

test.beforeEach(async ({page, baseURL}) => {
    await page.goto(`${baseURL}/projects/${PROJECT_KEY}/repos/${REPO_KEY}/pull-requests/${pullRequestId}`)
    expect(page.getByText('My overview extension')).toBeTruthy(); // CSE is loaded
})

test.afterAll(async ({request, baseURL}) => {
    await deletePullRequest(baseURL, pullRequestId);
})

test('should render an option item for the "bitbucket.ui.pullrequest.action" extension point', async ({ page }) => {
    // given
    const extensionLabel = 'My pull request action extension';

    // when
    await page.getByTestId('more-actions--trigger').click();

    await expect(page.getByTestId('more-actions--content')).toBeVisible();
    const option = page.getByText(extensionLabel);

    // then
    await expect(option).toBeVisible();
});

test('should render a new button item for the "bitbucket.ui.pullrequest.diff.toolbar" extension point', async ({page}) => {
    // given
    const extensionLabel = 'My diff toolbar extension';

    // when
    await page.getByRole('tab', { name: 'Diff' }).click();

    // Wait for change toolbar to be rendered
    const extensionButton = page.getByRole('button', { name: extensionLabel });

    // then
    await expect(extensionButton).toBeVisible();
});

test('should render a comment option item for the "bitbucket.ui.pullrequest.comment.action" extension point', async ({page}) => {
    // given
    const extensionLabel = 'My comment action extension';

    // when
    await expect(page.locator('.comment')).toBeVisible()

    await page.getByTestId('comment-options--trigger').click();
    await expect(page.getByTestId('comment-options--content')).toBeVisible();

    const option = page.getByText(extensionLabel);

    // then
    await expect(option).toBeVisible({ timeout: 20_000 });
});

test('should render a comment panel item for the "bitbucket.ui.pullrequest.comment.extra" extension point', async ({page}) => {
    // given
    const extensionLabel = 'My comment extension';

    // when
    await expect(page.getByText('Testing is fun!')).toBeVisible()
    const label = page.getByText(extensionLabel);

    // then
    await expect(label).toBeVisible({ timeout: 10_000 });
});

test('should render a table cell item for the "bitbucket.ui.pullrequest.commits.table.column.after" extension point', async ({page}) => {
    // given
    const extensionCellHeaderLabel = 'My ext. header';
    const extensionCellLabel = 'My ext. cell';

    // when
    await page.getByRole('tab', { name: 'Commits' }).click();

    await expect(page.getByRole('tabpanel')).toBeVisible();

    const header = page.getByRole('columnheader', { name: extensionCellHeaderLabel });
    const cell = page.getByRole('button', { name: extensionCellLabel });

    // then
    await expect(header).toBeVisible();
    await expect(cell).toBeVisible();
});
