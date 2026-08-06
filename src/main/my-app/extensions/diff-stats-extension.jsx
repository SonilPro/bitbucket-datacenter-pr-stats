import { LinkExtension } from '@atlassian/clientside-extensions';
import React from 'react';
import './diffStats.css';

// const DiffGraphicIcon = () => (
//     <svg
//         className="diff-graphic-icon"
//         viewBox="0 0 104 18"
//         width="104"
//         height="18"
//         aria-hidden="true"
//         focusable="false"
//         xmlns="http://www.w3.org/2000/svg"
//     >
//         <rect x="0" y="2" width="46" height="14" rx="4" fill="#cf222e" />
//         <rect x="52" y="2" width="52" height="14" rx="4" fill="#1a7f37" />
//     </svg>
// );

const DiffSummaryIcon = ({ insertions = 0, deletions = 0 }) => (
    <span className="diff-stat">
        <span className="diff-added">+{insertions}</span>
        <span className="diff-removed">-{deletions}</span>
    </span>
);

/**
 * @clientside-extension
 * @extension-point bitbucket.ui.pullrequest.overview.summary
 * @condition class com.atlassian.myapp.condition.AlwaysTrueCondition
 */
export default LinkExtension.factory((extensionAPI, context) => {
    const iconBefore = () => <DiffSummaryIcon />;

    fetch(
        `/bitbucket/rest/api/latest/projects/${context.project.key}/repos/${context.repository.slug}/pull-requests/${context.pullRequest.id}/diff-stats-summary`,
        {
            credentials: 'include',
        }
    )
        .then((response) => response.json())
        .then((data) => {
            const insertions = data.totalInsertions;
            const deletions = data.totalDeletions;
            const tooltip = `${insertions} lines added, ${deletions} lines removed`;
            extensionAPI.updateAttributes({
                tooltip,
                iconBefore: () => <DiffSummaryIcon insertions={insertions} deletions={deletions} />,
            });
        })
        .catch((error) => {
            console.error('Error fetching diff stats:', error);
        });

    return {
        hidden: false,
        label: '',
        iconBefore,
        link: '#',
        tooltip: 'Diff summary',
        onAction: () => {
            console.log('Diff stats clicked', context);
        },
    };
});
