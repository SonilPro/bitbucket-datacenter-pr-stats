import { ButtonExtension } from '@atlassian/clientside-extensions';

/**
 * @clientside-extension
 * @extension-point bitbucket.file-content.diff.toolbar.primary
 */
export default ButtonExtension.factory((pluginApi, context) => {
    return {
        label: 'My diff toolbar primary extension',
        onAction: () => {
            // eslint-disable-next-line no-alert -- this is just demo code making it obvious
            alert(
                'Tutorial: your extension point is rendering buttons correctly 🎉. This is the context received: ',
                context
            );
        },
    };
});
