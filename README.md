# Daily notes

## 17/04/2024

- Added tailwindcss to the project
- Preferred using scss over css in development to be able to use its features
- Refactored the `tailwind.config.js` file to `tailwind.config.ts` to be able to use typescript which will be handy with types safety and intellisense when adding plugins or extending the configuration
- Made sure the `content` in the `tailwind.config.ts` file is set to the proper paths

## 11/04/2024

- Using prettier for formatting and biome for linting 
- Important option in biome lintingis useExhaustiveDependencies (was warn now error), it helps react hooks that have dependencies like useEffect and useCallback to work properly 
    Enforce all dependencies are correctly specified in a React hook. docs https://biomejs.dev/linter/rules/use-exhaustive-dependencies/
- Personal project can config prettier as needed, big project the company config will be followed