# Daily notes

## 17/04/2024

- Added tailwindcss to the project
- Preferred using scss over css in development to be able to use its features
- Refactored the `tailwind.config.js` file to `tailwind.config.ts` to be able to use typescript which will be handy with types safety and intellisense when adding plugins or extending the configuration
- Made sure the `content` in the `tailwind.config.ts` file is set to the proper paths


## 18/04/2024

- Added Biome to the project
    - Watched this https://www.youtube.com/watch?v=evA-2q6oEIo&ab_channel=KevinWade and learned it from him
- Fixed directory route for the posts as in /posts/$postId
    - Used this https://tanstack.com/router/latest/docs/framework/react/guide/route-trees Directory Routes
    - Used this playlist https://www.youtube.com/watch?v=xUrbLlcrIXY&list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5&index=3&ab_channel=DevLeonardo

## 20/04/2024

- Most important doc: https://tanstack.com/router/v1/docs/framework/react/api/router/RouterOptionsType, When route is loading the pending components needs a defaultPendingMs value
    (Kanso Fixed: It does not need it, but it rather defaults to 1000ms which is a long period)
- Added lazy loading for the single post similar to tanstack 
- Used custom pokemon API for pokemon to test the pendingcomponent as it didn't work before because the page was empty
- Use prettier instead of biome, Kanso faced major issues with it   

## 21/04/2024

- Using active psedo class for the active route, also there is option used in the tanstack docs for the Link activeProps={{className: 'font-bold',}}
- Name the component in a better hierarchical way