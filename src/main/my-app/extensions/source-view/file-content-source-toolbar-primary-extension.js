import { ButtonExtension } from '@atlassian/clientside-extensions';

/**
 * @clientside-extension
 * @extension-point bitbucket.file-content.source.toolbar.primary
 */
export default ButtonExtension.factory((pluginApi, context) => {
    return {
        label: 'My source toolbar primary extension',
        onAction: () => {
            alert(
                'Tutorial: your extension point is rendering buttons correctly 🎉. This is the context received: ',
                context
            );
        },
    };
});
