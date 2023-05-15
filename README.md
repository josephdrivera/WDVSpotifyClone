# WDV Spotify Clone

## About The Project

This is a music search app that integrates with Spotify's REST Web API, allowing users to search for music and manage playlists.

Features:
* Clean UX/UI that closely matches Spotify
* JWT functionality to check for existing users
* CRUD application to search for music

### Built With

* MongoDB
* Express.js
* React
* Node.js

## Overview

This project is a music search application that integrates with Spotify's REST Web API.

### Key Features

- Sleek user interface and experience, resembling Spotify
- JWT implementation for verifying existing users
- A CRUD application for music search capabilities

## Technologies Utilized

In this section, the primary frameworks and libraries employed to develop this project are highlighted.

### Frontend

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Material-UI](https://mui.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

* Node.js
* npm
* MongoDB

### Installation

1. Clone the repository:

```shell
git clone https://github.com/josephdrivera/WDVSpotifyClone


cd WDVSpotifyClone
npm install

CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:3000/callback

npm start
