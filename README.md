# Chessboxing AI Clips

This project is a web application built with React and TypeScript, using Vite for a fast and lean development environment. It's a unique application that allows users to discover and explore clips from Chessboxing - a hybrid sport that combines the physical demands of boxing with the mental challenge of chess

## Features

- **Search for Clips**: Users can search for specific clips based on their interests. For example, they can search for "knockouts", "checkmates", or even "terrible moves". The search functionality is powered by a backend API.

- **Clip Preview**: Users can preview a clip before deciding to add it to their list of highlights. The preview feature uses the Plyr library for a customizable video player.

- **Highlight Compilation**: Users can select multiple clips to create a highlight reel. They can choose to add background music to their compilation or keep it without music.

- **Shareable Highlights**: Once a highlight reel is created, users receive a unique URL that they can share on social media. The URL leads to a page where the highlight reel can be downloaded.

## Setup

The project uses Vite with React and TypeScript. To get started, clone the repository and install the dependencies using `npm install`. Then, start the development server using `npm run dev`.

## Code Structure

The main component of the application is `Home.tsx` (referenced from `app/src/Home.tsx`), which contains the logic for searching clips, previewing clips, and creating highlight reels. It also manages the state of the application, such as the list of search results and the currently selected clips.

## Assets

The project includes several assets, such as audio files for background music and a logo image. The logo image is used in various places in the application, such as the loading spinner and the header.
