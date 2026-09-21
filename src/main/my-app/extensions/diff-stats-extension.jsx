import { LinkExtension } from '@atlassian/clientside-extensions';
import './diffStats.css';
import * as navBuilder from 'bitbucket/util/navbuilder';

const StopwatchIcon = () => (
    <svg
        className="diff-stat-icon"
        viewBox="0 0 32 32"
        width={32}
        height={32}
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="m13.367 21.82-.012-.015L11.305 20l2.05-1.805a.554.554 0 0 0 .051-.777l-.011-.012-1.09-1.164a.545.545 0 0 0-.774-.023l-3.605 3.383a.546.546 0 0 0 0 .796l3.605 3.383a.56.56 0 0 0 .375.149c.149 0 .301-.063.399-.172l1.09-1.164a.548.548 0 0 0-.028-.774Zm13.75-15.703L21.875.875a3 3 0 0 0-2.117-.883H7A3.012 3.012 0 0 0 4 3v26a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V8.242c0-.793-.32-1.562-.883-2.125ZM20 3.242 24.758 8H20ZM25 29H7V3h10v6.5c0 .832.668 1.5 1.5 1.5H25Zm-7.898-15.625a.55.55 0 0 0-.684.375L13 25.508a.544.544 0 0 0 .375.68l1.523.445a.553.553 0 0 0 .684-.375L19 14.492a.544.544 0 0 0-.375-.68Zm1.53 4.805.013.015L20.695 20l-2.05 1.805a.554.554 0 0 0-.051.777l.011.012 1.09 1.164c.203.219.555.23.774.023l3.605-3.383a.546.546 0 0 0 0-.796l-3.605-3.383a.545.545 0 0 0-.774.023l-1.09 1.164a.548.548 0 0 0 .028.774Zm0 0"
            style={{
                stroke: 'none',
                fillRule: 'nonzero',
                fillOpacity: 1,
            }}
        />
    </svg>
);

const DiffSummaryIcon = ({ insertions = 0, deletions = 0, filesChanged = 0 }) => (
    <span className="diff-stat">
        <StopwatchIcon />
        <span className="diff-files-changed">
            {filesChanged} {filesChanged === 1 ? 'file' : 'files'}
        </span>
        <span className="diff-added">+{insertions}</span>
        <span className="diff-removed">-{deletions}</span>
    </span>
);

/**
 * @clientside-extension
 * @extension-point bitbucket.ui.pullrequest.overview.summary
 * @condition class com.aereiz.plugin.condition.AlwaysTrueCondition
 */
export default LinkExtension.factory((extensionAPI, context) => {
    const pullRequestUrl = navBuilder
        .rest('api', 'latest')
        .project(context.project.key)
        .repo(context.repository.slug)
        .pullRequest(context.pullRequest.id)
        .build();
    const diffPath = navBuilder
        .project(context.project.key)
        .repo(context.repository.slug)
        .pullRequest(context.pullRequest.id)
        .diff()
        .build();

    fetch(`${pullRequestUrl}/diff-stats-summary`, {
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            const insertions = data.totalInsertions;
            const deletions = data.totalDeletions;
            const filesChanged = data.filesChanged;
            const tooltip = `${filesChanged} files changed, ${insertions} lines added, ${deletions} lines removed`;
            extensionAPI.updateAttributes({
                tooltip,
                iconBefore: () => (
                    <DiffSummaryIcon
                        insertions={insertions}
                        deletions={deletions}
                        filesChanged={filesChanged}
                    />
                ),
            });
        })
        .catch((error) => {
            console.error('Error fetching diff stats:', error);
            extensionAPI.updateAttributes({
                hidden: true,
            });
        });

    return {
        hidden: false,
        label: '',
        link: diffPath,
        tooltip: 'Diff summary',
    };
});
