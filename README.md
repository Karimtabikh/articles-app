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

- Added lazy loading for the single post similar to tanstack 
- Used custom pokemon API for pokemon to test the pendingcomponent as it didn't work before because the page was empty
- Use prettier instead of biome, Kanso faced major issues with it   