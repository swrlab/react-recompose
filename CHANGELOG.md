## react-recompose v0.32.0

- feat: make release usable from github
- fix: move recompose-build to build dir
- feat: add dependabot checks
- chore: update ci-runs (actions, node, react)
- chore: update recompose
  - fix: package.json version and license
  - chore: remove peer react v14, add v18
  - chore: update node-dependencies
    - @babel/runtime -> ^7.20.7
    - hoist-non-react-statics -> ^3.3.2
    - symbol-observable -> ^4.0.0
- chore: update recompose-build
  - chore: update babel, eslint and flow
    - @babel and packages
    - babel-eslint -> @babel/eslint-parser
    - eslint and plugins (fix new eslint-errors)
    - prettier and plugins (reformat code)
    - flow-bin (fix new flow-errors)
  - chore: major updates
    - chalk -> ^4.1.2
    - change-case -> ^4.1.2
    - codecov -> ^3.8.3
    - cross-env -> ^7.0.3
    - husky -> ^8.0.3
    - lint-staged -> ^13.1.0
    - shelljs -> ^0.8.5
    - sinon -> ^15.0.1
    - xstream -> ^11.14.0
  - fix: breaking updates
    - rollup -> ^3.10.0
    - rollup-plugins -> @rollup
    - jest -> ^29.3.1
    - baconjs -> ^3.0.17
  - fix: holdback updates
    - chalk of v5 (pure ESM)
    - enzyme-adapter-react-18 (react 18)
    - react and react-dom of v18 (createRoot)
    - rxjs of v6 and v7 (Rx.Observable.from)
  - fix: require react v16.3 or newer
  - chore: update node and npm versions
  - security: update peer-dependencies
- chore: update flow-example
  - fix: package.json name
  - chore: update node-dependencies
    - glamor -> ^2.20.40
    - react -> ^18.2.0
    - react-dom -> ^18.2.0
    - recompose -> ^0.30.0
    - react-scripts -> 5.0.1
  - chore: update flow and fix errors
  - security: update peer-dependencies

## react-recompose v0.31.2

- fix: update dependencies
  - @babel/runtime -> ^7.16.3
  - hoist-non-react-statics -> ^2.5.5
  - react-lifecycles-compat -> ^3.0.4
  - symbol-observable -> ^1.2.0

## react-recompose v0.31.1

- build: update devDependencies, yarn.lock & size snapshot
  - updates and modernizes many devDependencies, as originally proposed in:
    - https://github.com/acdlite/recompose/pull/826
  - completely removes dev dependency on fbjs from yarn.lock ref:
    - https://github.com/acdlite/recompose/issues/825
  - should resolve other reported vulnerability warnings from dev dependencies ref:
    - https://github.com/acdlite/recompose/issues/817
  - resolves a large number of other Yarn dev audit warnings
- Clarify API docs about Relay classic
  - PR: https://github.com/acdlite/recompose/pull/753
  - issue: https://github.com/acdlite/recompose/issues/743
- Add links to HOC criticism
  - original source: https://github.com/acdlite/recompose/pull/531
- include the correct README.md for react-recompose in the npm package build

## react-recompose v0.31.0

based on: recompose v0.30.0

- replace use of React.createFactory
  - PR: https://github.com/acdlite/recompose/pull/795
  - issue: https://github.com/acdlite/recompose/issues/806
- support React 17
  - PR: https://github.com/acdlite/recompose/pull/821
  - issue: https://github.com/acdlite/recompose/issues/827
- documentation updates from these PRs:
  - https://github.com/acdlite/recompose/pull/791
  - https://github.com/acdlite/recompose/pull/798
  - https://github.com/acdlite/recompose/pull/811
- refactor: enable prefer-destructuring rule & update src
- sort recompose-relay peerDependencies
- remove lodash from recompose-relay (not needed)
- docs: add licenses of dependencies bundled in dist
- post-v0.30.0 updates from master branch of https://github.com/acdlite/recompose
  - remove fbjs from recompose dependencies
    - PR: https://github.com/acdlite/recompose/pull/744
    - issue: https://github.com/acdlite/recompose/issues/742
  - enable flow strict in index.js.flow
    - PR: https://github.com/acdlite/recompose/pull/745
  - documentation updates from these PRs:
    - https://github.com/acdlite/recompose/pull/765
    - https://github.com/acdlite/recompose/pull/746
