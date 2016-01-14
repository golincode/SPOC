## Contributing

Want to contribute? Great! Note that SPOC uses Grunt & NPM, so these will need to be installed:

```sh
$ npm i -g grunt
```

If you are using Windows (shame on you), you can find more information on getting this working by reading the FAQs on the [Grunt Website](http://gruntjs.com/frequently-asked-questions).


The [issue tracker](https://github.com/wearearchitect/SPOC/issues) is the preferred channel for bug reports, feature requests, and submitting pull requests.


### Bug reports

A bug is a **demonstrable, reproducible problem** that is caused by the code in the repository. Good bug reports are extremely helpful, so thanks!

Guidelines for bug reports:

  1. Use the GitHub issue search — check if the issue has already been reported.

  2. Check if the issue has been fixed — try to reproduce it using the latest `develop` branch in the repository.

  3. Isolate the problem — ideally create a reduced test case and a live example. This [CodePen](http://codepen.io/anon/pen/rVENKy), [JSFiddle](http://jsfiddle.net/og7ee99s/) and [JS Bin](http://jsbin.com/sevukihupi/1/edit?html,js,output) are helpful templates you can fork or clone.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If suitable, include the steps required to reproduce the bug.
>
>   1. This is the first step
>   2. This is the second step
>   3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being reported. This might include the lines of code that you have identified as causing the bug, and potential solutions (and your opinions on their merits).

### Feature requests

Feature requests are welcome, but please take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature.

To get approval for your feature request, please create an issue on the issue tracker with as much detail and context as possible. We'll take a look at it.

### Pull requests

Good pull requests are a fantastic help. They should remain focused in scope and avoid containing unrelated commits. Adhering to the following process is the best way to get your work included in the project:

  1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork, and configure the remotes:

    ```bash
    git clone https://github.com/<your-username>/SPOC.git
    cd SPOC
    git remote add upstream https://github.com/wearearchitect/SPOC.git
    ```

  2. If you cloned a while ago, get the latest changes from upstream:

    ```bash
    git checkout develop
    git pull [--rebase] upstream develop
    ```

  3. Create a new topic branch (off the main project `develop` branch) to contain your feature, change, or fix:

    ```bash
    git checkout -b <topic-branch-name>
    ```

  4. Build the distribution before committing to ensure your changes follow the coding standards and all build files are up to date.

    ```bash
    grunt
    ```

  5. Commit your changes in logical chunks. Please adhere to these [guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

  6. Locally merge (or rebase) the upstream development branch into your topic branch:

    ```bash
    git pull [--rebase] upstream develop
    ```

  7. Push your topic branch up to your fork:

    ```bash
    git push origin <topic-branch-name>
    ```

  8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description against the `develop` branch.

### Features Currently Missing:

 - Delete and update SP Lists
 - Upload files via API
 - SharePoint Search APIs
 - SharePoint Delve APIs
 - Yammer post messages


**By submitting a patch, you agree to allow the project owner to
license your work under the terms of the [MIT License](LICENSE).**