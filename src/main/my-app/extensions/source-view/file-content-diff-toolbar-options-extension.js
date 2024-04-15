import { ButtonExtension } from '@atlassian/clientside-extensions';

/**
 * @clientside-extension
 * @extension-point bitbucket.file-content.diff-view.options
 */
export default ButtonExtension.factory((pluginApi, context) => {
    return {
        label: 'My extension in options',
        onAction: () => {
            alert(
                'Tutorial: your extension point is rendering buttons correctly 🎉. This is the context received: ',
                context
            );
        },
    };
});
