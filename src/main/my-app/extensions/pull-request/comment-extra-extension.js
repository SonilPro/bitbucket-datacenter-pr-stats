import { createRoot } from 'react-dom/client';
import { PanelExtension } from '@atlassian/clientside-extensions';

import { MyApp } from './myapp.js';

/**
 * @clientside-extension
 * @extension-point bitbucket.ui.pullrequest.comment.extra
 */
export default PanelExtension.factory((pluginApi, context) => {
    return {
        hidden: false,
        onAction: (panelApi) => {
            const { pullRequest } = context;
            let root;

            panelApi
                .onMount((element) => {
                    console.log('My comment panel extension', context);

                    root = createRoot(element);
                    root.render(<MyApp pullRequest={pullRequest} />);
                })
                .onUnmount(() => {
                    if (root) {
                        root.unmount();
                    }
                });
        },
    };
});
