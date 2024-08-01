import Button from '@atlaskit/button';
// eslint-disable-next-line import/no-unresolved -- No Node module, this comes from the product at runtime
import * as formatter from 'wrm/i18n';
// eslint-disable-next-line import/no-unresolved -- No Node module, this comes from the product at runtime
import * as navbuilder from 'bitbucket/util/navbuilder';

function MyApp({ pullRequest }) {
    const pullRequestUrl = navbuilder.pullRequest(pullRequest).build();

    return (
        <div>
            <Button>{formatter.I18n.getText('my.extension.button.label')}</Button>
            <p>{formatter.I18n.getText('my.extension.comment.label')}</p>
            <pre>Pull Request URL: {pullRequestUrl}</pre>
        </div>
    );
}

export { MyApp };
