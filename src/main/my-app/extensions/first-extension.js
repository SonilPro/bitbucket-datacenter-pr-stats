import { LinkExtension } from '@atlassian/clientside-extensions';

/**
 * @clientside-extension
 * @extension-point bitbucket.ui.pullrequest.overview.summary
 * @condition class com.atlassian.myapp.condition.AlwaysTrueCondition
 */
export default LinkExtension.factory((extensionAPI, context) => {
    // A glyph name from '@atlaskit/icon/glyph/add-circle';
    // Check the AK docs for more icons https://atlaskit.atlassian.com/packages/core/icon
    const iconBefore = 'add-circle';

    return {
        hidden: false,
        iconBefore,
        link: '#',
        label: 'New Extension',
        onAction: () => {
            console.log('Test easdxtension', context);
            console.log('test', extensionAPI);
        },
    };
});
